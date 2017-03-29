/*

config.js
=========

This object returns all config info for the app. It handles reading the `testem.yml`
or `testem.json` config file.

*/
'use strict';


var os = require('os');
var fs = require('fs');
var yaml = require('js-yaml');
var log = require('npmlog');
var path = require('path');
var glob = require('glob');
var url = require('url');
var querystring = require('querystring');
var Bluebird = require('bluebird');

var browser_launcher = require('./browser_launcher');
var LauncherFactory = require('./launcher-factory');
var Chars = require('./chars');
var pad = require('./strutils').pad;
var isa = require('./isa');
var fileExists = require('./fileutils').fileExists;

var knownBrowsers = require('./utils/known-browsers');
var globAsync = Bluebird.promisify(glob);

function Config(appMode, progOptions, config) {
  this.appMode = appMode;
  this.progOptions = progOptions || {};
  this.fileOptions = {};
  this.config = config || {};
  this.getters = {
    test_page: 'getTestPage'
  };

  if (appMode === 'dev') {
    this.progOptions.reporter = 'dev';
    this.progOptions.parallel = -1;
  }

  if (this.progOptions.debug === true) {
    this.progOptions.debug = 'testem.log';
  }

  if (appMode === 'ci') {
    this.progOptions.disable_watching = true;
    this.progOptions.single_run = true;
  }
}

Config.prototype.read = function(callback) {
  var configFile = this.progOptions.file;

  if (configFile) {
    this.readConfigFile(configFile, callback);
  } else {
    log.info('Seeking for config file...');

    // Try all testem.json, testem.yml and testem.js
    // testem.json gets precedence
    var files = ['testem.json', '.testem.json', '.testem.yml', 'testem.yml', 'testem.js', '.testem.js'];
    return Bluebird.filter(files.map(this.resolveConfigPath.bind(this)), fileExists).then(function(matched) {
      var configFile = matched[0];
      if (configFile) {
        this.readConfigFile(configFile, callback);
      } else {
        if (callback) {
          callback.call(this);
        }
      }
    }.bind(this));
  }
};

Config.prototype.resolvePath = function(filepath) {
  if (filepath[0] === '/') {
    return filepath;
  }

  return path.resolve(this.cwd(), filepath);
};

Config.prototype.resolveConfigPath = function(filepath) {
  if (this.progOptions.config_dir) {
    return path.resolve(this.progOptions.config_dir, filepath);
  } else {
    return this.resolvePath(filepath);
  }
};

Config.prototype.reverseResolvePath = function(filepath) {
  return path.relative(this.cwd(), filepath);
};

Config.prototype.cwd = function() {
  return this.get('cwd') || process.cwd();
};

Config.prototype.readConfigFile = function(configFile, callback) {
  var self = this;
  if (!configFile) { // allow empty configFile for programmatic setups
    if (callback) {
      callback.call(self);
    }
  } else if (configFile.match(/\.js$/)) {
    this.readJS(configFile, callback);
  } else if (configFile.match(/\.json$/)) {
    this.readJSON(configFile, callback);
  } else if (configFile.match(/\.yml$/)) {
    this.readYAML(configFile, callback);
  } else {
    log.error('Unrecognized config file format for ' + configFile);
    if (callback) {
      callback.call(self);
    }
  }
};

Config.prototype.readJS = function(configFile, callback) {
  this.fileOptions = require(this.resolveConfigPath(configFile));
  if (callback) {
    callback.call(this);
  }
};

Config.prototype.readYAML = function(configFile, callback) {
  var self = this;
  fs.readFile(configFile, function(err, data) {
    if (!err) {
      var cfg = yaml.load(String(data));
      self.fileOptions = cfg;
    }
    if (callback) {
      callback.call(self);
    }
  });
};

Config.prototype.readJSON = function(configFile, callback) {
  var self = this;
  fs.readFile(configFile, function(err, data) {
    if (!err) {
      var cfg = JSON.parse(data.toString());
      self.fileOptions = cfg;
      self.progOptions.file = configFile;
    }
    if (callback) {
      callback.call(self);
    }
  });
};

Config.prototype.defaults = {
  host: 'localhost',
  port: 7357,
  url: function() {
    var scheme = 'http';
    if (this.get('key') || this.get('pfx')) {
      scheme = 'https';
    }
    return scheme + '://' + this.get('host') + ':' + this.get('port') + '/';
  },
  parallel: 1,
  reporter: 'tap',
  bail_on_uncaught_error: true,
  browser_start_timeout: 30,
  browser_disconnect_timeout: 10
};

Config.prototype.mergeUrlAndQueryParams = function(urlString, queryParamsObj) {
  if (!queryParamsObj) {
    return urlString;
  }

  if (typeof queryParamsObj === 'string') {
    if (queryParamsObj[0] === '?') {
      queryParamsObj = queryParamsObj.substr(1);
    }
    queryParamsObj = querystring.parse(queryParamsObj);
  }

  var urlObj = url.parse(urlString);
  var outputQueryParams = querystring.parse(urlObj.query) || {};
  Object.keys(queryParamsObj).forEach(function(param) {
    outputQueryParams[param] = queryParamsObj[param];
  });
  urlObj.query = outputQueryParams;
  urlObj.search = querystring.stringify(outputQueryParams)
                    .replace(/\=&/g, '&')
                    .replace(/=$/, '');
  urlObj.path = urlObj.pathname + urlObj.search;
  return url.format(urlObj);
};

Config.prototype.getTestPage = function() {
  var testPage = this.getConfigProperty('test_page');
  var queryParams = this.getConfigProperty('query_params');
  var self = this;

  if (!Array.isArray(testPage)) {
    testPage = [testPage];
  }

  return testPage.map(function(page) {
    return self.mergeUrlAndQueryParams(page, queryParams);
  });
};

Config.prototype.getConfigProperty = function(key) {
  if (this.config && key in this.config) {
    return this.config[key];
  }
  if (key in this.progOptions && typeof this.progOptions[key] !== 'undefined') {
    return this.progOptions[key];
  }
  if (key in this.fileOptions && typeof this.fileOptions[key] !== 'undefined') {
    return this.fileOptions[key];
  }
  if (key in this.defaults) {
    var defaultVal = this.defaults[key];
    if (typeof defaultVal === 'function') {
      return defaultVal.call(this);
    } else {
      return defaultVal;
    }
  }
};

Config.prototype.get = function(key) {
  var getterKey = this.getters[key];
  var getter = getterKey && this[getterKey];
  if (getter) {
    return getter.call(this, key);
  } else {
    return this.getConfigProperty(key);
  }
};

Config.prototype.set = function(key, value) {
  if (!this.config) {
    this.config = {};
  }
  this.config[key] = value;
};

Config.prototype.isCwdMode = function() {
  return !this.get('src_files') && !this.get('test_page');
};

Config.prototype.getAvailableLaunchers = function(cb) {
  var self = this;

  var browsers = knownBrowsers(process.platform, self);
  browser_launcher.getAvailableBrowsers(self, browsers, function(err, availableBrowsers) {
    if (err) {
      return cb(err);
    }

    var availableLaunchers = {};
    availableBrowsers.forEach(function(browser) {
      var newLauncher = new LauncherFactory(browser.name, browser, self);
      availableLaunchers[browser.name.toLowerCase()] = newLauncher;
    });

    // add custom launchers
    var customLaunchers = self.get('launchers');
    if (customLaunchers) {
      for (var name in customLaunchers) {
        var newLauncher = new LauncherFactory(name, customLaunchers[name], self);
        availableLaunchers[name.toLowerCase()] = newLauncher;
      }
    }
    cb(null, availableLaunchers);
  });
};

Config.prototype.getLaunchers = function(cb) {
  var self = this;
  this.getAvailableLaunchers(function(err, availableLaunchers) {
    if (err) {
      return cb(err);
    }

    self.getWantedLaunchers(availableLaunchers, cb);
  });
};

Config.prototype.getWantedLauncherNames = function(available) {
  var launchers = this.get('launch');
  if (launchers) {
    launchers = launchers.toLowerCase().split(',');
  } else if (this.appMode === 'dev') {
    launchers = this.get('launch_in_dev') || [];
  } else {
    launchers = this.get('launch_in_ci') || Object.keys(available);
  }

  var skip = this.get('skip');
  if (skip) {
    skip = skip.toLowerCase().split(',');
    launchers = launchers.filter(function(name) {
      return skip.indexOf(name) === -1;
    });
  }
  return launchers;
};

Config.prototype.getWantedLaunchers = function(available, cb) {
  var launchers = [];
  var wanted = this.getWantedLauncherNames(available);
  var self = this;
  var err = null;

  wanted.forEach(function(name) {
    var launcher = available[name.toLowerCase()];
    if (!launcher) {
      if (self.appMode === 'dev' || self.get('ignore_missing_launchers')) {
        log.warn('Launcher "' + name + '" is not recognized.');
      } else {
        err = new Error('Launcher ' + name + ' not found. Not installed?');
      }
    } else {
      launchers.push(launcher);
    }
  });
  cb(err, launchers);
};

Config.prototype.printLauncherInfo = function() {
  var self = this;
  this.getAvailableLaunchers(function(err, launchers) {
    var launch_in_dev = (self.get('launch_in_dev') || [])
      .map(function(s) {return s.toLowerCase();});
    var launch_in_ci = self.get('launch_in_ci');
    if (launch_in_ci) {
      launch_in_ci = launch_in_ci.map(function(s) {return s.toLowerCase();});
    }
    launchers = Object.keys(launchers).map(function(k) {return launchers[k];});
    console.log('Have ' + launchers.length + ' launchers available; auto-launch info displayed on the right.');
    console.log(); // newline
    console.log('Launcher      Type          CI  Dev');
    console.log('------------  ------------  --  ---');
    console.log(launchers.map(function(launcher) {
      var protocol = launcher.settings.protocol;
      var kind = protocol === 'browser' ?
        'browser' : (
          protocol === 'tap' ?
            'process(TAP)' : 'process');
      var dev = launch_in_dev.indexOf(launcher.name.toLowerCase()) !== -1 ?
        Chars.mark :
        ' ';
      var ci = !launch_in_ci || launch_in_ci.indexOf(launcher.name.toLowerCase()) !== -1 ?
        Chars.mark :
        ' ';
      return (pad(launcher.name, 14, ' ', 1) +
        pad(kind, 12, ' ', 1) +
        '  ' + ci + '    ' + dev + '      ');
    }).join('\n'));
  });
};

Config.prototype.getFileSet = function(want, dontWant, callback) {
  var self = this;
  if (isa(want, String)) {
    want = [want]; // want is an Array
  }
  if (isa(dontWant, String)) {
    dontWant = [dontWant]; // dontWant is an Array
  }

  // Filter glob < 6 negation patterns to still support them
  // See https://github.com/isaacs/node-glob/tree/3f883c43#comments-and-negation
  var positiveWants = [];
  want.forEach(function(patternEntry) {
    var pattern = isa(patternEntry, String) ? patternEntry : patternEntry.src;
    if (pattern.indexOf('!') === 0) {
      return dontWant.push(pattern.substring(1));
    }

    positiveWants.push(patternEntry);
  });

  dontWant = dontWant.map(function(p) {
    return p ? self.resolvePath(p) : p;
  });
  Bluebird.reduce(positiveWants, function(allThatIWant, patternEntry) {
    var pattern = isa(patternEntry, String) ? patternEntry : patternEntry.src;
    var attrs = patternEntry.attrs || [];
    var patternUrl = url.parse(pattern);

    if (patternUrl.protocol === 'file:') {
      pattern = patternUrl.hostname + patternUrl.path;
    } else if (patternUrl.protocol) {
      return allThatIWant.concat({src: pattern, attrs: attrs});
    }

    return globAsync(self.resolvePath(pattern), { ignore: dontWant }).then(function(files) {
      return allThatIWant.concat(files.map(function(f) {
        f = self.reverseResolvePath(f);
        return {src: f, attrs: attrs};
      }));
    });
  }, []).asCallback(callback);
};

Config.prototype.getSrcFiles = function(callback) {
  var srcFiles = this.get('src_files') || '*.js';
  var srcFilesIgnore = this.get('src_files_ignore') || '';
  this.getFileSet(srcFiles, srcFilesIgnore, callback);
};

Config.prototype.getServeFiles = function(callback) {
  var want = this.get('serve_files') || this.get('src_files') || '*.js';
  var dontWant = this.get('serve_files_ignore') || this.get('src_files_ignore') || '';
  this.getFileSet(want, dontWant, callback);
};

Config.prototype.getUserDataDir = function() {
  if (this.get('user_data_dir')) {
    return path.resolve(this.cwd(), this.get('user_data_dir'));
  }

  return os.tmpdir();
};

Config.prototype.getHomeDir = function() {
  return process.env.HOME || process.env.USERPROFILE;
};

Config.prototype.getCSSFiles = function(callback) {
  var want = this.get('css_files') || '';
  this.getFileSet(want, '', callback);
};

Config.prototype.getAllOptions = function() {
  var options = [];
  function getOptions(o) {
    if (!o) {
      return;
    }
    if (o.options) {
      o.options.forEach(function(o) {
        options.push(o.name());
      });
    }
    getOptions(o.parent);
  }
  getOptions(this.progOptions);
  return options;
};

Config.prototype.getTemplateData = function(cb) {
  var ret = {};
  var options = this.getAllOptions();
  var key;
  for (key in this.progOptions) {
    if (options.indexOf(key) !== -1) {
      ret[key] = this.progOptions[key];
    }
  }
  for (key in this.fileOptions) {
    ret[key] = this.fileOptions[key];
  }
  for (key in this.config) {
    ret[key] = this.config[key];
  }
  this.getServeFiles(function(err, files) {
    var replaceSlashes = function(f) {
      return {src: f.src.replace(/\\/g, '/'), attrs: f.attrs};
    };

    ret.serve_files = files.map(replaceSlashes);

    this.getCSSFiles(function(err, files) {
      ret.css_files = files.map(replaceSlashes);
      if (cb) {
        cb(err, ret);
      }
    });
  }.bind(this));
};

module.exports = Config;

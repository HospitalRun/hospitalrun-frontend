'use strict';

var log = require('npmlog');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var path = require('path');
var Bluebird = require('bluebird');

var template = require('./strutils').template;
var ProcessCtl = require('./process-ctl');

var rimrafAsync = Bluebird.promisify(rimraf);
var mkdirpAsync = Bluebird.promisify(mkdirp);

function Launcher(name, settings, config) {
  this.name = name;
  this.config = config;
  this.settings = settings;
  this.setupDefaultSettings();
  this.id = settings.id || String(Math.floor(Math.random() * 10000));

  this.processCtl = new ProcessCtl(name);
}

Launcher.prototype = {
  setupDefaultSettings: function() {
    var settings = this.settings;
    if (settings.protocol === 'tap' && !('hide_stdout' in settings)) {
      settings.hide_stdout = true;
    }
  },
  isProcess: function() {
    return this.settings.protocol !== 'browser';
  },
  protocol: function() {
    return this.settings.protocol || 'process';
  },
  commandLine: function() {
    if (this.settings.command) {
      return '"' + this.settings.command + '"';
    } else if (this.settings.exe) {
      return '"' + this.settings.exe +
        ' ' + this.getArgs().join(' ') + '"';
    }
  },
  start: function() {
    return this.launch();
  },
  launch: function() {
    var self = this;
    var settings = this.settings;
    var dir = this.browserTmpDir(this.config, this.id);

    return rimrafAsync(dir).then(function() {
      return mkdirpAsync(dir);
    }).then(function() {
      if (settings.setup) {
        return Bluebird.fromCallback(function(setupCallback) {
          settings.setup.call(self, self.config, setupCallback);
        });
      }

      return Bluebird.resolve();
    }).then(function() {
      return self.doLaunch();
    });
  },
  doLaunch: function() {
    var settings = this.settings;
    var self = this;
    var options = {};

    if (settings.cwd) {
      options.cwd = settings.cwd;
    }

    if (settings.exe) {
      var args = self.getArgs();
      args = self.template(args);

      return this.processCtl.spawn(settings.exe, args, options);
    } else if (settings.command) {
      var cmd = this.template(settings.command);
      log.info('cmd: ' + cmd);

      return this.processCtl.exec(cmd, options);
    } else {
      return Bluebird.reject(new Error('No command or exe/args specified for launcher ' + this.name));
    }
  },
  getId: function() {
    return this.isProcess() ? -1 : this.id;
  },
  getUrl: function() {
    var baseUrl = this.config.get('url');
    var testPage = this.settings.test_page;
    var id = this.getId();

    return baseUrl + id + (testPage ? '/' + testPage : '');
  },
  getArgs: function() {
    var settings = this.settings;
    var url = this.getUrl();
    var args = [url];
    if (settings.args instanceof Array) {
      args = settings.args.concat(args);
    } else if (settings.args instanceof Function) {
      args = settings.args.call(this, this.config, url);
    }
    return args;
  },
  template: function(thing) {
    if (Array.isArray(thing)) {
      return thing.map(this.template, this);
    } else {
      var params = {
        cwd: this.config.cwd(),
        url: this.getUrl(),
        baseUrl: this.config.get('url'),
        port: this.config.get('port'),
        testPage: this.settings.test_page || '',
        id: this.getId()
      };
      return template(thing, params);
    }
  },
  browserTmpDir: function() {
    var userDataDir = this.config.getUserDataDir();

    return path.join(userDataDir, 'testem-' + this.id);
  }
};

module.exports = Launcher;

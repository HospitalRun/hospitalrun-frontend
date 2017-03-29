'use strict';

var capitalize = require('./capitalize');
var log = require('npmlog');

function Validation() {
  this.knownBrowser = null;
  this.messages = [];
  this.valid = true;
}

function warn(message) {
  log.warn('', message);
}

module.exports = {
  addCustomArgs: function(knownBrowsers, config) {
    if (!knownBrowsers || !config) { return; }

    var browserArgs = config.get('browser_args');
    var browserName;

    if (browserArgs && typeof browserArgs === 'object') {
      for (browserName in browserArgs) {
        if (browserArgs.hasOwnProperty(browserName)) {
          this.parseArgs(capitalize(browserName), browserArgs[browserName], knownBrowsers);
        }
      }
    } else if (browserArgs !== undefined) {
      warn('Type error: browser_args should be an object');
    }

    return knownBrowsers;
  },
  createValidation: function() {
    return new Validation();
  },
  dedupeBrowserArgs: function(browserName, browserArgs) {
    if (!browserName || !(browserArgs instanceof Array)) { return; }

    var argHash = {};

    browserArgs.forEach(function(arg) {
      if (arg in argHash) {
        warn('Removed duplicate arg for ' + browserName + ': ' + arg);
      } else {
        argHash[arg] = null;
      }
    });

    return Object.keys(argHash);
  },
  parseArgs: function(browserName, browserArgs, knownBrowsers) {
    if (!browserName || !browserArgs || !knownBrowsers) { return; }

    var patchArgs;
    var self = this;
    var validation = this.validate(browserName, browserArgs, knownBrowsers);

    if (validation.valid) {
      if (typeof browserArgs === 'string') {
        browserArgs = [browserArgs];
      }

      patchArgs = validation.knownBrowser.args;

      if (patchArgs instanceof Array) {
        validation.knownBrowser.args = browserArgs.concat(validation.knownBrowser.args);
      } else if (typeof patchArgs === 'function') {
        validation.knownBrowser.args = function() {
          return self.dedupeBrowserArgs(browserName,
            browserArgs.concat(patchArgs.apply(this, arguments)));
        };
      } else if (patchArgs === undefined) {
        validation.knownBrowser.args = function() {
          return browserArgs;
        };
      }
    } else {
      validation.messages.forEach(function(message) {
        warn(message);
      });
    }
  },
  validate: function(browserName, browserArgs, knownBrowsers) {
    if (!browserName || !browserArgs || !(knownBrowsers instanceof Array) ||
      !knownBrowsers.length) { return; }

    var i;
    var len = knownBrowsers.length;
    var validation = this.createValidation();

    this.validateBrowserArgs(browserName, browserArgs, validation);

    for (i = 0; i < len; i++) {
      if (knownBrowsers[i].name === browserName) {
        validation.knownBrowser = knownBrowsers[i];
        break;
      }
    }

    if (!validation.knownBrowser) {
      validation.messages.push('Could not find "' + browserName + '" in known browsers');
    }

    validation.valid = !validation.messages.length;

    return validation;
  },
  validateBrowserArgs: function(browserName, browserArgs, validation) {
    if (!browserName || !validation) { return; }

    var arg;
    var i;
    var len;

    if (typeof browserArgs !== 'string' && !(browserArgs instanceof Array)) {
      validation.messages.push('Type error: ' + browserName +
        '\'s "args" property should be a string or an array');
    } else if (typeof browserArgs === 'string' && !browserArgs.trim()) {
      validation.messages.push('Bad value: ' + browserName +
        '\'s "args" property should not be empty');
    } else if (browserArgs instanceof Array) {
      len = browserArgs.length;

      if (len) {
        for (i = 0; i < len; i++) {
          arg = browserArgs[i];

          if (typeof arg !== 'string') {
            validation.messages.push('Bad value: ' + browserName +
              '\'s "args" may only contain strings');
            break;
          } else if (!arg.trim()) {
            validation.messages.push('Bad value: ' + browserName +
              '\'s "args" may not contain empty strings');
            break;
          }
        }
      } else {
        validation.messages.push('Bad value: ' + browserName + '\'s "args" property should not be empty');
      }
    }
  }
};

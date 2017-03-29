/*

browser_launcher.js
===================

This file more or less figures out how to launch any browser on any platform.

*/
'use strict';

var Bluebird = require('bluebird');

var fileutils = require('./fileutils');
var envWithLocalPath = require('./env-with-local-path');

var executableExists = function(exe) {
  return fileutils.executableExists(exe, { env: envWithLocalPath() });
};
var fileExists = fileutils.fileExists;

// Returns the available browsers on the current machine.
function getAvailableBrowsers(config, browsers, cb) {
  browsers.forEach(function(b) {
    b.protocol = 'browser';
  });

  return Bluebird.filter(browsers, function(browser) {
    return isInstalled(browser).then(function(result) {
      if (!result) {
        return false;
      }

      browser.exe = result;
      return true;
    });
  }).asCallback(cb);
}

function isInstalled(browser) {
  return checkBrowser(browser, 'possiblePath', fileExists).then(function(result) {
    if (result) {
      return result;
    }

    return checkBrowser(browser, 'possibleExe', executableExists);
  });
}

function checkBrowser(browser, property, method) {
  if (!browser[property]) {
    return Bluebird.resolve(false);
  }

  if (Array.isArray(browser[property])) {
    return Bluebird.filter(browser[property], method).then(function(result) {
      if (result.length === 0) {
        return false;
      }

      return result[0];
    });
  }

  return method(browser[property]).then(function(result) {
    if (!result) {
      return false;
    }

    return browser[property];
  });
}

exports.getAvailableBrowsers = getAvailableBrowsers;

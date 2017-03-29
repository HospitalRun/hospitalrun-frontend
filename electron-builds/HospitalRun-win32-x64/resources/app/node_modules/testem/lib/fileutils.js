'use strict';

var fs = require('fs');
var childProcess = require('child_process');
var Bluebird = require('bluebird');
var log = require('npmlog');

var fsStatAsync = Bluebird.promisify(fs.stat);

var isWin = require('./utils/is-win')();

var fileExists = function(path) {
  return fsStatAsync(path).then(function(stats) {
    return stats.isFile();
  }).catchReturn(false);
};
exports.fileExists = fileExists;

var executableExists = function(exe, options) {
  var cmd = isWin ? 'where' : 'which';

  return new Bluebird.Promise(function(resolve) {
    var test = childProcess.spawn(cmd, [exe], options);
    test.on('error', function(error) {
      log.error('Error spawning "' + cmd + exe + '"', error);
    });
    test.on('close', function(exitCode) {
      return resolve(exitCode === 0);
    });
  });
};

exports.executableExists = executableExists;

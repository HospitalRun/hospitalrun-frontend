'use strict';

var cloneDeep = require('lodash.clonedeep');
var isWin = require('./utils/is-win')();
var PATH = 'PATH';
var delimiter = ':';

// windows calls it's path 'Path' usually, but this is not guaranteed.
if (isWin) {
  PATH = 'Path';
  delimiter = ';';
  Object.keys(process.env).forEach(function(e) {
    if (e.match(/^PATH$/i)) {
      PATH = e;
    }
  });
}

module.exports = function addToPATH(path) {
  var env = cloneDeep(process.env);
  env[PATH] = [path, env[PATH]].join(delimiter);

  return env;
};

module.exports.PATH = PATH;

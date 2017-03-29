'use strict';
var fs = require('fs');
var resolve = require('resolve');
var path = require('path');

/* @private
 *
 * @method resolvePkg
 * @param {String} name
 * @param {String} dir
 * @return {String}
 */
module.exports = function resolvePkg(name, dir) {
  if (name.charAt(0) === '/') {
    return name;
  }
  if (name === './') {
    return path.resolve(name);
  }
  return resolve.sync(name, { basedir: dir || __dirname, isFile: isDirectory });
};

function isDirectory(file) {
  var stat;

  try {
    stat = fs.statSync(file);
  }
  catch (err) {
    if (err && err.code === 'ENOENT') {
      return false;
    }
  }

  return stat.isDirectory();
}

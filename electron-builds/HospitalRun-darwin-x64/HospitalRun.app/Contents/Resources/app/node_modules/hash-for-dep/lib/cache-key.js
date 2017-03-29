'use strict';
var crypto = require('crypto');

module.exports = function cacheKey(name, dir) {
  var value = name + 0x00 + dir;

  return crypto.createHash('sha1').update(value).digest('hex');
};

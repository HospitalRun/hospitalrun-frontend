'use strict';
var helpers = require('broccoli-kitchen-sink-helpers');
var crypto = require('crypto');
var statPathsFor = require('./lib/stat-paths-for');
var heimdall = require('heimdalljs');
var Cache = require('./lib/cache');
var cacheKey = require('./lib/cache-key');
var logger = require('heimdalljs-logger')('hash-for-dep:');

var CACHE = new Cache();

function HashForDepSchema() {
  this.paths = 0;
}

function cacheGet(key) {
  return CACHE[key]
}

function cacheGet(key) {
  return CACHE[key]
}

function cacheSet(key, value) {
  CACHE[key] = value;
  return value;
}

/* @public
 *
 * @method hashForDep
 * @param {String} name name of the dependency
 * @param {String} dir (optional) root dir to run the hash resolving from
 * @param {String} _hashTreeOverride (optional) private, used internally for testing
 * @param {Boolean} _skipCache (optional) intended to bypass cache
 * @return {String} a hash representing the stats of this module and all its descendents
 */
module.exports = function hashForDep(name, dir, _hashTreeOverride, _skipCache) {
  var skipCache = false;
  var key, hash;

  if (typeof _hashTreeOverride === 'function' || _skipCache === true) {
    skipCache = true;
  } else {
    key = cacheKey(name, dir);
  }

  var heimdallNodeOptions = {
    name: 'hashForDep(' + name + ')',
    hashForDep: true,
    dependencyName: name,
    rootDir: dir,
    skipCache: skipCache,
    cacheKey: key
  };

  var heimdallNode = heimdall.start(heimdallNodeOptions, HashForDepSchema);

  if (skipCache === false && CACHE.has(key)) {
    logger.info('cache hit: %s', key);
    hash = CACHE.get(key);
  } else {
    var start = Date.now();

    var inputHashes = statPathsFor(name, dir).map(function(statPath) {
      var hashFn = _hashTreeOverride || helpers.hashTree;

      heimdallNode.stats.paths++;

      var key = 'hashOf:' + statPath;
      var hash;

      if (skipCache === false && CACHE.has(key)) {
        logger.debug('HIT', key)
        hash = CACHE.get(key);
      } else {
        logger.debug('MISS', key)
        hash = hashFn(statPath);
        if (skipCache === false) {
          CACHE.set(key, hash);
        }
      }
      return hash;
    }).join(0x00);

    hash = crypto.createHash('sha1').
      update(inputHashes).digest('hex');

    logger.info('cache miss: %s, paths: %d, took: %dms', key, heimdallNode.stats.paths, Date.now() - start);

    if (skipCache === false) {
      CACHE.set(key, hash);
    }
  }

  heimdallNode.stop();
  return hash;
};

module.exports._resetCache = function() {
  CACHE = new Cache();
};

Object.defineProperty(module.exports, '_cache', {
  get: function() {
    return CACHE;
  }
});

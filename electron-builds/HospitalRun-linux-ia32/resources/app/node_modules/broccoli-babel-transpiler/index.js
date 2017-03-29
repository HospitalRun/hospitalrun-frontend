'use strict';

var transpiler = require('babel-core');
var Filter     = require('broccoli-persistent-filter');
var clone      = require('clone');
var path       = require('path');
var fs         = require('fs');
var stringify  = require('json-stable-stringify');
var mergeTrees = require('broccoli-merge-trees');
var funnel     = require('broccoli-funnel');
var crypto     = require('crypto');
var hashForDep = require('hash-for-dep');

function getExtensionsRegex(extensions) {
  return extensions.map(function(extension) {
    return new RegExp('\.' + extension + '$');
  });
}

function replaceExtensions(extensionsRegex, name) {
  for (var i = 0, l = extensionsRegex.length; i < l; i++) {
    name = name.replace(extensionsRegex[i], '');
  }

  return name;
}

function Babel(inputTree, _options) {
  if (!(this instanceof Babel)) {
    return new Babel(inputTree, _options);
  }

  var options = _options || {};
  options.persist = !options.exportModuleMetadata; // TODO: make this also work in cache
  Filter.call(this, inputTree, options);

  delete options.persist;
  delete options.annotation;
  delete options.description;

  this.console = options.console || console;
  delete options.console;

  this.options = options;
  this.moduleMetadata = {};
  this.extensions = this.options.filterExtensions || ['js'];
  this.extensionsRegex = getExtensionsRegex(this.extensions);
  this.name = 'broccoli-babel-transpiler';

  if (this.options.exportModuleMetadata) {
    this.exportModuleMetadata = this.options.exportModuleMetadata;
  }

  if (this.options.helperWhiteList) {
    this.helperWhiteList = this.options.helperWhiteList;
  }

  // Note, Babel does not support this option so we must save it then
  // delete it from the options hash
  delete this.options.exportModuleMetadata;
  delete this.options.helperWhiteList;

  if (this.options.browserPolyfill) {
    var babelCorePath = require.resolve('babel-core');
    babelCorePath = babelCorePath.replace(/\/babel-core\/.*$/, '/babel-core');

    var polyfill = funnel(babelCorePath, { files: ['browser-polyfill.js'] });
    this.inputTree = mergeTrees([polyfill, inputTree]);
  } else {
    this.inputTree = inputTree;
  }
  delete this.options.browserPolyfill;
}

Babel.prototype = Object.create(Filter.prototype);
Babel.prototype.constructor = Babel;
Babel.prototype.targetExtension = ['js'];

Babel.prototype.baseDir = function() {
  return __dirname;
};

Babel.prototype.build = function() {
  var self = this;
  return Filter.prototype.build.call(this).then(function() {
    if (self.exportModuleMetadata) {
      self._generateDepGraph();
    }
  });
};

Babel.prototype._generateDepGraph = function() {
  var residentImports = this._cache.keys().map(byImportName);
  var imports = Object.keys(this.moduleMetadata);
  var evictedImports = diff(imports, residentImports);

  if (evictedImports.length > 0) {
    evictedImports.forEach(function(importName) {
      delete this.moduleMetadata[importName];
    }, this);
  }

  fs.writeFileSync(this.outputPath + path.sep + 'dep-graph.json', stringify(this.moduleMetadata, { space: 2 }));
};

Babel.prototype.transform = function(string, options) {
  return transpiler.transform(string, options);
};

/*
 * @private
 *
 * @method optionsString
 * @returns a stringifeid version of the input options
 */
Babel.prototype.optionsHash = function() {
  var options = this.options;
  var hash = {};
  var key, value;

  if (!this._optionsHash) {
    for (key in options) {
      value = options[key];
      hash[key] = (typeof value === 'function') ? (value + '') : value;
    }

    if (options.plugins) {
      hash.plugins = [];

      var cacheableItems = options.plugins.slice();

      for (var i = 0; i < cacheableItems.length; i++) {
        var item = cacheableItems[i];

        var type = typeof item;
        var augmentsCacheKey = false;
        var providesBaseDir = false;
        var requiresBaseDir = true;

        if (type === 'function') {
          augmentsCacheKey = typeof item.cacheKey === 'function';
          providesBaseDir = typeof item.baseDir === 'function';

          if (augmentsCacheKey) {
            hash.plugins.push(item.cacheKey());
          }

          if (providesBaseDir) {
            var depHash = hashForDep(item.baseDir());

            hash.plugins.push(depHash);
          }

          if (!providesBaseDir && requiresBaseDir){
            // prevent caching completely if the plugin doesn't provide baseDir
            // we cannot ensure that we aren't causing invalid caching pain...
            this.console.warn('broccoli-babel-transpiler is opting out of caching due to a plugin that does not provide a caching strategy: `' + item + '`.');
            hash.plugins.push((new Date).getTime() + '|' + Math.random());
            break;
          }
        } else if (Array.isArray(item)) {
          item.forEach(function(part) {
            cacheableItems.push(part);
          });

          continue;
        } else if (type !== 'object' || item === null) {
          // handle native strings, numbers, or null (which can JSON.stringify properly)
          hash.plugins.push(item);
          continue;
        } else if (type === 'object') {
          // itereate all keys in the item and push them into the cache
          var keys = Object.keys(item);
          keys.forEach(function(key) {
            cacheableItems.push(key);
            cacheableItems.push(item[key]);
          });
          continue;
        } else {
          this.console.warn('broccoli-babel-transpiler is opting out of caching due to an non-cacheable item: `' + item + '` (' + type + ').');
          hash.plugins.push((new Date).getTime() + '|' + Math.random());
          break;
        }
      }
    }

    this._optionsHash = crypto.createHash('md5').update(stringify(hash), 'utf8').digest('hex');
  }

  return this._optionsHash;
};

Babel.prototype.cacheKeyProcessString = function(string, relativePath) {
  return this.optionsHash() + Filter.prototype.cacheKeyProcessString.call(this, string, relativePath);
};

Babel.prototype.processString = function(string, relativePath) {
  var options = this.copyOptions();

  options.filename = options.sourceMapName = options.sourceFileName = relativePath;

  if (options.moduleId === true) {
    options.moduleId = replaceExtensions(this.extensionsRegex, options.filename);
  }

  var transpiled = this.transform(string, options);
  var key = options.moduleId ? options.moduleId : relativePath;

  if (this.helperWhiteList) {
    var invalidHelpers = transpiled.metadata.usedHelpers.filter(function(helper) {
      return this.helperWhiteList.indexOf(helper) === -1;
    }, this);

    validateHelpers(invalidHelpers, relativePath);
  }

  if (transpiled.metadata && transpiled.metadata.modules) {
    this.moduleMetadata[byImportName(key)] = transpiled.metadata.modules;
  }

  return transpiled.code;
};

Babel.prototype.copyOptions = function() {
  var cloned = clone(this.options);
  if (cloned.filterExtensions) {
    delete cloned.filterExtensions;
  }
  return cloned;
};

function byImportName(relativePath) {
  return relativePath.replace(path.extname(relativePath), '');
}

function diff(array, exclusions) {
  return array.filter(function(item) {
    return !exclusions.some(function(exclude) {
      return item === exclude;
    });
  });
}

function validateHelpers(invalidHelpers, relativePath) {
  if (invalidHelpers.length > 0) {
    var message = relativePath + ' was transformed and relies on `' + invalidHelpers[0] + '`, which was not included in the helper whitelist. Either add this helper to the whitelist or refactor to not be dependent on this runtime helper.';

    if (invalidHelpers.length > 1) {
      var helpers = invalidHelpers.map(function(item, i) {
        if (i === invalidHelpers.length - 1) {
          return '& `' + item;
        } else if (i === invalidHelpers.length - 2) {
          return item + '`, ';
        }

        return item + '`, `';
      }).join('');

      message = relativePath + ' was transformed and relies on `' + helpers + '`, which were not included in the helper whitelist. Either add these helpers to the whitelist or refactor to not be dependent on these runtime helper.';
    }
    throw new Error(message);
  }
}

module.exports = Babel;

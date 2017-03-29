/* jshint node: true */
'use strict';

var VersionChecker = require('ember-cli-version-checker');
var clone     = require('clone');
var path      = require('path');
var resolve   = require('resolve');

module.exports = {
  name: 'ember-cli-babel',
  configKey: 'ember-cli-babel',

  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    var checker = new VersionChecker(this);
    var dep = checker.for('ember-cli', 'npm');

    this._shouldSetupRegistryInIncluded = dep.lt('0.2.0-alpha.1');
    this._shouldShowBabelDeprecations = !dep.lt('2.11.0-beta.2');
  },

  setupPreprocessorRegistry: function(type, registry) {
    var addon = this;

    registry.add('js', {
      name: 'ember-cli-babel',
      ext: 'js',
      toTree: function(tree) {
        return require('broccoli-babel-transpiler')(tree, addon._getBabelOptions());
      }
    });
  },

  shouldIncludePolyfill: function() {
    var addonOptions = this._getAddonOptions();
    var babelOptions = addonOptions.babel;
    var customOptions = addonOptions['ember-cli-babel'];

    if (this._shouldShowBabelDeprecations && !this._polyfillDeprecationPrinted &&
      babelOptions && 'includePolyfill' in babelOptions) {

      this._polyfillDeprecationPrinted = true;

      // we can use writeDeprecateLine() here because the warning will only be shown on newer Ember CLIs
      this.ui.writeDeprecateLine(
        'Putting the "includePolyfill" option in "babel" is deprecated, please put it in "ember-cli-babel" instead.');
    }

    if (customOptions && 'includePolyfill' in customOptions) {
      return customOptions.includePolyfill === true;
    } else if (babelOptions && 'includePolyfill' in babelOptions) {
      return babelOptions.includePolyfill === true;
    } else {
      return false;
    }
  },

  importPolyfill: function(app) {
    if (this.import) {  // support for ember-cli >= 2.7
      this.import('vendor/browser-polyfill.js', { prepend: true });
    } else if (app.import) { // support ember-cli < 2.7
      app.import('vendor/browser-polyfill.js', { prepend: true });
    } else {
      console.warn('Please run: ember install ember-cli-import-polyfill')
    }
  },

  treeFor: function(name) {
    if (name !== 'vendor') { return; }
    if (!this.shouldIncludePolyfill()) { return; }

    // Find babel-core's browser polyfill and use its directory as our vendor tree
    var transpilerRoot = path.dirname(resolve.sync('broccoli-babel-transpiler'));
    var polyfillDir = path.dirname(resolve.sync('babel-core/browser-polyfill', { basedir: transpilerRoot }));
    var Funnel = require('broccoli-funnel');
    return new Funnel(polyfillDir, {
      files: ['browser-polyfill.js']
    });
  },

  included: function(app) {
    this._super.included.apply(this, arguments);
    this.app = app;

    if (this._shouldSetupRegistryInIncluded) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }

    if (this.shouldIncludePolyfill()) {
      this.importPolyfill(app);
    }
  },

  _getAddonOptions: function() {
    return (this.parent && this.parent.options) || (this.app && this.app.options) || {};
  },

  _shouldCompileModules: function(addonOptions) {
    var babelOptions = addonOptions.babel;
    var customOptions = addonOptions['ember-cli-babel'];

    if (this._shouldShowBabelDeprecations && !this._modulesDeprecationPrinted &&
      babelOptions && 'compileModules' in babelOptions) {

      this._modulesDeprecationPrinted = true;

      // we can use writeDeprecateLine() here because the warning will only be shown on newer Ember CLIs
      this.ui.writeDeprecateLine(
        'Putting the "compileModules" option in "babel" is deprecated, please put it in "ember-cli-babel" instead.');
    }

    if (customOptions && 'compileModules' in customOptions) {
      return customOptions.compileModules === true;
    } else if (babelOptions && 'compileModules' in babelOptions) {
      return babelOptions.compileModules === true;
    } else {
      return false;
    }
  },

  _getBabelOptions: function() {
    var parentName;

    if (this.parent) {
      if (typeof this.parent.name === 'function') {
        parentName = this.parent.name();
      } else {
        parentName = this.parent.name;
      }
    }

    var addonOptions = this._getAddonOptions();
    var options = clone(addonOptions.babel || {});

    var compileModules = this._shouldCompileModules(addonOptions);

    var ui = this.ui;

    options.annotation = 'Babel: ' + parentName;
    // pass a console object that wraps the addon's `UI` object
    options.console = {
      log: function(message) {
        // fallback needed for support of ember-cli < 2.2.0
        if (ui.writeInfoLine) {
          ui.writeInfoLine(message);
        } else {
          ui.writeLine(message, 'INFO');
        }
      },

      warn: function(message) {
        // fallback needed for support of ember-cli < 2.2.0
        if (ui.writeWarnLine) {
          ui.writeWarnLine(message);
        } else {
          ui.writeLine(message, 'WARN');
        }
      },

      error: function(message) {
        // fallback needed for support of ember-cli < 2.2.0
        if (ui.writeError) {
          ui.writeError(message);
        } else {
          ui.writeLine(message, 'ERROR');
        }
      }
    };

    // Ensure modules aren't compiled unless explicitly set to compile
    options.blacklist = options.blacklist || ['es6.modules'];

    // do not enable non-standard transforms
    if (!('nonStandard' in options)) {
      options.nonStandard = false;
    }

    // Remove custom options from `options` hash that is passed to Babel
    delete options.includePolyfill;
    delete options.compileModules;

    var blacklistModulesIndex = options.blacklist.indexOf('es6.modules');
    if (compileModules) {
      if (blacklistModulesIndex >= 0) {
        options.blacklist.splice(blacklistModulesIndex, 1);
      }
    } else {
      if (blacklistModulesIndex < 0) {
        options.blacklist.push('es6.modules');
      }
    }

    // Ember-CLI inserts its own 'use strict' directive
    options.blacklist.push('useStrict');
    options.highlightCode = false;

    return options;
  },
};

/* eslint camelcase:0 */
/**
  This is a wrapper for `ember-debug.js`
  Wraps the script in a function,
  and ensures that the script is executed
  only after the dom is ready
  and the application has initialized.

  Also responsible for sending the first tree.
**/
/*eslint prefer-spread: 0 */
/* globals Ember, adapter, env, requireModule */
var currentAdapter = 'basic';
if (typeof adapter !== 'undefined') {
  currentAdapter = adapter;
}
var currentEnv = 'production';
if (typeof env !== 'undefined') {
  currentEnv = env;
}

var EMBER_VERSIONS_SUPPORTED = {{EMBER_VERSIONS_SUPPORTED}};

(function(adapter) {
  onEmberReady(function() {
    // global to prevent injection
    if (window.NO_EMBER_DEBUG) {
      return;
    }

    if (!versionTest(Ember.VERSION, EMBER_VERSIONS_SUPPORTED)) {
      // Wrong inspector version. Redirect to the correct version.
      sendVersionMiss();
      return;
    }
    // prevent from injecting twice
    if (!Ember.EmberInspectorDebugger) {
      // Make sure we only work for the supported version
      define('ember-debug/config', function() {
        return {
          default: {
            environment: currentEnv
          }
        };
      });
      window.EmberInspector = Ember.EmberInspectorDebugger = requireModule('ember-debug/main')['default'];
      Ember.EmberInspectorDebugger.Adapter = requireModule('ember-debug/adapters/' + adapter)['default'];

      onApplicationStart(function appStarted(app) {
        var isFirstBoot = !('__inspector__booted' in app);
        app.__inspector__booted = true;
        Ember.EmberInspectorDebugger.set('application', app);
        Ember.EmberInspectorDebugger.start(true);
        if (isFirstBoot) {
          // Watch for app reset/destroy
          app.reopen({
            reset: function() {
              this.__inspector__booted = false;
              this._super.apply(this, arguments);
            },
            willDestroy: function() {
              Ember.EmberInspectorDebugger.destroyContainer();
              Ember.EmberInspectorDebugger.set('application', null);
              this._super.apply(this, arguments);
            }
          });
        }
      });
    }
  });

  function onEmberReady(callback) {
    var triggered = false;
    var triggerOnce = function(string) {
      if (triggered) { return; }
      if (!window.Ember) { return; }
      // `Ember.Application` load hook triggers before all of Ember is ready.
      // In this case we ignore and wait for the `Ember` load hook.
      if (!window.Ember.RSVP) { return; }
      triggered = true;
      callback();
    };

    // Newest Ember versions >= 1.10
    window.addEventListener('Ember', triggerOnce, false);
    // Old Ember versions
    window.addEventListener('Ember.Application', function() {
      if (window.Ember && window.Ember.VERSION && compareVersion(window.Ember.VERSION, '1.10.0') === 1) {
        // Ember >= 1.10 should be handled by `Ember` load hook instead.
        return;
      }
      triggerOnce();
    }, false);
    // Oldest Ember versions or if this was injected after Ember has loaded.
    onReady(triggerOnce);
  }

  function onReady(callback) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(completed);
    } else {
      document.addEventListener( "DOMContentLoaded", completed, false);
      // For some reason DOMContentLoaded doesn't always work
      window.addEventListener( "load", completed, false );
    }

    function completed() {
      document.removeEventListener( "DOMContentLoaded", completed, false );
      window.removeEventListener( "load", completed, false );
      callback();
    }
  }

  // There's probably a better way
  // to determine when the application starts
  // but this definitely works
  function onApplicationStart(callback) {
    if (typeof Ember === 'undefined') {
      return;
    }
    var apps = getApplications();
    var app;
    for (var i = 0, l = apps.length; i < l; i++) {
      app = apps[i];
      if (app._readinessDeferrals === 0) {
        // App started
        callback(app);
        break;
      }
    }
    Ember.Application.initializer({
      name: 'ember-inspector-booted',
      initialize: function() {
        // If 2 arguments are passed, we are on Ember < 2.1 (app is second arg)
        // If 1 argument is passed, we are on Ember 2.1+ (app is only arg)
        var app = arguments[1] || arguments[0];
        if (!app.__inspector__setup) {
          app.__inspector__setup = true;
          app.reopen({
            didBecomeReady: function() {
              // _super will get reset when we reopen the app
              // so we store it in this variable to call it later.
              var _super = this._super;
              callback(app);
              return _super.apply(this, arguments);
            }
          });
        }
      }
    });
  }

  function getApplications() {
    var namespaces = Ember.A(Ember.Namespace.NAMESPACES);

    return namespaces.filter(function(namespace) {
      return namespace instanceof Ember.Application;
    });
  }

  /**
   * This function is called if the app's Ember version
   * is not supported by this version of the inspector.
   *
   * It sends a message to the inspector app to redirect
   * to an inspector version that supports this Ember version.
   */
  function sendVersionMiss() {
    var adapter = requireModule('ember-debug/adapters/' + currentAdapter)['default'].create();
    adapter.onMessageReceived(function(message) {
      if (message.type === 'check-version') {
        sendVersionMismatch();
      }
    });
    sendVersionMismatch();

    function sendVersionMismatch() {
      adapter.sendMessage({
        name: 'version-mismatch',
        version: Ember.VERSION,
        from: 'inspectedWindow'
      });
    }
  }

  /**
   * Checksi if a version is between two different versions.
   * version should be >= left side, < right side
   *
   * @param {String} version1
   * @param {String} version2
   * @return {Boolean}
   */
  function versionTest(version, between) {
    var fromVersion = between[0];
    var toVersion = between[1];

    if (compareVersion(version, fromVersion) === -1) {
      return false;
    }
    return !toVersion || compareVersion(version, toVersion) === -1;
  }

  /**
   * Compares two Ember versions.
   *
   * Returns:
   * `-1` if version < version
   * 0 if version1 == version2
   * 1 if version1 > version2
   *
   * @param {String} version1
   * @param {String} version2
   * @return {Boolean} result of the comparison
   */
  function compareVersion(version1, version2) {
    var compared, i;
    version1 = cleanupVersion(version1).split('.');
    version2 = cleanupVersion(version2).split('.');
    for (i = 0; i < 3; i++) {
      compared = compare(+version1[i], +version2[i]);
      if (compared !== 0) {
        return compared;
      }
    }
    return 0;
  }

  /* Remove -alpha, -beta, etc from versions */
  function cleanupVersion(version) {
    return version.replace(/-.*/g, '');
  }

  function compare(val, number) {
    if (val === number) {
      return 0;
    } else if (val < number) {
      return -1;
    } else if (val > number) {
      return 1;
    }
  }

}(currentAdapter));

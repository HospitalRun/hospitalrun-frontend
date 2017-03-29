(function(adapter, env) {
var define = window.define, requireModule = window.requireModule;
if (typeof define !== 'function' || typeof requireModule !== 'function') {

  (function() {
    var registry = {}, seen = {};

    define = function(name, deps, callback) {
      if (arguments.length < 3) {
        callback = deps;
        deps = [];
      }
      registry[name] = { deps: deps, callback: callback };
    };

    requireModule = function(name) {
      if (seen[name]) { return seen[name]; }
      seen[name] = {};

      var mod = registry[name];

      if (!mod) {
        throw new Error("Module: '" + name + "' not found.");
      }

      var deps = mod.deps;
      var callback = mod.callback;
      var reified = [];
      var exports;

      for (var i = 0, l = deps.length; i < l; i++) {
        if (deps[i] === 'exports') {
          reified.push(exports = {});
        } else {
          reified.push(requireModule(deps[i]));
        }
      }

      var value = callback.apply(this, reified);
      seen[name] = exports || value;
      return seen[name];
    };

    define.registry = registry;
    define.seen = seen;
  })();
}

'use strict';

define('ember-debug/adapters/basic', ['exports'], function (exports) {

  'use strict';

  /* globals requireModule */
  /* eslint no-console: 0 */
  var Ember = window.Ember;
  var $ = Ember.$;
  var A = Ember.A;
  var computed = Ember.computed;
  var RSVP = Ember.RSVP;
  var EmberObject = Ember.Object;
  var Promise = RSVP.Promise;
  var resolve = RSVP.resolve;

  exports['default'] = EmberObject.extend({
    init: function init() {
      var _this = this;

      resolve(this.connect(), 'ember-inspector').then(function () {
        _this.onConnectionReady();
      }, null, 'ember-inspector');
    },

    /**
     * Uses the current build's config module to determine
     * the environment.
     *
     * @property environment
     * @type {String}
     */
    environment: computed(function () {
      return requireModule('ember-debug/config')['default'].environment;
    }),

    debug: function debug() {
      return console.debug.apply(console, arguments);
    },

    log: function log() {
      return console.log.apply(console, arguments);
    },

    /**
     * A wrapper for `console.warn`.
     *
     * @method warn
     */
    warn: function warn() {
      return console.warn.apply(console, arguments);
    },

    /**
      Used to send messages to EmberExtension
       @param {Object} type the message to the send
    */
    sendMessage: function sendMessage() /* options */{},

    /**
      Register functions to be called
      when a message from EmberExtension is received
       @param {Function} callback
    */
    onMessageReceived: function onMessageReceived(callback) {
      this.get('_messageCallbacks').pushObject(callback);
    },

    /**
      Inspect a specific element.  This usually
      means using the current environment's tools
      to inspect the element in the DOM.
       For example, in chrome, `inspect(elem)`
      will open the Elements tab in dev tools
      and highlight the element.
       @param {DOM Element} elem
    */
    inspectElement: function inspectElement() /* elem */{},

    _messageCallbacks: computed(function () {
      return A();
    }),

    _messageReceived: function _messageReceived(message) {
      this.get('_messageCallbacks').forEach(function (callback) {
        callback(message);
      });
    },

    /**
     * Handle an error caused by EmberDebug.
     *
     * This function rethrows in development and test envs,
     * but warns instead in production.
     *
     * The idea is to control errors triggered by the inspector
     * and make sure that users don't get mislead by inspector-caused
     * bugs.
     *
     * @method handleError
     * @param {Error} error
     */
    handleError: function handleError(error) {
      if (this.get('environment') === 'production') {
        if (error && error instanceof Error) {
          error = 'Error message: ' + error.message + '\nStack trace: ' + error.stack;
        }
        this.warn('Ember Inspector has errored.\n' + 'This is likely a bug in the inspector itself.\n' + 'You can report bugs at https://github.com/emberjs/ember-inspector.\n' + error);
      } else {
        this.warn('EmberDebug has errored:');
        throw error;
      }
    },

    /**
       A promise that resolves when the connection
      with the inspector is set up and ready.
       @return {Promise}
    */
    connect: function connect() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        $(function () {
          if (_this2.isDestroyed) {
            reject();
          }
          _this2.interval = setInterval(function () {
            if (document.documentElement.dataset.emberExtension) {
              clearInterval(_this2.interval);
              resolve();
            }
          }, 10);
        });
      }, 'ember-inspector');
    },

    willDestroy: function willDestroy() {
      this._super();
      clearInterval(this.interval);
    },

    _isReady: false,
    _pendingMessages: computed(function () {
      return A();
    }),

    send: function send(options) {
      if (this._isReady) {
        this.sendMessage.apply(this, arguments);
      } else {
        this.get('_pendingMessages').push(options);
      }
    },

    /**
      Called when the connection is set up.
      Flushes the pending messages.
    */
    onConnectionReady: function onConnectionReady() {
      var _this3 = this;

      // Flush pending messages
      var messages = this.get('_pendingMessages');
      messages.forEach(function (options) {
        return _this3.sendMessage(options);
      });
      messages.clear();
      this._isReady = true;
    }
  });
});
'use strict';

define('ember-debug/adapters/bookmarklet', ['exports', 'ember-debug/adapters/basic'], function (exports, BasicAdapter) {

  'use strict';

  var Ember = window.Ember;
  var $ = Ember.$;

  exports['default'] = BasicAdapter['default'].extend({
    init: function init() {
      this._super();
      this._listen();
    },

    sendMessage: function sendMessage(options) {
      options = options || {};
      window.emberInspector.w.postMessage(options, window.emberInspector.url);
    },

    _listen: function _listen() {
      var _this = this;

      window.addEventListener('message', function (e) {
        if (e.origin !== window.emberInspector.url) {
          return;
        }
        var message = e.data;
        if (message.from === 'devtools') {
          _this._messageReceived(message);
        }
      });

      $(window).on('unload', function () {
        _this.sendMessage({
          unloading: true
        });
      });
    }
  });
});
'use strict';

define('ember-debug/adapters/chrome', ['exports', 'ember-debug/adapters/basic'], function (exports, BasicAdapter) {

  'use strict';

  var Ember = window.Ember;
  var computed = Ember.computed;
  var run = Ember.run;
  var extend = Ember.$.extend;
  var isArray = Array.isArray;
  var keys = Object.keys;

  exports['default'] = BasicAdapter['default'].extend({
    connect: function connect() {
      var _this = this;

      var channel = this.get('_channel');
      return this._super.apply(this, arguments).then(function () {
        window.postMessage('debugger-client', '*', [channel.port2]);
        _this._listen();
      }, null, 'ember-inspector');
    },

    sendMessage: function sendMessage(options) {
      options = options || {};
      // If prototype extensions are disabled, `Ember.A()` arrays
      // would not be considered native arrays, so it's not possible to
      // "clone" them through postMessage unless they are converted to a
      // native array.
      if (!Ember.EXTEND_PROTOTYPES || Ember.EXTEND_PROTOTYPES.Array === false) {
        options = deepCloneArrays(extend(true, {}, options));
      }
      this.get('_chromePort').postMessage(options);
    },

    inspectElement: function inspectElement(elem) {
      /* globals inspect */
      inspect(elem);
    },

    _channel: computed(function () {
      return new MessageChannel();
    }).readOnly(),

    _chromePort: computed(function () {
      return this.get('_channel.port1');
    }).readOnly(),

    _listen: function _listen() {
      var _this2 = this;

      var chromePort = this.get('_chromePort');

      chromePort.addEventListener('message', function (event) {
        var message = event.data;
        run(function () {
          _this2._messageReceived(message);
        });
      });

      chromePort.start();
    }
  });

  /**
   * Recursively clones all arrays. Needed because Chrome
   * refuses to clone Ember Arrays when extend prototypes is disabled.
   *
   * If the item passed is an array, a clone of the array is returned.
   * If the item is an object or an array, or array properties/items are cloned.
   *
   * @param {Mixed} item The item to clone
   * @return {Mixed}
   */
  function deepCloneArrays(item) {
    if (isArray(item)) {
      item = item.slice();
      item.forEach(function (child, key) {
        item[key] = deepCloneArrays(child);
      });
    } else if (item && typeof item === 'object') {
      keys(item).forEach(function (key) {
        item[key] = deepCloneArrays(item[key]);
      });
    }
    return item;
  }
});
'use strict';

define('ember-debug/adapters/firefox', ['exports', 'ember-debug/adapters/basic'], function (exports, BasicAdapter) {

  'use strict';

  /* eslint no-empty:0 */
  var Ember = window.Ember;
  var run = Ember.run;

  exports['default'] = BasicAdapter['default'].extend({
    init: function init() {
      this._super();
      this._listen();
    },

    debug: function debug() {
      // WORKAROUND: temporarily workaround issues with firebug console object:
      // - https://github.com/tildeio/ember-extension/issues/94
      // - https://github.com/firebug/firebug/pull/109
      // - https://code.google.com/p/fbug/issues/detail?id=7045
      try {
        this._super.apply(this, arguments);
      } catch (e) {}
    },
    log: function log() {
      // WORKAROUND: temporarily workaround issues with firebug console object:
      // - https://github.com/tildeio/ember-extension/issues/94
      // - https://github.com/firebug/firebug/pull/109
      // - https://code.google.com/p/fbug/issues/detail?id=7045
      try {
        this._super.apply(this, arguments);
      } catch (e) {}
    },

    sendMessage: function sendMessage(options) {
      options = options || {};
      var event = document.createEvent("CustomEvent");
      event.initCustomEvent("ember-debug-send", true, true, options);
      document.documentElement.dispatchEvent(event);
    },

    inspectElement: function inspectElement(elem) {
      this.sendMessage({
        type: 'view:devtools:inspectDOMElement',
        elementSelector: "#" + elem.getAttribute('id')
      });
    },

    _listen: function _listen() {
      var _this = this;

      window.addEventListener('ember-debug-receive', function (event) {
        var message = event.detail;
        run(function () {
          // FIX: needed to fix permission denied exception on Firefox >= 30
          // - https://github.com/emberjs/ember-inspector/issues/147
          // - https://blog.mozilla.org/addons/2014/04/10/changes-to-unsafewindow-for-the-add-on-sdk/
          switch (typeof message) {
            case "string":
              message = JSON.parse(message);
              break;
            case "object":
              break;
            default:
              throw new Error("ember-debug-receive: string or object expected");
          }
          _this._messageReceived(message);
        });
      });
    }

  });
});
'use strict';

define('ember-debug/adapters/websocket', ['exports', 'ember-debug/adapters/basic'], function (exports, BasicAdapter) {

  'use strict';

  var Ember = window.Ember;
  var $ = Ember.$;
  var computed = Ember.computed;
  var run = Ember.run;
  var Promise = Ember.RSVP.Promise;

  exports['default'] = BasicAdapter['default'].extend({

    sendMessage: function sendMessage(options) {
      options = options || {};
      this.get('socket').emit('emberInspectorMessage', options);
    },

    socket: computed(function () {
      return window.EMBER_INSPECTOR_CONFIG.remoteDebugSocket;
    }),

    _listen: function _listen() {
      var _this = this;

      this.get('socket').on('emberInspectorMessage', function (message) {
        run(function () {
          _this._messageReceived(message);
        });
      });
    },

    _disconnect: function _disconnect() {
      this.get('socket').removeAllListeners("emberInspectorMessage");
    },

    connect: function connect() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        $(function () {
          if (_this2.isDestroyed) {
            reject();
          }
          var EMBER_INSPECTOR_CONFIG = window.EMBER_INSPECTOR_CONFIG;
          if (typeof EMBER_INSPECTOR_CONFIG === 'object' && EMBER_INSPECTOR_CONFIG.remoteDebugSocket) {
            resolve();
          }
        });
      }).then(function () {
        _this2._listen();
      });
    },

    willDestroy: function willDestroy() {
      this._disconnect();
    }
  });
});
'use strict';

define('ember-debug/addons/ember-new-computed/index', ['exports', 'ember-debug/addons/ember-new-computed/utils/can-use-new-syntax'], function (exports, canUseNewSyntax) {

  'use strict';

  var Ember = window.Ember;
  var computed = Ember.computed;

  exports['default'] = function () {
    var polyfillArguments = [];
    var config = arguments[arguments.length - 1];

    if (typeof config === 'function' || canUseNewSyntax['default']) {
      return computed.apply(this, arguments);
    }

    for (var i = 0, l = arguments.length - 1; i < l; i++) {
      polyfillArguments.push(arguments[i]);
    }

    var func = undefined;
    if (config.set) {
      func = function (key, value) {
        if (arguments.length > 1) {
          return config.set.call(this, key, value);
        } else {
          return config.get.call(this, key);
        }
      };
    } else {
      func = function (key) {
        return config.get.call(this, key);
      };
    }

    polyfillArguments.push(func);

    return computed.apply(this, polyfillArguments);
  };
});
'use strict';

define('ember-debug/addons/ember-new-computed/utils/can-use-new-syntax', ['exports'], function (exports) {

  'use strict';

  var Ember = window.Ember;
  var computed = Ember.computed;

  var supportsSetterGetter = undefined;

  try {
    computed({
      set: function set() {},
      get: function get() {}
    });
    supportsSetterGetter = true;
  } catch (e) {
    supportsSetterGetter = false;
  }

  exports['default'] = supportsSetterGetter;
});
'use strict';

define('ember-debug/container-debug', ['exports', 'ember-debug/mixins/port-mixin'], function (exports, PortMixin) {

  'use strict';

  var Ember = window.Ember;
  var EmberObject = Ember.Object;
  var computed = Ember.computed;
  var oneWay = computed.oneWay;

  exports['default'] = EmberObject.extend(PortMixin['default'], {
    namespace: null,

    port: oneWay('namespace.port').readOnly(),
    application: oneWay('namespace.application').readOnly(),
    objectInspector: oneWay('namespace.objectInspector').readOnly(),

    container: computed('application', function () {
      return this.get('application.__container__');
    }),

    portNamespace: 'container',

    TYPES_TO_SKIP: computed(function () {
      return ['component-lookup', 'container-debug-adapter', 'resolver-for-debugging', 'event_dispatcher'];
    }),

    typeFromKey: function typeFromKey(key) {
      return key.split(':').shift();
    },

    nameFromKey: function nameFromKey(key) {
      return key.split(':').pop();
    },

    shouldHide: function shouldHide(type) {
      return type[0] === '-' || this.get('TYPES_TO_SKIP').indexOf(type) !== -1;
    },

    instancesByType: function instancesByType() {
      var key = undefined;
      var instancesByType = {};
      var cache = this.get('container').cache;
      // Detect if InheritingDict (from Ember < 1.8)
      if (typeof cache.dict !== 'undefined' && typeof cache.eachLocal !== 'undefined') {
        cache = cache.dict;
      }
      for (key in cache) {
        var type = this.typeFromKey(key);
        if (this.shouldHide(type)) {
          continue;
        }
        if (instancesByType[type] === undefined) {
          instancesByType[type] = [];
        }
        instancesByType[type].push({
          fullName: key,
          instance: cache[key]
        });
      }
      return instancesByType;
    },

    getTypes: function getTypes() {
      var key = undefined;
      var types = [];
      var instancesByType = this.instancesByType();
      for (key in instancesByType) {
        types.push({ name: key, count: instancesByType[key].length });
      }
      return types;
    },

    getInstances: function getInstances(type) {
      var _this = this;

      var instances = this.instancesByType()[type];
      if (!instances) {
        return null;
      }
      return instances.map(function (item) {
        return {
          name: _this.nameFromKey(item.fullName),
          fullName: item.fullName,
          inspectable: _this.get('objectInspector').canSend(item.instance)
        };
      });
    },

    messages: {
      getTypes: function getTypes() {
        this.sendMessage('types', {
          types: this.getTypes()
        });
      },
      getInstances: function getInstances(message) {
        var instances = this.getInstances(message.containerType);
        if (instances) {
          this.sendMessage('instances', {
            instances: instances,
            status: 200
          });
        } else {
          this.sendMessage('instances', {
            status: 404
          });
        }
      },
      sendInstanceToConsole: function sendInstanceToConsole(message) {
        var instance = this.get('container').lookup(message.name);
        this.get('objectToConsole').sendValueToConsole(instance);
      }
    }
  });
});
'use strict';

define('ember-debug/data-debug', ['exports', 'ember-debug/mixins/port-mixin'], function (exports, PortMixin) {

  'use strict';

  var Ember = window.Ember;
  var EmberObject = Ember.Object;
  var computed = Ember.computed;
  var guidFor = Ember.guidFor;
  var A = Ember.A;
  var alias = computed.alias;

  exports['default'] = EmberObject.extend(PortMixin['default'], {
    init: function init() {
      this._super();
      this.sentTypes = {};
      this.sentRecords = {};
    },

    sentTypes: {},
    sentRecords: {},

    releaseTypesMethod: null,
    releaseRecordsMethod: null,

    adapter: computed('application', function () {
      var container = this.get('application').__container__;

      // dataAdapter:main is deprecated
      return this._resolve('data-adapter:main') && container.lookup('data-adapter:main') || this._resolve('dataAdapter:main') && container.lookup('dataAdapter:main');
    }),

    _resolve: function _resolve(name) {
      // Ember >= 2.1
      if (this.get('application').resolveRegistration) {
        return this.get('application').resolveRegistration(name);
      }
      var container = this.get('application').__container__;
      var registry = this.get('application.registry');
      if (registry) {
        // Ember >= 1.11
        return registry.resolve(name);
      } else if (container.resolve) {
        // Ember < 1.11
        return container.resolve(name);
      } else {
        // Ember >= 2.0 < 2.1
        return container.registry.resolve(name);
      }
    },

    namespace: null,

    port: alias('namespace.port'),
    application: alias('namespace.application'),
    objectInspector: alias('namespace.objectInspector'),

    portNamespace: 'data',

    modelTypesAdded: function modelTypesAdded(types) {
      var _this = this;

      var typesToSend = undefined;
      typesToSend = types.map(function (type) {
        return _this.wrapType(type);
      });
      this.sendMessage('modelTypesAdded', {
        modelTypes: typesToSend
      });
    },

    modelTypesUpdated: function modelTypesUpdated(types) {
      var _this2 = this;

      var typesToSend = types.map(function (type) {
        return _this2.wrapType(type);
      });
      this.sendMessage('modelTypesUpdated', {
        modelTypes: typesToSend
      });
    },

    wrapType: function wrapType(type) {
      var objectId = guidFor(type.object);
      this.sentTypes[objectId] = type;

      return {
        columns: type.columns,
        count: type.count,
        name: type.name,
        objectId: objectId
      };
    },

    recordsAdded: function recordsAdded(recordsReceived) {
      var _this3 = this;

      var records = undefined;
      records = recordsReceived.map(function (record) {
        return _this3.wrapRecord(record);
      });
      this.sendMessage('recordsAdded', {
        records: records
      });
    },

    recordsUpdated: function recordsUpdated(recordsReceived) {
      var _this4 = this;

      var records = recordsReceived.map(function (record) {
        return _this4.wrapRecord(record);
      });
      this.sendMessage('recordsUpdated', {
        records: records
      });
    },

    recordsRemoved: function recordsRemoved(idx, count) {
      this.sendMessage('recordsRemoved', {
        index: idx,
        count: count
      });
    },

    wrapRecord: function wrapRecord(record) {
      var objectId = guidFor(record.object);
      var columnValues = {};
      var searchKeywords = [];
      this.sentRecords[objectId] = record;
      // make objects clonable
      for (var i in record.columnValues) {
        columnValues[i] = this.get('objectInspector').inspect(record.columnValues[i]);
      }
      // make sure keywords can be searched and clonable
      searchKeywords = A(record.searchKeywords).filter(function (keyword) {
        return typeof keyword === 'string' || typeof keyword === 'number';
      });
      return {
        columnValues: columnValues,
        searchKeywords: searchKeywords,
        filterValues: record.filterValues,
        color: record.color,
        objectId: objectId
      };
    },

    releaseTypes: function releaseTypes() {
      if (this.releaseTypesMethod) {
        this.releaseTypesMethod();
        this.releaseTypesMethod = null;
        this.sentTypes = {};
      }
    },

    releaseRecords: function releaseRecords() {
      if (this.releaseRecordsMethod) {
        this.releaseRecordsMethod();
        this.releaseRecordsMethod = null;
        this.sentRecords = {};
      }
    },

    willDestroy: function willDestroy() {
      this._super();
      this.releaseRecords();
      this.releaseTypes();
    },

    messages: {
      checkAdapter: function checkAdapter() {
        this.sendMessage('hasAdapter', { hasAdapter: !!this.get('adapter') });
      },

      getModelTypes: function getModelTypes() {
        var _this5 = this;

        this.releaseTypes();
        this.releaseTypesMethod = this.get('adapter').watchModelTypes(function (types) {
          _this5.modelTypesAdded(types);
        }, function (types) {
          _this5.modelTypesUpdated(types);
        });
      },

      releaseModelTypes: function releaseModelTypes() {
        this.releaseTypes();
      },

      getRecords: function getRecords(message) {
        var _this6 = this,
            _arguments = arguments;

        var type = this.sentTypes[message.objectId];
        this.releaseRecords();

        var typeOrName = undefined;
        if (this.get('adapter.acceptsModelName')) {
          // Ember >= 1.3
          typeOrName = type.name;
        } else {
          // support for legacy Ember < 1.3
          typeOrName = type.object;
        }
        var releaseMethod = this.get('adapter').watchRecords(typeOrName, function (recordsReceived) {
          _this6.recordsAdded(recordsReceived);
        }, function (recordsUpdated) {
          _this6.recordsUpdated(recordsUpdated);
        }, function () {
          _this6.recordsRemoved.apply(_this6, _arguments);
        });
        this.releaseRecordsMethod = releaseMethod;
      },

      releaseRecords: function releaseRecords() {
        this.releaseRecords();
      },

      inspectModel: function inspectModel(message) {
        this.get('objectInspector').sendObject(this.sentRecords[message.objectId].object);
      },

      getFilters: function getFilters() {
        this.sendMessage('filters', {
          filters: this.get('adapter').getFilters()
        });
      }
    }
  });
});
'use strict';

define('ember-debug/deprecation-debug', ['exports', 'ember-debug/mixins/port-mixin', 'ember-debug/libs/source-map'], function (exports, PortMixin, SourceMap) {

  'use strict';

  var Ember = window.Ember;
  var EmberObject = Ember.Object;
  var computed = Ember.computed;
  var guidFor = Ember.guidFor;
  var run = Ember.run;
  var RSVP = Ember.RSVP;
  var A = Ember.A;
  var resolve = RSVP.resolve;
  var all = RSVP.all;
  var oneWay = computed.oneWay;

  exports['default'] = EmberObject.extend(PortMixin['default'], {
    portNamespace: 'deprecation',

    port: oneWay('namespace.port').readOnly(),

    adapter: oneWay('port.adapter').readOnly(),

    deprecations: computed(function () {
      return A();
    }),

    groupedDeprecations: computed(function () {
      return {};
    }),

    deprecationsToSend: computed(function () {
      return A();
    }),

    sourceMap: computed(function () {
      return SourceMap['default'].create();
    }),

    emberCliConfig: oneWay('namespace.generalDebug.emberCliConfig').readOnly(),

    init: function init() {
      this._super();
      this.replaceDeprecate();
    },

    /**
     * Checks if ember-cli and looks for source maps.
     */
    fetchSourceMap: function fetchSourceMap(stackStr) {
      var _this = this;

      if (this.get('emberCliConfig') && this.get('emberCliConfig.environment') === 'development') {
        return this.get('sourceMap').map(stackStr).then(function (mapped) {
          if (mapped && mapped.length > 0) {
            var source = mapped.find(function (item) {
              return item.source && !!item.source.match(new RegExp(_this.get('emberCliConfig.modulePrefix')));
            });
            if (source) {
              source.found = true;
            } else {
              source = mapped.get('firstObject');
              source.found = false;
            }
            return source;
          }
        });
      } else {
        return resolve(null, 'ember-inspector');
      }
    },

    sendPending: function sendPending() {
      var _this2 = this;

      var deprecations = A();

      var promises = all(this.get('deprecationsToSend').map(function (deprecation) {
        var obj = undefined;
        var promise = resolve(undefined, 'ember-inspector');
        var grouped = _this2.get('groupedDeprecations');
        _this2.get('deprecations').pushObject(deprecation);
        var id = guidFor(deprecation.message);
        obj = grouped[id];
        if (obj) {
          obj.count++;
          obj.url = obj.url || deprecation.url;
        } else {
          obj = deprecation;
          obj.count = 1;
          obj.id = id;
          obj.sources = A();
          grouped[id] = obj;
        }
        var found = obj.sources.findBy('stackStr', deprecation.stackStr);
        if (!found) {
          (function () {
            var stackStr = deprecation.stackStr;
            promise = _this2.fetchSourceMap(stackStr).then(function (map) {
              obj.sources.pushObject({
                map: map,
                stackStr: stackStr
              });
              if (map) {
                obj.hasSourceMap = true;
              }
            }, null, 'ember-inspector');
          })();
        }
        return promise.then(function () {
          delete obj.stackStr;
          deprecations.addObject(obj);
        });
      }));

      promises.then(function () {
        _this2.sendMessage('deprecationsAdded', { deprecations: deprecations });
        _this2.get('deprecationsToSend').clear();
        _this2.sendCount();
      }, null, 'ember-inspector');
    },

    sendCount: function sendCount() {
      this.sendMessage('count', {
        count: this.get('deprecations.length') + this.get('deprecationsToSend.length')
      });
    },

    messages: {
      watch: function watch() {
        this._watching = true;
        var grouped = this.get('groupedDeprecations');
        var deprecations = [];
        for (var i in grouped) {
          if (!grouped.hasOwnProperty(i)) {
            continue;
          }
          deprecations.push(grouped[i]);
        }
        this.sendMessage('deprecationsAdded', {
          deprecations: deprecations
        });
        this.sendPending();
      },

      sendStackTraces: function sendStackTraces(message) {
        var _this3 = this;

        var deprecation = message.deprecation;
        deprecation.sources.forEach(function (source) {
          var stack = source.stackStr;
          stack = stack.split('\n');
          stack.unshift('Ember Inspector (Deprecation Trace): ' + (deprecation.message || ''));
          _this3.get('adapter').log(stack.join('\n'));
        });
      },

      getCount: function getCount() {
        this.sendCount();
      },

      clear: function clear() {
        run.cancel(this.debounce);
        this.get('deprecations').clear();
        this.set('groupedDeprecations', {});
        this.sendCount();
      },

      release: function release() {
        this._watching = false;
      }
    },

    willDestroy: function willDestroy() {
      Ember.deprecate = this.originalDeprecate;
      this.originalDeprecate = null;
      run.cancel(this.debounce);
      this._super();
    },

    replaceDeprecate: function replaceDeprecate() {
      var self = this;
      this.originalDeprecate = Ember.deprecate;

      Ember.deprecate = function (message, test, options) {
        /* global __fail__*/
        // Code taken from https://github.com/emberjs/ember.js/blob/master/packages/ember-debug/lib/main.js
        var noDeprecation = undefined;

        if (typeof test === 'function' && !EmberObject.detect(test)) {
          // try/catch to support old Ember versions
          try {
            noDeprecation = test();
          } catch (e) {
            noDeprecation = true;
          }
        } else {
          noDeprecation = test;
        }

        if (noDeprecation) {
          return;
        }

        var error = undefined;

        // When using new Error, we can't do the arguments check for Chrome. Alternatives are welcome
        try {
          __fail__.fail();
        } catch (e) {
          error = e;
        }

        var stack = undefined;
        var stackStr = '';
        if (error.stack) {

          // var stack;
          if (error['arguments']) {
            // Chrome
            stack = error.stack.replace(/^\s+at\s+/gm, '').replace(/^([^\(]+?)([\n$])/gm, '{anonymous}($1)$2').replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}($1)').split('\n');
            stack.shift();
          } else {
            // Firefox
            stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n');
          }

          stackStr = "\n    " + stack.slice(2).join("\n    ");
        }

        var url = undefined;
        if (arguments.length === 3 && options && typeof options === 'object') {
          url = options.url;
        }

        var deprecation = {
          message: message,
          stackStr: stackStr,
          url: url
        };

        self.get('deprecationsToSend').pushObject(deprecation);
        run.cancel(self.debounce);
        if (self._watching) {
          self.debounce = run.debounce(self, 'sendPending', 100);
        } else {
          self.debounce = run.debounce(self, 'sendCount', 100);
        }
        if (!self._warned) {
          self.get("adapter").warn("Deprecations were detected, see the Ember Inspector deprecations tab for more details.");
          self._warned = true;
        }
      };
    }

  });
});
'use strict';

define('ember-debug/general-debug', ['exports', 'ember-debug/mixins/port-mixin'], function (exports, PortMixin) {

  'use strict';

  /* eslint no-empty:0 */
  var Ember = window.Ember;
  var $ = Ember.$;
  var computed = Ember.computed;
  var EmberObject = Ember.Object;
  var A = Ember.A;
  var libraries = Ember.libraries;
  var oneWay = computed.oneWay;

  var GeneralDebug = EmberObject.extend(PortMixin['default'], {
    namespace: null,

    port: oneWay('namespace.port').readOnly(),

    application: oneWay('namespace.application').readOnly(),

    promiseDebug: oneWay('namespace.promiseDebug').readOnly(),

    portNamespace: 'general',

    // Keep an eye on https://github.com/ember-cli/ember-cli/issues/3045
    emberCliConfig: computed(function () {
      var config = undefined;
      $('meta[name]').each(function () {
        var meta = $(this);
        var match = meta.attr('name').match(/environment$/);
        if (match) {
          try {
            /* global unescape */
            config = JSON.parse(unescape(meta.attr('content')));
            return false;
          } catch (e) {}
        }
      });
      return config;
    }),

    sendBooted: function sendBooted() {
      this.sendMessage('applicationBooted', {
        booted: this.get('application.__inspector__booted')
      });
    },

    sendReset: function sendReset() {
      this.sendMessage('reset', {
        reset: true
      });
    },

    messages: {
      applicationBooted: function applicationBooted() {
        this.sendBooted();
      },
      getLibraries: function getLibraries() {

        // Ember has changed where the array of libraries is located.
        // In older versions, `Ember.libraries` was the array itself,
        // but now it's found under _registry.
        if (libraries._registry) {
          libraries = libraries._registry;
        }

        this.sendMessage('libraries', { libraries: arrayize(libraries) });
      },
      refresh: function refresh() {
        window.location.reload();
      }
    }
  });

  function arrayize(enumerable) {
    return A(enumerable).map(function (item) {
      return item;
    });
  }

  exports['default'] = GeneralDebug;
});
'use strict';

define('ember-debug/libs/promise-assembler', ['exports', 'ember-debug/models/promise'], function (exports, Promise) {

  'use strict';

  /**
    Original implementation and the idea behind the `PromiseAssembler`,
    `Promise` model, and other work related to promise inspection was done
    by Stefan Penner (@stefanpenner) thanks to McGraw Hill Education (@mhelabs)
    and Yapp Labs (@yapplabs).
   */

  var Ember = window.Ember;
  var EmberObject = Ember.Object;
  var Evented = Ember.Evented;
  var A = Ember.A;
  var computed = Ember.computed;
  var RSVP = Ember.RSVP;
  var copy = Ember.copy;
  var isNone = Ember.isNone;

  var PromiseAssembler = EmberObject.extend(Evented, {
    // RSVP lib to debug
    RSVP: RSVP,

    all: computed(function () {
      return A();
    }),

    promiseIndex: computed(function () {
      return {};
    }),

    // injected on creation
    promiseDebug: null,

    start: function start() {
      var _this = this;

      this.RSVP.configure('instrument', true);

      this.promiseChained = function (e) {
        chain.call(_this, e);
      };
      this.promiseRejected = function (e) {
        reject.call(_this, e);
      };
      this.promiseFulfilled = function (e) {
        fulfill.call(_this, e);
      };
      this.promiseCreated = function (e) {
        create.bind(_this)(e);
      };

      this.RSVP.on('chained', this.promiseChained);
      this.RSVP.on('rejected', this.promiseRejected);
      this.RSVP.on('fulfilled', this.promiseFulfilled);
      this.RSVP.on('created', this.promiseCreated);
    },

    stop: function stop() {
      this.RSVP.configure('instrument', false);
      this.RSVP.off('chained', this.promiseChained);
      this.RSVP.off('rejected', this.promiseRejected);
      this.RSVP.off('fulfilled', this.promiseFulfilled);
      this.RSVP.off('created', this.promiseCreated);

      this.get('all').forEach(function (item) {
        item.destroy();
      });
      this.set('all', A());
      this.set('promiseIndex', {});

      this.promiseChained = null;
      this.promiseRejected = null;
      this.promiseFulfilled = null;
      this.promiseCreated = null;
    },

    willDestroy: function willDestroy() {
      this.stop();
      this._super();
    },

    createPromise: function createPromise(props) {
      var promise = Promise['default'].create(props);
      var index = this.get('all.length');

      this.get('all').pushObject(promise);
      this.get('promiseIndex')[promise.get('guid')] = index;
      return promise;
    },

    find: function find(guid) {
      if (guid) {
        var index = this.get('promiseIndex')[guid];
        if (index !== undefined) {
          return this.get('all').objectAt(index);
        }
      } else {
        return this.get('all');
      }
    },

    findOrCreate: function findOrCreate(guid) {
      return this.find(guid) || this.createPromise({
        guid: guid
      });
    },

    updateOrCreate: function updateOrCreate(guid, properties) {
      var entry = this.find(guid);
      if (entry) {
        entry.setProperties(properties);
      } else {
        properties = copy(properties);
        properties.guid = guid;
        entry = this.createPromise(properties);
      }

      return entry;
    }
  });

  exports['default'] = PromiseAssembler;

  PromiseAssembler.reopenClass({
    supported: function supported() {
      return !!RSVP.on;
    }
  });

  var fulfill = function fulfill(event) {
    var guid = event.guid;
    var promise = this.updateOrCreate(guid, {
      label: event.label,
      settledAt: event.timeStamp,
      state: 'fulfilled',
      value: event.detail
    });
    this.trigger('fulfilled', {
      promise: promise
    });
  };

  var reject = function reject(event) {
    var guid = event.guid;
    var promise = this.updateOrCreate(guid, {
      label: event.label,
      settledAt: event.timeStamp,
      state: 'rejected',
      reason: event.detail
    });
    this.trigger('rejected', {
      promise: promise
    });
  };

  function chain(event) {
    /*jshint validthis:true */
    var guid = event.guid;
    var promise = this.updateOrCreate(guid, {
      label: event.label,
      chainedAt: event.timeStamp
    });
    var children = promise.get('children');
    var child = this.findOrCreate(event.childGuid);

    child.set('parent', promise);
    children.pushObject(child);

    this.trigger('chained', {
      promise: promise,
      child: child
    });
  }

  function create(event) {
    /*jshint validthis:true */
    var guid = event.guid;

    var promise = this.updateOrCreate(guid, {
      label: event.label,
      createdAt: event.timeStamp,
      stack: event.stack
    });

    // todo fix ordering
    if (isNone(promise.get('state'))) {
      promise.set('state', 'created');
    }
    this.trigger('created', {
      promise: promise
    });
  }
});
'use strict';

define('ember-debug/libs/source-map', ['exports'], function (exports) {

  'use strict';

  /**
   * Used to map a stack trace to its original sources.
   * A lot of the code is inspired by/taken from
   * https://github.com/evanw/node-source-map-support
   */
  var Ember = window.Ember;
  var EmberObject = Ember.Object;
  var A = Ember.A;
  var computed = Ember.computed;
  var _Ember$RSVP = Ember.RSVP;
  var resolve = _Ember$RSVP.resolve;
  var Promise = _Ember$RSVP.Promise;

  var notFoundError = new Error('Source map url not found');

  exports['default'] = EmberObject.extend({

    _lastPromise: computed(function () {
      return resolve(undefined, 'ember-inspector');
    }),

    /**
     * Returns a promise that resolves to an array
     * of mapped sourcew.
     *
     * @param  {String} stack The stack trace
     * @return {RSVP.Promise}
     */
    map: function map(stack) {
      var _this = this;

      var parsed = A(fromStackProperty(stack));
      var array = A();
      var lastPromise = null;
      parsed.forEach(function (item) {
        lastPromise = _this.get('_lastPromise').then(function () {
          return _this.getSourceMap(item.url);
        }, null, 'ember-inspector').then(function (smc) {
          if (smc) {
            var source = smc.originalPositionFor({
              line: item.line,
              column: item.column
            });
            source.fullSource = relativeToAbsolute(item.url, source.source);
            array.push(source);
            return array;
          }
        }, null, 'ember-inspector');
        _this.set('_lastPromise', lastPromise);
      });
      return resolve(lastPromise, 'ember-inspector')['catch'](function (e) {
        if (e === notFoundError) {
          return null;
        }
        throw e;
      }, 'ember-inspector');
    },

    sourceMapCache: computed(function () {
      return {};
    }),

    getSourceMap: function getSourceMap(url) {
      var sourceMaps = this.get('sourceMapCache');
      if (sourceMaps[url] !== undefined) {
        return resolve(sourceMaps[url], 'ember-inspector');
      }
      return retrieveSourceMap(url).then(function (response) {
        if (response) {
          var map = JSON.parse(response.map);
          var sm = new window.sourceMap.SourceMapConsumer(map);
          sourceMaps[url] = sm;
          return sm;
        }
      }, function () {
        sourceMaps[url] = null;
      });
    }
  });

  function retrieveSourceMap(source) {
    var mapURL = undefined;
    return retrieveSourceMapURL(source).then(function (sourceMappingURL) {
      if (!sourceMappingURL) {
        throw notFoundError;
      }

      // Support source map URLs relative to the source URL
      mapURL = relativeToAbsolute(source, sourceMappingURL);
      return mapURL;
    }).then(retrieveFile).then(function (sourceMapData) {
      if (!sourceMapData) {
        return null;
      }
      return {
        url: mapURL,
        map: sourceMapData
      };
    });
  }

  function relativeToAbsolute(file, url) {
    if (!file) {
      return url;
    }
    var dir = file.split('/');
    dir.pop();
    dir.push(url);
    return dir.join('/');
  }

  function retrieveFile(source) {
    return new Promise(function (resolve) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(this.responseText, 'ember-inspector');
      };
      xhr.open('GET', source, true);
      xhr.send();
    }, 'ember-inspector');
  }

  function retrieveSourceMapURL(source) {
    return retrieveFile(source).then(function (fileData) {
      var match = /\/\/[#@]\s*sourceMappingURL=(.*)\s*$/m.exec(fileData);
      if (!match) {
        return null;
      }
      return match[1];
    });
  }

  var UNKNOWN_FUNCTION = "<unknown>";

  // Taken from https://github.com/errorception/browser-stack-parser/
  function fromStackProperty(stackString) {
    var chrome = /^\s*at (?:((?:\[object object\])?\S+(?: \[as \S+\])?) )?\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
    var gecko = /^\s*(\S*)(?:\((.*?)\))?@((?:file|http|https).*?):(\d+)(?::(\d+))?\s*$/i;
    var lines = stackString.split('\n');
    var stack = [];
    var parts = undefined;

    for (var i = 0, j = lines.length; i < j; ++i) {
      if (parts = gecko.exec(lines[i])) {
        stack.push({
          url: parts[3],
          func: parts[1] || UNKNOWN_FUNCTION,
          args: parts[2] ? parts[2].split(',') : '',
          line: +parts[4],
          column: parts[5] ? +parts[5] : null
        });
      } else if (parts = chrome.exec(lines[i])) {
        stack.push({
          url: parts[2],
          func: parts[1] || UNKNOWN_FUNCTION,
          line: +parts[3],
          column: parts[4] ? +parts[4] : null
        });
      }
    }

    return stack.length ? stack : null;
  }
});
'use strict';

define('ember-debug/main', ['exports', 'ember-debug/adapters/basic', 'ember-debug/port', 'ember-debug/object-inspector', 'ember-debug/general-debug', 'ember-debug/render-debug', 'ember-debug/view-debug', 'ember-debug/route-debug', 'ember-debug/data-debug', 'ember-debug/promise-debug', 'ember-debug/container-debug', 'ember-debug/deprecation-debug', 'ember-debug/services/session'], function (exports, BasicAdapter, Port, ObjectInspector, GeneralDebug, RenderDebug, ViewDebug, RouteDebug, DataDebug, PromiseDebug, ContainerDebug, DeprecationDebug, Session) {

  'use strict';

  var Ember = window.Ember;
  var EmberObject = Ember.Object;
  var run = Ember.run;
  var Application = Ember.Application;
  var namespaces = Ember.namespaces;

  var EmberDebug = EmberObject.extend({

    application: null,
    started: false,

    Port: Port['default'],
    Adapter: BasicAdapter['default'],

    start: function start($keepAdapter) {
      if (this.get('started')) {
        this.reset($keepAdapter);
        return;
      }
      this.set('started', true);

      if (!this.get('application')) {
        this.set('application', getApplication());
      }

      this.reset();

      this.get("adapter").debug("Ember Inspector Active");
    },

    destroyContainer: function destroyContainer() {
      var _this = this;

      if (this.get('generalDebug')) {
        this.get('generalDebug').sendReset();
      }
      ['dataDebug', 'viewDebug', 'routeDebug', 'generalDebug', 'renderDebug', 'promiseDebug', 'containerDebug', 'deprecationDebug', 'objectInspector', 'session'].forEach(function (prop) {
        var handler = _this.get(prop);
        if (handler) {
          run(handler, 'destroy');
          _this.set(prop, null);
        }
      });
    },

    startModule: function startModule(prop, Module) {
      this.set(prop, Module.create({ namespace: this }));
    },

    willDestroy: function willDestroy() {
      this.destroyContainer();
      this._super.apply(this, arguments);
    },

    reset: function reset($keepAdapter) {
      var _this2 = this;

      this.destroyContainer();
      run(function () {
        // Adapters don't have state depending on the application itself.
        // They also maintain connections with the inspector which we will
        // lose if we destroy.
        if (!_this2.get('adapter') || !$keepAdapter) {
          _this2.startModule('adapter', _this2.Adapter);
        }
        if (!_this2.get('port') || !$keepAdapter) {
          _this2.startModule('port', _this2.Port);
        }

        _this2.startModule('session', Session['default']);
        _this2.startModule('generalDebug', GeneralDebug['default']);
        _this2.startModule('renderDebug', RenderDebug['default']);
        _this2.startModule('objectInspector', ObjectInspector['default']);
        _this2.startModule('routeDebug', RouteDebug['default']);
        _this2.startModule('viewDebug', ViewDebug['default']);
        _this2.startModule('dataDebug', DataDebug['default']);
        _this2.startModule('promiseDebug', PromiseDebug['default']);
        _this2.startModule('containerDebug', ContainerDebug['default']);
        _this2.startModule('deprecationDebug', DeprecationDebug['default']);

        _this2.generalDebug.sendBooted();
        _this2.viewDebug.sendTree();
      });
    },

    inspect: function inspect(obj) {
      this.get('objectInspector').sendObject(obj);
      this.get('adapter').log('Sent to the Object Inspector');
      return obj;
    }

  }).create();

  function getApplication() {
    var namespaces = Namespace.NAMESPACES;
    var application = undefined;

    namespaces.forEach(function (namespace) {
      if (namespace instanceof Application) {
        application = namespace;
        return false;
      }
    });
    return application;
  }

  exports['default'] = EmberDebug;
});
'use strict';

define('ember-debug/mixins/port-mixin', ['exports'], function (exports) {

  'use strict';

  var Ember = window.Ember;
  var Mixin = Ember.Mixin;

  exports['default'] = Mixin.create({
    port: null,
    messages: {},

    portNamespace: null,

    init: function init() {
      this.setupPortListeners();
    },

    willDestroy: function willDestroy() {
      this.removePortListeners();
    },

    sendMessage: function sendMessage(name, message) {
      this.get('port').send(this.messageName(name), message);
    },

    setupPortListeners: function setupPortListeners() {
      var port = this.get('port');
      var messages = this.get('messages');

      for (var _name in messages) {
        if (messages.hasOwnProperty(_name)) {
          port.on(this.messageName(_name), this, messages[_name]);
        }
      }
    },

    removePortListeners: function removePortListeners() {
      var port = this.get('port');
      var messages = this.get('messages');

      for (var _name2 in messages) {
        if (messages.hasOwnProperty(_name2)) {
          port.off(this.messageName(_name2), this, messages[_name2]);
        }
      }
    },

    messageName: function messageName(name) {
      var messageName = name;
      if (this.get('portNamespace')) {
        messageName = this.get('portNamespace') + ':' + messageName;
      }
      return messageName;
    }
  });
});
'use strict';

define('ember-debug/models/profile-manager', ['exports', 'ember-debug/models/profile-node'], function (exports, ProfileNode) {

  'use strict';

  var Ember = window.Ember;
  var scheduleOnce = Ember.run.scheduleOnce;

  /**
   * A class for keeping track of active rendering profiles as a list.
   */
  var ProfileManager = function ProfileManager() {
    this.profiles = [];
    this.current = null;
    this.currentSet = [];
    this._profilesAddedCallbacks = [];
  };

  ProfileManager.prototype = {
    began: function began(timestamp, payload, now) {
      return this.wrapForErrors(this, function () {
        this.current = new ProfileNode['default'](timestamp, payload, this.current, now);
        return this.current;
      });
    },

    ended: function ended(timestamp, payload, profileNode) {
      if (payload.exception) {
        throw payload.exception;
      }
      return this.wrapForErrors(this, function () {
        this.current = profileNode.parent;
        profileNode.finish(timestamp);

        // Are we done profiling an entire tree?
        if (!this.current) {
          this.currentSet.push(profileNode);
          // If so, schedule an update of the profile list
          scheduleOnce('afterRender', this, this._profilesFinished);
        }
      });
    },

    wrapForErrors: function wrapForErrors(context, callback) {
      return callback.call(context);
    },

    clearProfiles: function clearProfiles() {
      this.profiles.length = 0;
    },

    _profilesFinished: function _profilesFinished() {
      return this.wrapForErrors(this, function () {
        var firstNode = this.currentSet[0];
        var parentNode = new ProfileNode['default'](firstNode.start, { template: 'View Rendering' });

        parentNode.time = 0;
        this.currentSet.forEach(function (n) {
          parentNode.time += n.time;
          parentNode.children.push(n);
        });
        parentNode.calcDuration();

        this.profiles.push(parentNode);
        this._triggerProfilesAdded([parentNode]);
        this.currentSet = [];
      });
    },

    _profilesAddedCallbacks: undefined, // set to array on init

    onProfilesAdded: function onProfilesAdded(context, callback) {
      this._profilesAddedCallbacks.push({
        context: context,
        callback: callback
      });
    },

    offProfilesAdded: function offProfilesAdded(context, callback) {
      var index = -1,
          item = undefined;
      for (var i = 0, l = this._profilesAddedCallbacks.length; i < l; i++) {
        item = this._profilesAddedCallbacks[i];
        if (item.context === context && item.callback === callback) {
          index = i;
        }
      }
      if (index > -1) {
        this._profilesAddedCallbacks.splice(index, 1);
      }
    },

    _triggerProfilesAdded: function _triggerProfilesAdded(profiles) {
      this._profilesAddedCallbacks.forEach(function (item) {
        item.callback.call(item.context, profiles);
      });
    }
  };

  exports['default'] = ProfileManager;
});
'use strict';

define('ember-debug/models/profile-node', ['exports'], function (exports) {

  'use strict';

  /**
    A tree structure for assembling a list of render calls so they can be grouped and displayed nicely afterwards.
     @class ProfileNode
  **/
  var Ember = window.Ember;
  var get = Ember.get;
  var guidFor = Ember.guidFor;

  var ProfileNode = function ProfileNode(start, payload, parent, now) {
    var name = undefined;
    this.start = start;
    this.timestamp = now || Date.now();

    if (payload) {
      if (payload.template) {
        name = payload.template;
      } else if (payload.view) {
        var view = payload.view;
        name = get(view, 'instrumentDisplay') || get(view, '_debugContainerKey');
        if (name) {
          name = name.replace(/^view:/, '');
        }
        this.viewGuid = guidFor(view);
      }

      if (!name && payload.object) {
        name = payload.object.toString().replace(/:?:ember\d+>$/, '').replace(/^</, '');
        if (!this.viewGuid) {
          var match = name.match(/:(ember\d+)>$/);
          if (match && match.length > 1) {
            this.viewGuid = match[1];
          }
        }
      }
    }

    this.name = name || 'Unknown view';

    if (parent) {
      this.parent = parent;
    }
    this.children = [];
  };

  ProfileNode.prototype = {
    finish: function finish(timestamp) {
      this.time = timestamp - this.start;
      this.calcDuration();

      // Once we attach to our parent, we remove that reference
      // to avoid a graph cycle when serializing:
      if (this.parent) {
        this.parent.children.push(this);
        this.parent = null;
      }
    },

    calcDuration: function calcDuration() {
      this.duration = Math.round(this.time * 100) / 100;
    }
  };

  exports['default'] = ProfileNode;
});
'use strict';

define('ember-debug/models/promise', ['exports', 'ember-debug/addons/ember-new-computed/index'], function (exports, computedPolyfill) {

  'use strict';

  var Ember = window.Ember;
  var typeOf = Ember.typeOf;
  var EmberObject = Ember.Object;
  var computed = Ember.computed;
  var A = Ember.A;

  var dateComputed = function dateComputed() {
    return computedPolyfill['default']({
      get: function get() {
        return null;
      },
      set: function set(key, date) {
        if (typeOf(date) === 'date') {
          return date;
        } else if (typeof date === 'number' || typeof date === 'string') {
          return new Date(date);
        }
        return null;
      }
    });
  };

  exports['default'] = EmberObject.extend({
    createdAt: dateComputed(),
    settledAt: dateComputed(),
    chainedAt: dateComputed(),

    parent: null,

    children: computed(function () {
      return A();
    }),

    level: computed('parent.level', function () {
      var parent = this.get('parent');
      if (!parent) {
        return 0;
      }
      return parent.get('level') + 1;
    }),

    isSettled: computed('state', function () {
      return this.get('isFulfilled') || this.get('isRejected');
    }),

    isFulfilled: computed('state', function () {
      return this.get('state') === 'fulfilled';
    }),

    isRejected: computed('state', function () {
      return this.get('state') === 'rejected';
    })

  });
});
'use strict';

define('ember-debug/object-inspector', ['exports', 'ember-debug/mixins/port-mixin'], function (exports, PortMixin) {

  'use strict';

  var Ember = window.Ember;
  var EmberObject = Ember.Object;
  var emberInspect = Ember.inspect;
  var emberMeta = Ember.meta;
  var typeOf = Ember.typeOf;
  var Descriptor = Ember.Descriptor;
  var computed = Ember.computed;
  var get = Ember.get;
  var set = Ember.set;
  var ComputedProperty = Ember.ComputedProperty;
  var guidFor = Ember.guidFor;
  var isNone = Ember.isNone;
  var removeObserver = Ember.removeObserver;
  var Mixin = Ember.Mixin;
  var addObserver = Ember.addObserver;
  var cacheFor = Ember.cacheFor;
  var oneWay = computed.oneWay;

  var keys = Object.keys || Ember.keys;

  function inspectValue(value) {
    var string = undefined;
    if (value instanceof EmberObject) {
      return { type: "type-ember-object", inspect: value.toString() };
    } else if (isComputed(value)) {
      string = "<computed>";
      return { type: "type-descriptor", inspect: string, computed: true };
    } else if (isDescriptor(value)) {
      return { type: "type-descriptor", inspect: value.toString(), computed: true };
    } else {
      return { type: "type-" + typeOf(value), inspect: inspect(value) };
    }
  }

  function isDescriptor(value) {
    // Ember < 1.11
    if (Descriptor !== undefined) {
      return value instanceof Descriptor;
    }
    // Ember >= 1.11
    return value && typeof value === 'object' && value.isDescriptor;
  }

  function inspect(value) {
    if (typeof value === 'function') {
      return "function() { ... }";
    } else if (value instanceof EmberObject) {
      return value.toString();
    } else if (typeOf(value) === 'array') {
      if (value.length === 0) {
        return '[]';
      } else if (value.length === 1) {
        return '[ ' + inspect(value[0]) + ' ]';
      } else {
        return '[ ' + inspect(value[0]) + ', ... ]';
      }
    } else if (value instanceof Error) {
      return 'Error: ' + value.message;
    } else if (value === null) {
      return 'null';
    } else if (typeOf(value) === 'date') {
      return value.toString();
    } else if (typeof value === 'object') {
      // `Ember.inspect` is able to handle this use case,
      // but it is very slow as it loops over all props,
      // so summarize to just first 2 props
      var ret = [];
      var v = undefined;
      var count = 0;
      var broken = false;

      for (var key in value) {
        if (!('hasOwnProperty' in value) || value.hasOwnProperty(key)) {
          if (count++ > 1) {
            broken = true;
            break;
          }
          v = value[key];
          if (v === 'toString') {
            continue;
          } // ignore useless items
          if (typeOf(v) === 'function') {
            v = "function() { ... }";
          }
          if (typeOf(v) === 'array') {
            v = '[Array : ' + v.length + ']';
          }
          if (typeOf(v) === 'object') {
            v = '[Object]';
          }
          ret.push(key + ": " + v);
        }
      }
      var suffix = ' }';
      if (broken) {
        suffix = ' ...}';
      }
      return '{ ' + ret.join(', ') + suffix;
    } else {
      return emberInspect(value);
    }
  }

  exports['default'] = EmberObject.extend(PortMixin['default'], {
    namespace: null,

    adapter: oneWay('namespace.adapter'),

    port: oneWay('namespace.port'),

    application: oneWay('namespace.application'),

    init: function init() {
      this._super();
      this.set('sentObjects', {});
      this.set('boundObservers', {});
    },

    willDestroy: function willDestroy() {
      this._super();
      for (var objectId in this.sentObjects) {
        this.releaseObject(objectId);
      }
    },

    sentObjects: {},

    boundObservers: {},

    _errorsFor: computed(function () {
      return {};
    }),

    portNamespace: 'objectInspector',

    messages: {
      digDeeper: function digDeeper(message) {
        this.digIntoObject(message.objectId, message.property);
      },
      releaseObject: function releaseObject(message) {
        this.releaseObject(message.objectId);
      },
      calculate: function calculate(message) {
        var value = undefined;
        value = this.valueForObjectProperty(message.objectId, message.property, message.mixinIndex);
        if (value) {
          this.sendMessage('updateProperty', value);
          message.computed = true;
          this.bindPropertyToDebugger(message);
        }
        this.sendMessage('updateErrors', {
          objectId: message.objectId,
          errors: errorsToSend(this.get('_errorsFor')[message.objectId])
        });
      },
      saveProperty: function saveProperty(message) {
        var value = message.value;
        if (message.dataType && message.dataType === 'date') {
          value = new Date(value);
        }
        this.saveProperty(message.objectId, message.mixinIndex, message.property, value);
      },
      sendToConsole: function sendToConsole(message) {
        this.sendToConsole(message.objectId, message.property);
      },
      sendControllerToConsole: function sendControllerToConsole(message) {
        var container = this.get('application.__container__');
        this.sendValueToConsole(container.lookup('controller:' + message.name));
      },
      sendRouteHandlerToConsole: function sendRouteHandlerToConsole(message) {
        var container = this.get('application.__container__');
        this.sendValueToConsole(container.lookup('route:' + message.name));
      },
      inspectRoute: function inspectRoute(message) {
        var container = this.get('application.__container__');
        this.sendObject(container.lookup('router:main').router.getHandler(message.name));
      },
      inspectController: function inspectController(message) {
        var container = this.get('application.__container__');
        this.sendObject(container.lookup('controller:' + message.name));
      },
      inspectById: function inspectById(message) {
        var obj = this.sentObjects[message.objectId];
        this.sendObject(obj);
      },
      inspectByContainerLookup: function inspectByContainerLookup(message) {
        var container = this.get('application.__container__');
        this.sendObject(container.lookup(message.name));
      },
      traceErrors: function traceErrors(message) {
        var _this = this;

        var errors = this.get('_errorsFor')[message.objectId];
        toArray(errors).forEach(function (error) {
          var stack = error.error;
          if (stack && stack.stack) {
            stack = stack.stack;
          } else {
            stack = error;
          }
          _this.get('adapter').log('Object Inspector error for ' + error.property, stack);
        });
      }
    },

    canSend: function canSend(val) {
      return val instanceof EmberObject || typeOf(val) === 'array';
    },

    saveProperty: function saveProperty(objectId, mixinIndex, prop, val) {
      var object = this.sentObjects[objectId];
      set(object, prop, val);
    },

    sendToConsole: function sendToConsole(objectId, prop) {
      var object = this.sentObjects[objectId];
      var value = undefined;

      if (isNone(prop)) {
        value = this.sentObjects[objectId];
      } else {
        value = get(object, prop);
      }

      this.sendValueToConsole(value);
    },

    sendValueToConsole: function sendValueToConsole(value) {
      window.$E = value;
      if (value instanceof Error) {
        value = value.stack;
      }
      this.get("adapter").log('Ember Inspector ($E): ', value);
    },

    digIntoObject: function digIntoObject(objectId, property) {
      var parentObject = this.sentObjects[objectId],
          object = get(parentObject, property);

      if (this.canSend(object)) {
        var details = this.mixinsForObject(object);

        this.sendMessage('updateObject', {
          parentObject: objectId,
          property: property,
          objectId: details.objectId,
          name: object.toString(),
          details: details.mixins,
          errors: details.errors
        });
      }
    },

    sendObject: function sendObject(object) {
      if (!this.canSend(object)) {
        throw new Error("Can't inspect " + object + ". Only Ember objects and arrays are supported.");
      }
      var details = this.mixinsForObject(object);
      this.sendMessage('updateObject', {
        objectId: details.objectId,
        name: object.toString(),
        details: details.mixins,
        errors: details.errors
      });
    },

    retainObject: function retainObject(object) {
      var _this2 = this;

      var meta = emberMeta(object);
      var guid = guidFor(object);

      meta._debugReferences = meta._debugReferences || 0;
      meta._debugReferences++;

      this.sentObjects[guid] = object;

      if (meta._debugReferences === 1 && object.reopen) {
        (function () {
          // drop object on destruction
          var _oldWillDestroy = object._oldWillDestroy = object.willDestroy;
          var self = _this2;
          object.reopen({
            willDestroy: function willDestroy() {
              self.dropObject(guid);
              return _oldWillDestroy.apply(this, arguments);
            }
          });
        })();
      }

      return guid;
    },

    releaseObject: function releaseObject(objectId) {
      var object = this.sentObjects[objectId];
      if (!object) {
        return;
      }
      var meta = emberMeta(object);
      var guid = guidFor(object);

      meta._debugReferences--;

      if (meta._debugReferences === 0) {
        this.dropObject(guid);
      }
    },

    dropObject: function dropObject(objectId) {
      var object = this.sentObjects[objectId];

      if (object.reopen) {
        object.reopen({ willDestroy: object._oldWillDestroy });
        delete object._oldWillDestroy;
      }

      this.removeObservers(objectId);
      delete this.sentObjects[objectId];

      delete this.get('_errorsFor')[objectId];

      this.sendMessage('droppedObject', { objectId: objectId });
    },

    removeObservers: function removeObservers(objectId) {
      var observers = this.boundObservers[objectId];
      var object = this.sentObjects[objectId];

      if (observers) {
        observers.forEach(function (observer) {
          removeObserver(object, observer.property, observer.handler);
        });
      }

      delete this.boundObservers[objectId];
    },

    mixinsForObject: function mixinsForObject(object) {
      var mixins = Mixin.mixins(object);
      var mixinDetails = [];

      var ownProps = propertiesForMixin({ mixins: [{ properties: object }] });
      mixinDetails.push({ name: "Own Properties", properties: ownProps, expand: true });

      mixins.forEach(function (mixin) {
        var name = mixin[Ember.NAME_KEY] || mixin.ownerConstructor;
        if (!name) {
          name = 'Unknown mixin';
        }
        mixinDetails.push({ name: name.toString(), properties: propertiesForMixin(mixin) });
      });

      fixMandatorySetters(mixinDetails);
      applyMixinOverrides(mixinDetails);

      var propertyInfo = null;
      var debugInfo = getDebugInfo(object);
      if (debugInfo) {
        propertyInfo = getDebugInfo(object).propertyInfo;
        mixinDetails = customizeProperties(mixinDetails, propertyInfo);
      }

      var expensiveProperties = null;
      if (propertyInfo) {
        expensiveProperties = propertyInfo.expensiveProperties;
      }

      var objectId = this.retainObject(object);

      var errorsForObject = this.get('_errorsFor')[objectId] = {};
      calculateCPs(object, mixinDetails, errorsForObject, expensiveProperties);

      this.bindProperties(objectId, mixinDetails);

      var errors = errorsToSend(errorsForObject);
      return { objectId: objectId, mixins: mixinDetails, errors: errors };
    },

    valueForObjectProperty: function valueForObjectProperty(objectId, property, mixinIndex) {
      var object = this.sentObjects[objectId],
          value = undefined;

      if (object.isDestroying) {
        value = '<DESTROYED>';
      } else {
        value = calculateCP(object, property, this.get('_errorsFor')[objectId]);
      }

      if (!value || !(value instanceof CalculateCPError)) {
        value = inspectValue(value);
        value.computed = true;

        return {
          objectId: objectId,
          property: property,
          value: value,
          mixinIndex: mixinIndex
        };
      }
    },

    bindPropertyToDebugger: function bindPropertyToDebugger(message) {
      var _this3 = this;

      var objectId = message.objectId;
      var property = message.property;
      var mixinIndex = message.mixinIndex;
      var computed = message.computed;
      var object = this.sentObjects[objectId];

      var handler = function handler() {
        var value = get(object, property);
        value = inspectValue(value);
        value.computed = computed;

        _this3.sendMessage('updateProperty', {
          objectId: objectId,
          property: property,
          value: value,
          mixinIndex: mixinIndex
        });
      };

      addObserver(object, property, handler);
      this.boundObservers[objectId] = this.boundObservers[objectId] || [];
      this.boundObservers[objectId].push({ property: property, handler: handler });
    },

    bindProperties: function bindProperties(objectId, mixinDetails) {
      var _this4 = this;

      mixinDetails.forEach(function (mixin, mixinIndex) {
        mixin.properties.forEach(function (item) {
          if (item.overridden) {
            return true;
          }
          if (item.value.type !== 'type-descriptor' && item.value.type !== 'type-function') {
            var _computed = !!item.value.computed;
            _this4.bindPropertyToDebugger({
              objectId: objectId,
              property: item.name,
              mixinIndex: mixinIndex,
              computed: _computed
            });
          }
        });
      });
    },

    inspect: inspect,
    inspectValue: inspectValue
  });

  function propertiesForMixin(mixin) {
    var properties = [];

    mixin.mixins.forEach(function (mixin) {
      if (mixin.properties) {
        addProperties(properties, mixin.properties);
      }
    });

    return properties;
  }

  function addProperties(properties, hash) {
    for (var prop in hash) {
      if (!hash.hasOwnProperty(prop)) {
        continue;
      }
      if (prop.charAt(0) === '_') {
        continue;
      }

      // remove `fooBinding` type props
      if (prop.match(/Binding$/)) {
        continue;
      }

      // when mandatory setter is removed, an `undefined` value may be set
      if (hash[prop] === undefined) {
        continue;
      }
      var options = { isMandatorySetter: isMandatorySetter(hash, prop) };
      if (isComputed(hash[prop])) {
        options.readOnly = hash[prop]._readOnly;
      }
      replaceProperty(properties, prop, hash[prop], options);
    }
  }

  function replaceProperty(properties, name, value, options) {
    var found = undefined;

    for (var i = 0, l = properties.length; i < l; i++) {
      if (properties[i].name === name) {
        found = i;
        break;
      }
    }

    if (found) {
      properties.splice(i, 1);
    }

    var prop = { name: name, value: inspectValue(value) };
    prop.isMandatorySetter = options.isMandatorySetter;
    prop.readOnly = options.readOnly;
    properties.push(prop);
  }

  function fixMandatorySetters(mixinDetails) {
    var seen = {};
    var propertiesToRemove = [];

    mixinDetails.forEach(function (detail, detailIdx) {
      detail.properties.forEach(function (property) {
        if (property.isMandatorySetter) {
          seen[property.name] = {
            name: property.name,
            value: property.value.inspect,
            detailIdx: detailIdx,
            property: property
          };
        } else if (seen.hasOwnProperty(property.name) && seen[property.name] === property.value.inspect) {
          propertiesToRemove.push(seen[property.name]);
          delete seen[property.name];
        }
      });
    });

    propertiesToRemove.forEach(function (prop) {
      var detail = mixinDetails[prop.detailIdx];
      var index = detail.properties.indexOf(prop.property);
      if (index !== -1) {
        detail.properties.splice(index, 1);
      }
    });
  }

  function applyMixinOverrides(mixinDetails) {
    var seen = {};
    mixinDetails.forEach(function (detail) {
      detail.properties.forEach(function (property) {
        if (Object.prototype.hasOwnProperty(property.name)) {
          return;
        }

        if (seen[property.name]) {
          property.overridden = seen[property.name];
          delete property.value.computed;
        }

        seen[property.name] = detail.name;
      });
    });
  }

  function isMandatorySetter(object, prop) {
    var descriptor = Object.getOwnPropertyDescriptor(object, prop);
    if (descriptor.set && descriptor.set === Ember.MANDATORY_SETTER_FUNCTION) {
      return true;
    }
    return false;
  }

  function calculateCPs(object, mixinDetails, errorsForObject, expensiveProperties) {
    expensiveProperties = expensiveProperties || [];

    mixinDetails.forEach(function (mixin) {
      mixin.properties.forEach(function (item) {
        if (item.overridden) {
          return true;
        }
        if (item.value.computed) {
          var cache = cacheFor(object, item.name);
          if (cache !== undefined || expensiveProperties.indexOf(item.name) === -1) {
            var value = calculateCP(object, item.name, errorsForObject);
            if (!value || !(value instanceof CalculateCPError)) {
              item.value = inspectValue(value);
              item.value.computed = true;
            }
          }
        }
      });
    });
  }

  /**
    Customizes an object's properties
    based on the property `propertyInfo` of
    the object's `_debugInfo` method.
     Possible options:
      - `groups` An array of groups that contains the properties for each group
        For example:
        ```javascript
        groups: [
          { name: 'Attributes', properties: ['firstName', 'lastName'] },
          { name: 'Belongs To', properties: ['country'] }
        ]
        ```
      - `includeOtherProperties` Boolean,
        - `true` to include other non-listed properties,
        - `false` to only include given properties
      - `skipProperties` Array containing list of properties *not* to include
      - `skipMixins` Array containing list of mixins *not* to include
      - `expensiveProperties` An array of computed properties that are too expensive.
         Adding a property to this array makes sure the CP is not calculated automatically.
     Example:
    ```javascript
    {
      propertyInfo: {
        includeOtherProperties: true,
        skipProperties: ['toString', 'send', 'withTransaction'],
        skipMixins: [ 'Ember.Evented'],
        calculate: ['firstName', 'lastName'],
        groups: [
          {
            name: 'Attributes',
            properties: [ 'id', 'firstName', 'lastName' ],
            expand: true // open by default
          },
          {
            name: 'Belongs To',
            properties: [ 'maritalStatus', 'avatar' ],
            expand: true
          },
          {
            name: 'Has Many',
            properties: [ 'phoneNumbers' ],
            expand: true
          },
          {
            name: 'Flags',
            properties: ['isLoaded', 'isLoading', 'isNew', 'isDirty']
          }
        ]
      }
    }
    ```
  */
  function customizeProperties(mixinDetails, propertyInfo) {
    var newMixinDetails = [];
    var neededProperties = {};
    var groups = propertyInfo.groups || [];
    var skipProperties = propertyInfo.skipProperties || [];
    var skipMixins = propertyInfo.skipMixins || [];

    if (groups.length) {
      mixinDetails[0].expand = false;
    }

    groups.forEach(function (group) {
      group.properties.forEach(function (prop) {
        neededProperties[prop] = true;
      });
    });

    mixinDetails.forEach(function (mixin) {
      var newProperties = [];
      mixin.properties.forEach(function (item) {
        if (skipProperties.indexOf(item.name) !== -1) {
          return true;
        }
        if (!item.overridden && neededProperties.hasOwnProperty(item.name) && neededProperties[item.name]) {
          neededProperties[item.name] = item;
        } else {
          newProperties.push(item);
        }
      });
      mixin.properties = newProperties;
      if (skipMixins.indexOf(mixin.name) === -1) {
        newMixinDetails.push(mixin);
      }
    });

    groups.slice().reverse().forEach(function (group) {
      var newMixin = { name: group.name, expand: group.expand, properties: [] };
      group.properties.forEach(function (prop) {
        // make sure it's not `true` which means property wasn't found
        if (neededProperties[prop] !== true) {
          newMixin.properties.push(neededProperties[prop]);
        }
      });
      newMixinDetails.unshift(newMixin);
    });

    return newMixinDetails;
  }

  function getDebugInfo(object) {
    var debugInfo = null;
    if (object._debugInfo && typeof object._debugInfo === 'function') {
      debugInfo = object._debugInfo();
    }
    debugInfo = debugInfo || {};
    var propertyInfo = debugInfo.propertyInfo || (debugInfo.propertyInfo = {});
    var skipProperties = propertyInfo.skipProperties = propertyInfo.skipProperties || (propertyInfo.skipProperties = []);

    skipProperties.push('isDestroyed', 'isDestroying', 'container');
    // 'currentState' and 'state' are un-observable private properties.
    // The rest are skipped to reduce noise in the inspector.
    if (Ember.View && object instanceof Ember.View) {
      skipProperties.push('currentState', 'state', 'buffer', 'outletSource', 'lengthBeforeRender', 'lengthAfterRender', 'template', 'layout', 'templateData', 'domManager', 'states', 'element');
    }

    for (var prop in object) {
      // remove methods
      if (typeof object[prop] === 'function') {
        skipProperties.push(prop);
      }
    }
    return debugInfo;
  }

  function isComputed(value) {
    return value instanceof ComputedProperty;
  }

  function toArray(errors) {
    return keys(errors).map(function (key) {
      return errors[key];
    });
  }

  function calculateCP(object, property, errorsForObject) {
    delete errorsForObject[property];
    try {
      return get(object, property);
    } catch (e) {
      errorsForObject[property] = {
        property: property,
        error: e
      };
      return new CalculateCPError();
    }
  }

  function CalculateCPError() {}

  function errorsToSend(errors) {
    return toArray(errors).map(function (error) {
      return { property: error.property };
    });
  }
});
'use strict';

define('ember-debug/port', ['exports'], function (exports) {

  'use strict';

  var Ember = window.Ember;
  var EmberObject = Ember.Object;
  var computed = Ember.computed;
  var guidFor = Ember.guidFor;
  var run = Ember.run;
  var oneWay = computed.oneWay;

  exports['default'] = EmberObject.extend(Ember.Evented, {
    adapter: oneWay('namespace.adapter').readOnly(),

    application: oneWay('namespace.application').readOnly(),

    uniqueId: computed('application', function () {
      return guidFor(this.get('application')) + '__' + window.location.href + '__' + Date.now();
    }),

    init: function init() {
      var _this = this;

      this.get('adapter').onMessageReceived(function (message) {
        if (_this.get('uniqueId') === message.applicationId || !message.applicationId) {
          _this.messageReceived(message.type, message);
        }
      });
    },

    messageReceived: function messageReceived(name, message) {
      var _this2 = this;

      this.wrap(function () {
        _this2.trigger(name, message);
      });
    },

    send: function send(messageType, options) {
      options.type = messageType;
      options.from = 'inspectedWindow';
      options.applicationId = this.get('uniqueId');
      this.get('adapter').send(options);
    },

    /**
     * Wrap all code triggered from outside of
     * EmberDebug with this method.
     *
     * `wrap` is called by default
     * on all callbacks triggered by `port`,
     * so no need to call it in this case.
     *
     * - Wraps a callback in `Ember.run`.
     * - Catches all errors during production
     * and displays them in a user friendly manner.
     *
     * @method wrap
     * @param {Function} fn
     * @return {Mixed} The return value of the passed function
     */
    wrap: function wrap(fn) {
      return run(this, function () {
        try {
          return fn();
        } catch (error) {
          this.get('adapter').handleError(error);
        }
      });
    }
  });
});
'use strict';

define('ember-debug/promise-debug', ['exports', 'ember-debug/mixins/port-mixin', 'ember-debug/libs/promise-assembler', 'ember-debug/addons/ember-new-computed/index'], function (exports, PortMixin, PromiseAssembler, computedPolyfill) {

  'use strict';

  var Ember = window.Ember;
  var computed = Ember.computed;
  var EmberObject = Ember.Object;
  var RSVP = Ember.RSVP;
  var A = Ember.A;
  var run = Ember.run;
  var oneWay = computed.oneWay;

  exports['default'] = EmberObject.extend(PortMixin['default'], {
    namespace: null,
    port: oneWay('namespace.port').readOnly(),
    objectInspector: oneWay('namespace.objectInspector').readOnly(),
    adapter: oneWay('namespace.adapter').readOnly(),
    portNamespace: 'promise',
    session: oneWay('namespace.session').readOnly(),

    // created on init
    promiseAssembler: null,

    releaseMethods: computed(function () {
      return A();
    }),

    init: function init() {
      this._super();
      if (PromiseAssembler['default'].supported()) {
        this.set('promiseAssembler', PromiseAssembler['default'].create());
        this.get('promiseAssembler').set('promiseDebug', this);
        this.setInstrumentWithStack();
        this.sendInstrumentWithStack();
        this.get('promiseAssembler').start();
      }
    },

    delay: 100,

    willDestroy: function willDestroy() {
      this.releaseAll();
      if (this.get('promiseAssembler')) {
        this.get('promiseAssembler').destroy();
      }
      this.set('promiseAssembler', null);
      this._super();
    },

    messages: {
      getAndObservePromises: function getAndObservePromises() {
        this.getAndObservePromises();
      },

      supported: function supported() {
        this.sendMessage('supported', {
          supported: PromiseAssembler['default'].supported()
        });
      },

      releasePromises: function releasePromises() {
        this.releaseAll();
      },

      sendValueToConsole: function sendValueToConsole(message) {
        var promiseId = message.promiseId;
        var promise = this.get('promiseAssembler').find(promiseId);
        var value = promise.get('value');
        if (value === undefined) {
          value = promise.get('reason');
        }
        this.get('objectInspector').sendValueToConsole(value);
      },

      tracePromise: function tracePromise(message) {
        var id = message.promiseId;
        var promise = this.get('promiseAssembler').find(id);
        // Remove first two lines and add label
        var stack = promise.get('stack');
        if (stack) {
          stack = stack.split("\n");
          stack.splice(0, 2, ['Ember Inspector (Promise Trace): ' + (promise.get('label') || '')]);
          this.get("adapter").log(stack.join("\n"));
        }
      },

      setInstrumentWithStack: function setInstrumentWithStack(message) {
        var bool = message.instrumentWithStack;
        this.set('instrumentWithStack', bool);
        this.setInstrumentWithStack();
      },

      getInstrumentWithStack: function getInstrumentWithStack() {
        this.sendInstrumentWithStack();
      }
    },

    instrumentWithStack: computedPolyfill['default']({
      get: function get() {
        return !!this.get('session').getItem('promise:stack');
      },
      set: function set(key, value) {
        this.get('session').setItem('promise:stack', value);
        return value;
      }
    }).property(),

    sendInstrumentWithStack: function sendInstrumentWithStack() {
      this.sendMessage('instrumentWithStack', {
        instrumentWithStack: this.get('instrumentWithStack')
      });
    },

    setInstrumentWithStack: function setInstrumentWithStack() {
      RSVP.configure('instrument-with-stack', this.get('instrumentWithStack'));
      this.sendInstrumentWithStack();
    },

    releaseAll: function releaseAll() {
      this.get('releaseMethods').forEach(function (fn) {
        fn();
      });
      this.set('releaseMethods', A());
    },

    getAndObservePromises: function getAndObservePromises() {
      var _this = this;

      this.get('promiseAssembler').on('created', this, this.promiseUpdated);
      this.get('promiseAssembler').on('fulfilled', this, this.promiseUpdated);
      this.get('promiseAssembler').on('rejected', this, this.promiseUpdated);
      this.get('promiseAssembler').on('chained', this, this.promiseChained);

      this.get('releaseMethods').pushObject(function () {

        _this.get('promiseAssembler').off('created', _this, _this.promiseUpdated);
        _this.get('promiseAssembler').off('fulfilled', _this, _this.promiseUpdated);
        _this.get('promiseAssembler').off('rejected', _this, _this.promiseUpdated);
        _this.get('promiseAssembler').off('fulfilled', _this, _this.promiseChained);
      });

      this.promisesUpdated(this.get('promiseAssembler').find());
    },

    updatedPromises: computed(function () {
      return A();
    }),

    promisesUpdated: function promisesUpdated(uniquePromises) {
      if (!uniquePromises) {
        uniquePromises = A();
        this.get('updatedPromises').forEach(function (promise) {
          uniquePromises.addObject(promise);
        });
      }
      // Remove inspector-created promises
      uniquePromises = uniquePromises.filter(function (promise) {
        return promise.get('label') !== 'ember-inspector';
      });
      var serialized = this.serializeArray(uniquePromises);
      this.sendMessage('promisesUpdated', {
        promises: serialized
      });
      this.set('updatedPromises', A());
    },

    promiseUpdated: function promiseUpdated(event) {
      this.get('updatedPromises').pushObject(event.promise);
      Ember.run.debounce(this, 'promisesUpdated', this.delay);
    },

    promiseChained: function promiseChained(event) {
      this.get('updatedPromises').pushObject(event.promise);
      this.get('updatedPromises').pushObject(event.child);
      run.debounce(this, 'promisesUpdated', this.delay);
    },

    serializeArray: function serializeArray(promises) {
      var _this2 = this;

      return promises.map(function (item) {
        return _this2.serialize(item);
      });
    },

    serialize: function serialize(promise) {
      var serialized = {};
      serialized.guid = promise.get('guid');
      serialized.state = promise.get('state');
      serialized.label = promise.get('label');
      if (promise.get('children')) {
        serialized.children = this.promiseIds(promise.get('children'));
      }
      serialized.parent = promise.get('parent.guid');
      serialized.value = this.inspectValue(promise.get('value'));
      serialized.reason = this.inspectValue(promise.get('reason'));
      if (promise.get('createdAt')) {
        serialized.createdAt = promise.get('createdAt').getTime();
      }
      if (promise.get('settledAt')) {
        serialized.settledAt = promise.get('settledAt').getTime();
      }
      serialized.hasStack = !!promise.get('stack');
      return serialized;
    },

    promiseIds: function promiseIds(promises) {
      return promises.map(function (promise) {
        return promise.get('guid');
      });
    },

    inspectValue: function inspectValue(value) {
      var objectInspector = this.get('objectInspector');
      var inspected = objectInspector.inspectValue(value);

      if (inspected.type === 'type-ember-object' || inspected.type === "type-array") {
        inspected.objectId = objectInspector.retainObject(value);
        this.get('releaseMethods').pushObject(function () {
          objectInspector.releaseObject(inspected.objectId);
        });
      }
      return inspected;
    }

  });
});
'use strict';

define('ember-debug/render-debug', ['exports', 'ember-debug/mixins/port-mixin', 'ember-debug/models/profile-manager'], function (exports, PortMixin, ProfileManager) {

  'use strict';

  var Ember = window.Ember;
  var oneWay = Ember.computed.oneWay;
  var later = Ember.run.later;
  var subscribe = Ember.subscribe;
  var EmberObject = Ember.Object;

  var profileManager = new ProfileManager['default']();
  var queue = [];

  function push(info) {
    var index = queue.push(info);
    if (index === 1) {
      later(flush, 50);
    }
    return index - 1;
  }

  function flush() {
    var entry = undefined,
        i = undefined;
    for (i = 0; i < queue.length; i++) {
      entry = queue[i];
      if (entry.type === 'began') {
        // If there was an error during rendering `entry.endedIndex` never gets set.
        if (entry.endedIndex) {
          queue[entry.endedIndex].profileNode = profileManager.began(entry.timestamp, entry.payload, entry.now);
        }
      } else {
        profileManager.ended(entry.timestamp, entry.payload, entry.profileNode);
      }
    }
    queue.length = 0;
  }

  subscribe("render", {
    before: function before(name, timestamp, payload) {
      var info = {
        type: 'began',
        timestamp: timestamp,
        payload: payload,
        now: Date.now()
      };
      return push(info);
    },

    after: function after(name, timestamp, payload, beganIndex) {
      var endedInfo = {
        type: 'ended',
        timestamp: timestamp,
        payload: payload
      };

      var index = push(endedInfo);
      queue[beganIndex].endedIndex = index;
    }
  });

  exports['default'] = EmberObject.extend(PortMixin['default'], {
    namespace: null,
    port: oneWay('namespace.port').readOnly(),
    application: oneWay('namespace.application').readOnly(),
    viewDebug: oneWay('namespace.viewDebug').readOnly(),
    portNamespace: 'render',

    profileManager: profileManager,

    init: function init() {
      var _this = this;

      this._super();
      this.profileManager.wrapForErrors = function (context, callback) {
        return _this.get('port').wrap(function () {
          return callback.call(context);
        });
      };
      this._subscribeForViewTrees();
    },

    willDestroy: function willDestroy() {
      this._super();
      this.profileManager.wrapForErrors = function (context, callback) {
        return callback.call(context);
      };
      this.profileManager.offProfilesAdded(this, this.sendAdded);
      this.profileManager.offProfilesAdded(this, this._updateViewTree);
    },

    _subscribeForViewTrees: function _subscribeForViewTrees() {
      this.profileManager.onProfilesAdded(this, this._updateViewTree);
    },

    _updateViewTree: function _updateViewTree(profiles) {
      var viewDurations = {};
      this._flatten(profiles).forEach(function (node) {
        if (node.viewGuid) {
          viewDurations[node.viewGuid] = node.duration;
        }
      });
      this.get('viewDebug').updateDurations(viewDurations);
    },

    _flatten: function _flatten(profiles, array) {
      var _this2 = this;

      array = array || [];
      profiles.forEach(function (profile) {
        array.push(profile);
        _this2._flatten(profile.children, array);
      });
      return array;
    },

    sendAdded: function sendAdded(profiles) {
      this.sendMessage('profilesAdded', { profiles: profiles });
    },

    messages: {
      watchProfiles: function watchProfiles() {
        this.sendMessage('profilesAdded', { profiles: this.profileManager.profiles });
        this.profileManager.onProfilesAdded(this, this.sendAdded);
      },

      releaseProfiles: function releaseProfiles() {
        this.profileManager.offProfilesAdded(this, this.sendAdded);
      },

      clear: function clear() {
        this.profileManager.clearProfiles();
        this.sendMessage('profilesUpdated', { profiles: [] });
      }
    }
  });
});
'use strict';

define('ember-debug/route-debug', ['exports', 'ember-debug/mixins/port-mixin'], function (exports, PortMixin) {

  'use strict';

  var Ember = window.Ember;
  var _Ember$String = Ember.String;
  var classify = _Ember$String.classify;
  var dasherize = _Ember$String.dasherize;
  var computed = Ember.computed;
  var observer = Ember.observer;
  var later = Ember.run.later;
  var EmberObject = Ember.Object;
  var oneWay = computed.oneWay;

  exports['default'] = EmberObject.extend(PortMixin['default'], {
    namespace: null,
    port: oneWay('namespace.port').readOnly(),

    application: oneWay('namespace.application').readOnly(),

    router: computed('application', function () {
      return this.get('application.__container__').lookup('router:main');
    }),

    applicationController: computed('application', function () {
      var container = this.get('application.__container__');
      return container.lookup('controller:application');
    }),

    currentPath: oneWay('applicationController.currentPath').readOnly(),

    portNamespace: 'route',

    emberCliConfig: oneWay('namespace.generalDebug.emberCliConfig').readOnly(),

    messages: {
      getTree: function getTree() {
        this.sendTree();
      },
      getCurrentRoute: function getCurrentRoute() {
        this.sendCurrentRoute();
      }
    },

    sendCurrentRoute: observer('currentPath', function () {
      var _this = this;

      later(function () {
        _this.sendMessage('currentRoute', { name: _this.get('currentPath') });
      }, 50);
    }),

    routeTree: computed('router', function () {
      var routeNames = this.get('router.router.recognizer.names');
      var routeTree = {};

      for (var routeName in routeNames) {
        if (!routeNames.hasOwnProperty(routeName)) {
          continue;
        }
        var route = routeNames[routeName];
        buildSubTree.call(this, routeTree, route);
      }
      return arrayizeChildren({ children: routeTree });
    }),

    sendTree: function sendTree() {
      var routeTree = this.get('routeTree');
      this.sendMessage('routeTree', { tree: routeTree });
    },

    getClassName: function getClassName(name, type) {
      var container = this.get('application.__container__');
      var resolver = container.resolver;
      if (!resolver) {
        resolver = this.get('application.registry.resolver');
      }
      if (!resolver) {
        // Ember >= 2.0
        resolver = container.registry;
      }
      var prefix = this.get('emberCliConfig.modulePrefix');
      var podPrefix = this.get('emberCliConfig.podModulePrefix');
      var usePodsByDefault = this.get('emberCliConfig.usePodsByDefault');
      var className = undefined;
      if (prefix || podPrefix) {
        // Uses modules
        name = dasherize(name);
        var fullName = type + ':' + name;
        className = resolver.describe(fullName);
        if (className === fullName) {
          // full name returned as is - this resolver does not look for the module.
          className = className.replace(new RegExp('^' + type + ':'), '');
        } else if (className) {
          // Module exists and found
          className = className.replace(new RegExp('^/?(' + prefix + '|' + podPrefix + ')/' + type + 's/'), '');
        } else {
          // Module does not exist
          if (usePodsByDefault) {
            // we don't include the prefix since it's redundant
            // and not part of the file path.
            // (podPrefix - prefix) is part of the file path.
            var currentPrefix = '';
            if (podPrefix) {
              currentPrefix = podPrefix.replace(new RegExp('^/?' + prefix + '/?'), '');
            }
            className = currentPrefix + '/' + name + '/' + type;
          } else {
            className = name.replace(/\./g, '/');
          }
        }
        className = className.replace(/\./g, '/');
      } else {
        // No modules
        if (type !== 'template') {
          className = classify(name.replace(/\./g, '_') + '_' + type);
        } else {
          className = name.replace(/\./g, '/');
        }
      }
      return className;
    }

  });

  var buildSubTree = function buildSubTree(routeTree, route) {
    var handlers = route.handlers;
    var container = this.get('application.__container__');
    var subTree = routeTree;
    var item = undefined,
        routeClassName = undefined,
        routeHandler = undefined,
        controllerName = undefined,
        controllerClassName = undefined,
        templateName = undefined,
        controllerFactory = undefined;

    for (var i = 0; i < handlers.length; i++) {
      item = handlers[i];
      var handler = item.handler;
      if (subTree[handler] === undefined) {
        routeClassName = this.getClassName(handler, 'route');

        routeHandler = container.lookup('router:main').router.getHandler(handler);
        controllerName = routeHandler.get('controllerName') || routeHandler.get('routeName');
        controllerFactory = container.lookupFactory('controller:' + controllerName);
        controllerClassName = this.getClassName(controllerName, 'controller');
        templateName = this.getClassName(handler, 'template');

        subTree[handler] = {
          value: {
            name: handler,
            routeHandler: {
              className: routeClassName,
              name: handler
            },
            controller: {
              className: controllerClassName,
              name: controllerName,
              exists: controllerFactory ? true : false
            },
            template: {
              name: templateName
            }
          }
        };

        if (i === handlers.length - 1) {
          // it is a route, get url
          subTree[handler].value.url = getURL(container, route.segments);
          subTree[handler].value.type = 'route';
        } else {
          // it is a resource, set children object
          subTree[handler].children = {};
          subTree[handler].value.type = 'resource';
        }
      }
      subTree = subTree[handler].children;
    }
  };

  function arrayizeChildren(routeTree) {
    var obj = {};
    // Top node doesn't have a value
    if (routeTree.value) {
      obj.value = routeTree.value;
    }

    if (routeTree.children) {
      var childrenArray = [];
      for (var i in routeTree.children) {
        var route = routeTree.children[i];
        childrenArray.push(arrayizeChildren(route));
      }
      obj.children = childrenArray;
    }

    return obj;
  }

  function getURL(container, segments) {
    var locationImplementation = container.lookup('router:main').location;
    var url = [];
    for (var i = 0; i < segments.length; i++) {
      var _name = null;

      try {
        _name = segments[i].generate();
      } catch (e) {
        // is dynamic
        _name = ':' + segments[i].name;
      }
      if (_name) {
        url.push(_name);
      }
    }

    url = url.join('/');

    if (url.match(/_unused_dummy_/)) {
      url = '';
    } else {
      url = '/' + url;
      url = locationImplementation.formatURL(url);
    }

    return url;
  }
});
'use strict';

define('ember-debug/services/session', ['exports'], function (exports) {

  'use strict';

  var Ember = window.Ember;
  var EmberObject = Ember.Object;

  var Session = EmberObject.extend({
    setItem: function setItem() /*key, val*/{},
    removeItem: function removeItem() /*key*/{},
    getItem: function getItem() /*key*/{}
  });

  // Feature detection
  if (typeof sessionStorage !== 'undefined') {
    Session.reopen({
      sessionStorage: sessionStorage,
      prefix: '__ember__inspector__',
      makeKey: function makeKey(key) {
        return this.prefix + key;
      },
      setItem: function setItem(key, val) {
        return this.sessionStorage.setItem(this.makeKey(key), val);
      },
      removeItem: function removeItem(key) {
        return this.sessionStorage.removeItem(this.makeKey(key));
      },
      getItem: function getItem(key) {
        return JSON.parse(this.sessionStorage.getItem(this.makeKey(key)));
      }
    });
  }

  exports['default'] = Session;
});
'use strict';

define('ember-debug/view-debug', ['exports', 'ember-debug/mixins/port-mixin'], function (exports, PortMixin) {

  'use strict';

  /* eslint no-cond-assign:0 */
  var Ember = window.Ember;
  var guidFor = Ember.guidFor;
  var $ = Ember.$;
  var computed = Ember.computed;
  var run = Ember.run;
  var EmberObject = Ember.Object;
  var View = Ember.View;
  var typeOf = Ember.typeOf;
  var Component = Ember.Component;
  var ViewUtils = Ember.ViewUtils;
  var A = Ember.A;
  var later = run.later;
  var oneWay = computed.oneWay;

  var keys = Object.keys || Ember.keys;

  var layerDiv = undefined,
      previewDiv = undefined,
      highlightedElement = undefined;

  exports['default'] = EmberObject.extend(PortMixin['default'], {

    namespace: null,

    application: oneWay('namespace.application').readOnly(),
    adapter: oneWay('namespace.adapter').readOnly(),
    port: oneWay('namespace.port').readOnly(),
    objectInspector: oneWay('namespace.objectInspector').readOnly(),

    retainedObjects: [],

    _durations: {},

    options: {},

    portNamespace: 'view',

    messages: {
      getTree: function getTree() {
        this.sendTree();
      },
      hideLayer: function hideLayer() {
        this.hideLayer();
      },
      showLayer: function showLayer(message) {
        // >= Ember 1.13
        if (message.renderNodeId !== undefined) {
          this._highlightNode(this.get('_lastNodes').objectAt(message.renderNodeId), false);
        } else {
          // < Ember 1.13
          this.showLayer(message.objectId);
        }
      },
      previewLayer: function previewLayer(message) {
        // >= Ember 1.13
        if (message.renderNodeId !== undefined) {
          this._highlightNode(this.get('_lastNodes').objectAt(message.renderNodeId), true);
        } else {
          // < Ember 1.13
          this.previewLayer(message.objectId);
        }
      },
      hidePreview: function hidePreview() {
        this.hidePreview();
      },
      inspectViews: function inspectViews(message) {
        if (message.inspect) {
          this.startInspecting();
        } else {
          this.stopInspecting();
        }
      },
      inspectElement: function inspectElement(message) {
        this.inspectElement(message.objectId);
      },
      setOptions: function setOptions(message) {
        this.set('options', message.options);
        this.sendTree();
      },
      sendModelToConsole: function sendModelToConsole(message) {
        var model = undefined;
        if (message.renderNodeId) {
          // >= Ember 1.13
          var renderNode = this.get('_lastNodes').objectAt(message.renderNodeId);
          model = this._modelForNode(renderNode);
        } else {
          // < Ember 1.13
          var view = this.get('objectInspector').sentObjects[message.viewId];
          model = this.modelForView(view);
        }
        if (model) {
          this.get('objectInspector').sendValueToConsole(model);
        }
      }
    },

    init: function init() {
      var _this = this;

      this._super();

      this.viewListener();
      this.retainedObjects = [];
      this.options = {};

      layerDiv = $('<div>').appendTo('body').get(0);
      layerDiv.style.display = 'none';
      layerDiv.setAttribute('data-label', 'layer-div');

      previewDiv = $('<div>').appendTo('body').css('pointer-events', 'none').get(0);
      previewDiv.style.display = 'none';
      previewDiv.setAttribute('data-label', 'preview-div');

      $(window).on('resize.' + this.get('eventNamespace'), function () {
        if (highlightedElement) {
          _this.highlightView(highlightedElement);
        }
      });
    },

    updateDurations: function updateDurations(durations) {
      for (var guid in durations) {
        if (!durations.hasOwnProperty(guid)) {
          continue;
        }
        this._durations[guid] = durations[guid];
      }
      this.sendTree();
    },

    retainObject: function retainObject(object) {
      this.retainedObjects.push(object);
      return this.get('objectInspector').retainObject(object);
    },

    releaseCurrentObjects: function releaseCurrentObjects() {
      var _this2 = this;

      this.retainedObjects.forEach(function (item) {
        _this2.get('objectInspector').releaseObject(guidFor(item));
      });
      this.retainedObjects = [];
    },

    eventNamespace: computed(function () {
      return 'view_debug_' + guidFor(this);
    }),

    willDestroy: function willDestroy() {
      this._super();
      $(window).off(this.get('eventNamespace'));
      $(layerDiv).remove();
      $(previewDiv).remove();
      this.get('_lastNodes').clear();
      this.releaseCurrentObjects();
      this.stopInspecting();
    },

    inspectElement: function inspectElement(objectId) {
      var view = this.get('objectInspector').sentObjects[objectId];
      if (view && view.get('element')) {
        this.get('adapter').inspectElement(view.get('element'));
      }
    },

    sendTree: function sendTree() {
      run.scheduleOnce('afterRender', this, this.scheduledSendTree);
    },

    startInspecting: function startInspecting() {
      var _this3 = this;

      var viewElem = null;
      this.sendMessage('startInspecting', {});

      // we don't want the preview div to intercept the mousemove event
      $(previewDiv).css('pointer-events', 'none');

      $('body').on('mousemove.inspect-' + this.get('eventNamespace'), function (e) {
        var originalTarget = $(e.target);
        viewElem = _this3.findNearestView(originalTarget);
        if (viewElem) {
          _this3.highlightView(viewElem, true);
        }
      }).on('mousedown.inspect-' + this.get('eventNamespace'), function () {
        // prevent app-defined clicks from being fired
        $(previewDiv).css('pointer-events', '').one('mouseup', function () {
          // chrome
          return pinView();
        });
      }).on('mouseup.inspect-' + this.get('eventNamespace'), function () {
        // firefox
        return pinView();
      }).css('cursor', '-webkit-zoom-in');

      var pinView = function pinView() {
        if (viewElem) {
          _this3.highlightView(viewElem);
          var view = _this3.get('objectInspector').sentObjects[viewElem.id];
          if (view instanceof Ember.Component) {
            _this3.get('objectInspector').sendObject(view);
          }
        }
        _this3.stopInspecting();
        return false;
      };
    },

    findNearestView: function findNearestView(elem) {
      var viewElem = undefined,
          view = undefined;
      if (!elem || elem.length === 0) {
        return null;
      }
      if (elem.hasClass('ember-view')) {
        viewElem = elem.get(0);
        view = this.get('objectInspector').sentObjects[viewElem.id];
        if (view && this.shouldShowView(view)) {
          return viewElem;
        }
      }
      return this.findNearestView($(elem).parents('.ember-view:first'));
    },

    stopInspecting: function stopInspecting() {
      $('body').off('mousemove.inspect-' + this.get('eventNamespace')).off('mousedown.inspect-' + this.get('eventNamespace')).off('mouseup.inspect-' + this.get('eventNamespace')).off('click.inspect-' + this.get('eventNamespace')).css('cursor', '');

      this.hidePreview();
      this.sendMessage('stopInspecting', {});
    },

    scheduledSendTree: function scheduledSendTree() {
      var _this4 = this;

      // Send out of band
      later(function () {
        if (_this4.isDestroying) {
          return;
        }
        _this4.releaseCurrentObjects();
        var tree = _this4.viewTree();
        if (tree) {
          _this4.sendMessage('viewTree', {
            tree: tree
          });
        }
      }, 50);
    },

    viewListener: function viewListener() {
      var _this5 = this;

      this.viewTreeChanged = function () {
        _this5.sendTree();
        _this5.hideLayer();
      };
    },

    viewTree: function viewTree() {
      var tree = undefined;
      var emberApp = this.get('application');
      if (!emberApp) {
        return false;
      }

      var applicationViewId = $(emberApp.rootElement).find('> .ember-view').attr('id');
      var rootView = this.get('viewRegistry')[applicationViewId];
      // In case of App.reset view is destroyed
      if (!rootView) {
        return false;
      }

      var children = [];

      if (!this._isGlimmer()) {
        // before Glimmer
        var retained = [];
        var treeId = this.retainObject(retained);
        tree = { value: this.inspectView(rootView, retained), children: children, treeId: treeId };
        this.appendChildren(rootView, children, retained);
      } else {
        this.get('_lastNodes').clear();
        var renderNode = rootView._renderNode;
        tree = { value: this._inspectNode(renderNode), children: children };
        this._appendNodeChildren(renderNode, children);
      }

      return tree;
    },

    modelForView: function modelForView(view) {
      var controller = view.get('controller');
      var model = controller.get('model');
      if (view.get('context') !== controller) {
        model = view.get('context');
      }
      return model;
    },

    inspectView: function inspectView(view, retained) {
      var templateName = view.get('templateName') || view.get('_debugTemplateName');
      var viewClass = shortViewName(view);
      var name = undefined;

      var tagName = view.get('tagName');
      if (tagName === '') {
        tagName = '(virtual)';
      }

      tagName = tagName || 'div';

      var controller = view.get('controller');

      name = viewDescription(view);

      var viewId = this.retainObject(view);
      retained.push(viewId);

      var timeToRender = this._durations[viewId];

      var value = {
        viewClass: viewClass,
        completeViewClass: viewName(view),
        objectId: viewId,
        duration: timeToRender,
        name: name,
        template: templateName || '(inline)',
        tagName: tagName,
        isVirtual: view.get('isVirtual'),
        isComponent: view instanceof Component
      };

      if (controller && !(view instanceof Component)) {
        value.controller = {
          name: shortControllerName(controller),
          completeName: controllerName(controller),
          objectId: this.retainObject(controller)
        };

        var model = this.modelForView(view);
        if (model) {
          if (EmberObject.detectInstance(model) || typeOf(model) === 'array') {
            value.model = {
              name: shortModelName(model),
              completeName: getModelName(model),
              objectId: this.retainObject(model),
              type: 'type-ember-object'
            };
          } else {
            value.model = {
              name: this.get('objectInspector').inspect(model),
              type: 'type-' + Ember.typeOf(model)
            };
          }
        }
      }

      return value;
    },

    appendChildren: function appendChildren(view, children, retained) {
      var _this6 = this;

      var childViews = view.get('_childViews');

      childViews.forEach(function (childView) {
        if (!(childView instanceof EmberObject)) {
          return;
        }

        if (_this6.shouldShowView(childView)) {
          var grandChildren = [];
          children.push({ value: _this6.inspectView(childView, retained), children: grandChildren });
          _this6.appendChildren(childView, grandChildren, retained);
        } else {
          _this6.appendChildren(childView, children, retained);
        }
      });
    },

    shouldShowView: function shouldShowView(view) {
      return (this.options.allViews || this.hasOwnController(view) || this.hasOwnContext(view)) && (this.options.components || !(view instanceof Component)) && (!view.get('isVirtual') || this.hasOwnController(view) || this.hasOwnContext(view));
    },

    hasOwnController: function hasOwnController(view) {
      return view.get('controller') !== view.get('_parentView.controller') && (view instanceof Component || !(view.get('_parentView.controller') instanceof Component));
    },

    hasOwnContext: function hasOwnContext(view) {
      // Context switching is deprecated, we will need to find a better way for {{#each}} helpers.
      return view.get('context') !== view.get('_parentView.context') &&
      // make sure not a view inside a component, like `{{yield}}` for example.
      !(view.get('_parentView.context') instanceof Component);
    },

    highlightView: function highlightView(element, isPreview) {
      var range = undefined,
          view = undefined,
          rect = undefined;

      if (!isPreview) {
        highlightedElement = element;
      }

      if (!element) {
        return;
      }

      if (View && element instanceof View || element instanceof Component) {
        view = element;
      } else {
        view = this.get('viewRegistry')[element.id];
      }

      var getViewBoundingClientRect = ViewUtils.getViewBoundingClientRect;
      if (getViewBoundingClientRect) {
        // Ember >= 1.9 support `getViewBoundingClientRect`
        rect = getViewBoundingClientRect(view);
      } else {
        // Support old Ember versions
        if (view.get('isVirtual')) {
          range = virtualRange(view);
          rect = range.getBoundingClientRect();
        } else {
          element = view.get('element');
          if (!element) {
            return;
          }
          rect = element.getBoundingClientRect();
        }
      }

      var templateName = view.get('templateName') || view.get('_debugTemplateName');
      var controller = view.get('controller');
      var model = controller && controller.get('model');
      var modelName = undefined;

      var options = {
        isPreview: isPreview,
        view: {
          name: viewName(view),
          object: view
        }
      };

      if (controller) {
        options.controller = {
          name: controllerName(controller),
          object: controller
        };
      }

      if (templateName) {
        options.template = {
          name: templateName
        };
      }

      if (model) {
        modelName = this.get('objectInspector').inspect(model);
        options.model = {
          name: modelName,
          object: model
        };
      }

      this._highlightRange(rect, options);
    },

    // TODO: This method needs a serious refactor/cleanup
    _highlightRange: function _highlightRange(rect, options) {
      var _this7 = this;

      var div = undefined;
      var isPreview = options.isPreview;

      // take into account the scrolling position as mentioned in docs
      // https://developer.mozilla.org/en-US/docs/Web/API/element.getBoundingClientRect
      rect = $.extend({}, rect);
      rect.top = rect.top + window.scrollY;
      rect.left = rect.left + window.scrollX;

      if (isPreview) {
        div = previewDiv;
      } else {
        this.hideLayer();
        div = layerDiv;
        this.hidePreview();
      }

      $(div).css(rect);
      $(div).css({
        display: "block",
        position: "absolute",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        border: "2px solid rgb(102, 102, 102)",
        padding: "0",
        right: "auto",
        direction: "ltr",
        boxSizing: "border-box",
        color: "rgb(51, 51, 255)",
        fontFamily: "Menlo, sans-serif",
        minHeight: 63,
        zIndex: 10000
      });

      var output = "";

      if (!isPreview) {
        output = "<span class='close' data-label='layer-close'>&times;</span>";
      }

      var template = options.template;

      if (template) {
        output += "<p class='template'><span>template</span>=<span data-label='layer-template'>" + escapeHTML(template.name) + "</span></p>";
      }
      var view = options.view;
      var controller = options.controller;
      if (!view || !(view.object instanceof Ember.Component)) {
        if (controller) {
          output += "<p class='controller'><span>controller</span>=<span data-label='layer-controller'>" + escapeHTML(controller.name) + "</span></p>";
        }
        if (view) {
          output += "<p class='view'><span>view</span>=<span data-label='layer-view'>" + escapeHTML(view.name) + "</span></p>";
        }
      } else {
        output += "<p class='component'><span>component</span>=<span data-label='layer-component'>" + escapeHTML(view.name) + "</span></p>";
      }

      var model = options.model;
      if (model) {
        output += "<p class='model'><span>model</span>=<span data-label='layer-model'>" + escapeHTML(model.name) + "</span></p>";
      }

      $(div).html(output);

      $('p', div).css({ float: 'left', margin: 0, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '5px', color: 'rgb(0, 0, 153)' });
      $('p.model', div).css({ clear: 'left' });
      $('p span:first-child', div).css({ color: 'rgb(153, 153, 0)' });
      $('p span:last-child', div).css({ color: 'rgb(153, 0, 153)' });

      if (!isPreview) {
        $('span.close', div).css({
          float: 'right',
          margin: '5px',
          background: '#666',
          color: '#eee',
          fontFamily: 'helvetica, sans-serif',
          fontSize: '12px',
          width: 16,
          height: 16,
          lineHeight: '14px',
          borderRadius: 16,
          textAlign: 'center',
          cursor: 'pointer'
        }).on('click', function () {
          _this7.hideLayer();
          return false;
        }).on('mouseup mousedown', function () {
          // prevent re-pinning
          return false;
        });
      }

      $('p.view span:last-child', div).css({ cursor: 'pointer' }).click(function () {
        _this7.get('objectInspector').sendObject(view.object);
      });

      $('p.controller span:last-child', div).css({ cursor: 'pointer' }).click(function () {
        _this7.get('objectInspector').sendObject(controller.object);
      });

      $('p.component span:last-child', div).css({ cursor: 'pointer' }).click(function () {
        _this7.get('objectInspector').sendObject(view.object);
      });

      $('p.template span:last-child', div).css({ cursor: 'pointer' }).click(function () {
        _this7.inspectElement(guidFor(view.object));
      });

      if (model && model.object && (model.object instanceof EmberObject || typeOf(model.object) === 'array')) {
        $('p.model span:last-child', div).css({ cursor: 'pointer' }).click(function () {
          _this7.get('objectInspector').sendObject(model.object);
        });
      }
    },

    showLayer: function showLayer(objectId) {
      this.highlightView(this.get('objectInspector').sentObjects[objectId]);
    },

    previewLayer: function previewLayer(objectId) {
      this.highlightView(this.get('objectInspector').sentObjects[objectId], true);
    },

    hideLayer: function hideLayer() {
      layerDiv.style.display = 'none';
      highlightedElement = null;
    },

    hidePreview: function hidePreview() {
      previewDiv.style.display = 'none';
    },

    /**
     * List of render nodes from the last
     * sent view tree.
     *
     * @property lastNodes
     * @type {Array}
     */
    _lastNodes: computed(function () {
      return A([]);
    }),

    /**
     * @method isGlimmer
     * @return {Boolean}
     */
    _isGlimmer: function _isGlimmer() {
      var id = keys(this.get('viewRegistry'))[0];
      return id && !this.get('viewRegistry')[id].get('_childViews');
    },

    viewRegistry: computed('application', function () {
      return this.get('application.__container__').lookup('-view-registry:main') || View.views;
    }),

    /**
     * Walk the render node hierarchy and build the tree.
     *
     * @param  {Object} renderNode
     * @param  {Array} children
     */
    _appendNodeChildren: function _appendNodeChildren(renderNode, children) {
      var _this8 = this;

      var childNodes = this._childrenForNode(renderNode);
      if (!childNodes) {
        return;
      }
      childNodes.forEach(function (childNode) {
        if (_this8._shouldShowNode(childNode, renderNode)) {
          var grandChildren = [];
          children.push({ value: _this8._inspectNode(childNode), children: grandChildren });
          _this8._appendNodeChildren(childNode, grandChildren);
        } else {
          _this8._appendNodeChildren(childNode, children);
        }
      });
    },

    /**
     * Gather the children assigned to the render node.
     *
     * @param  {Object} renderNode
     * @return {Array} children
     */
    _childrenForNode: function _childrenForNode(renderNode) {
      if (renderNode.morphMap) {
        return keys(renderNode.morphMap).map(function (key) {
          return renderNode.morphMap[key];
        }).filter(function (node) {
          return !!node;
        });
      } else {
        return renderNode.childNodes;
      }
    },

    /**
     * Whether a render node is elligible to be included
     * in the tree.
     * Depends on whether the node is actually a view node
     * (as opposed to an attribute node for example),
     * and also checks the filtering options. For example,
     * showing Ember component nodes can be toggled.
     *
     * @param  {Object} renderNode
     * @param  {Object} parentNode
     * @return {Boolean} `true` for show and `false` to skip the node
     */
    _shouldShowNode: function _shouldShowNode(renderNode, parentNode) {

      // Filter out non-(view/components)
      if (!this._nodeIsView(renderNode)) {
        return false;
      }
      // Has either a template or a view/component instance
      if (!this._nodeTemplateName(renderNode) && !this._nodeHasViewInstance(renderNode)) {
        return false;
      }
      return (this.options.allViews || this._nodeHasOwnController(renderNode, parentNode)) && (this.options.components || !this._nodeIsEmberComponent(renderNode)) && (this._nodeHasViewInstance(renderNode) || this._nodeHasOwnController(renderNode, parentNode));
    },

    /**
     * The node's model. If the view has a controller,
     * it will be the controller's `model` property.s
     *
     * @param  {Object} renderNode
     * @return {Object} the model
     */
    _modelForNode: function _modelForNode(renderNode) {
      var controller = this._controllerForNode(renderNode);
      if (controller) {
        return controller.get('model');
      }
    },

    /**
     * Not all nodes are actually views/components.
     * Nodes can be attributes for example.
     *
     * @param  {Object} renderNode
     * @return {Boolean}
     */
    _nodeIsView: function _nodeIsView(renderNode) {
      if (renderNode.getState) {
        return !!renderNode.getState().manager;
      } else {
        return !!renderNode.state.manager;
      }
    },

    /**
     * Check if a node has its own controller (as opposed to sharing
     * its parent's controller).
     * Useful to identify route views from other views.
     *
     * @param  {Object} renderNode
     * @param  {Object} parentNode
     * @return {Boolean}
     */
    _nodeHasOwnController: function _nodeHasOwnController(renderNode, parentNode) {
      return this._controllerForNode(renderNode) !== this._controllerForNode(parentNode);
    },

    /**
     * Check if the node has a view instance.
     * Virtual nodes don't have a view/component instance.
     *
     * @param  {Object} renderNode
     * @return {Boolean}
     */
    _nodeHasViewInstance: function _nodeHasViewInstance(renderNode) {
      return !!this._viewInstanceForNode(renderNode);
    },

    /**
     * Returns the nodes' controller.
     *
     * @param  {Object} renderNode
     * @return {Ember.Controller}
     */
    _controllerForNode: function _controllerForNode(renderNode) {
      if (renderNode.lastResult) {
        var scope = renderNode.lastResult.scope;
        var controller = undefined;
        if (scope.getLocal) {
          controller = scope.getLocal('controller');
        } else {
          controller = scope.locals.controller.value();
        }
        if (!controller && scope.getSelf) {
          // Ember >= 2.2 + no ember-legacy-controllers addon
          controller = scope.getSelf().value();
        }
        return controller;
      }
    },

    /**
     * Inspect a node. This will return an object with all
     * the required properties to be added to the view tree
     * to be sent.
     *
     * @param  {Object} renderNode
     * @return {Object} the object containing the required values
     */
    _inspectNode: function _inspectNode(renderNode) {
      var name = undefined,
          viewClassName = undefined,
          completeViewClassName = undefined,
          tagName = undefined,
          viewId = undefined,
          timeToRender = undefined;

      var viewClass = this._viewInstanceForNode(renderNode);

      if (viewClass) {
        viewClassName = shortViewName(viewClass);
        completeViewClassName = viewName(viewClass);
        tagName = viewClass.get('tagName') || 'div';
        viewId = this.retainObject(viewClass);
        timeToRender = this._durations[viewId];
      }

      name = this._nodeDescription(renderNode);

      var value = {
        template: this._nodeTemplateName(renderNode) || '(inline)',
        name: name,
        objectId: viewId,
        viewClass: viewClassName,
        duration: timeToRender,
        completeViewClass: completeViewClassName,
        isComponent: this._nodeIsEmberComponent(renderNode),
        tagName: tagName,
        isVirtual: !viewClass
      };

      var controller = this._controllerForNode(renderNode);
      if (controller && !this._nodeIsEmberComponent(renderNode)) {
        value.controller = {
          name: shortControllerName(controller),
          completeName: controllerName(controller),
          objectId: this.retainObject(controller)
        };

        var model = this._modelForNode(renderNode);
        if (model) {
          if (EmberObject.detectInstance(model) || Ember.typeOf(model) === 'array') {
            value.model = {
              name: shortModelName(model),
              completeName: getModelName(model),
              objectId: this.retainObject(model),
              type: 'type-ember-object'
            };
          } else {
            value.model = {
              name: this.get('objectInspector').inspect(model),
              type: 'type-' + Ember.typeOf(model)
            };
          }
        }
      }

      value.renderNodeId = this.get('_lastNodes').push(renderNode) - 1;

      return value;
    },

    /**
     * Get the node's template name. Relies on an htmlbars
     * feature that adds the module name as a meta property
     * to compiled templates.
     *
     * @param  {Object} renderNode
     * @return {String} the template name
     */
    _nodeTemplateName: function _nodeTemplateName(renderNode) {
      var template = renderNode.lastResult && renderNode.lastResult.template;
      if (template && template.meta && template.meta.moduleName) {
        return template.meta.moduleName.replace(/\.hbs$/, '');
      }
    },

    /**
     * The node's name. Should be anything that the user
     * can use to identity what node we are talking about.
     *
     * Usually either the view instance name, or the template name.
     *
     * @param  {Object} renderNode
     * @return {String}
     */
    _nodeDescription: function _nodeDescription(renderNode) {
      var name = undefined;

      var viewClass = this._viewInstanceForNode(renderNode);

      if (viewClass) {
        //. Has a view instance - take the view's name
        name = viewClass.get('_debugContainerKey');
        if (name) {
          name = name.replace(/.*(view|component):/, '').replace(/:$/, '');
        }
      } else {
        // Virtual - no view instance
        var templateName = this._nodeTemplateName(renderNode);
        if (templateName) {
          return templateName.replace(/^.*templates\//, '').replace(/\//g, '.');
        }
      }

      // If application view was not defined, it uses a `toplevel` view
      if (name === 'toplevel') {
        name = 'application';
      }
      return name;
    },

    /**
     * Return a node's view instance.
     *
     * @param  {Object} renderNode
     * @return {Ember.View|Ember.Component} The view or component instance
     */
    _viewInstanceForNode: function _viewInstanceForNode(renderNode) {
      return renderNode.emberView;
    },

    /**
     * Returns whether the node is an Ember Component or not.
     *
     * @param  {Object} renderNode
     * @return {Boolean}
     */
    _nodeIsEmberComponent: function _nodeIsEmberComponent(renderNode) {
      var viewInstance = this._viewInstanceForNode(renderNode);
      return !!(viewInstance && viewInstance instanceof Ember.Component);
    },

    /**
     * Highlight a render node on the screen.
     *
     * @param  {Object} renderNode
     * @param  {Boolean} isPreview (whether to pin the layer or not)
     */
    _highlightNode: function _highlightNode(renderNode, isPreview) {
      var modelName = undefined;
      // Todo: should be in Ember core
      var range = document.createRange();
      range.setStartBefore(renderNode.firstNode);
      range.setEndAfter(renderNode.lastNode);
      var rect = range.getBoundingClientRect();

      var options = {
        isPreview: isPreview
      };

      var controller = this._controllerForNode(renderNode);
      if (controller) {
        options.controller = {
          name: controllerName(controller),
          object: controller
        };
      }

      var templateName = this._nodeTemplateName(renderNode);
      if (templateName) {
        options.template = {
          name: templateName
        };
      }

      var model = undefined;
      if (controller) {
        model = controller.get('model');
      }
      if (model) {
        modelName = this.get('objectInspector').inspect(model);
        options.model = {
          name: modelName,
          object: model
        };
      }

      var view = this._viewInstanceForNode(renderNode);

      if (view) {
        options.view = {
          name: viewName(view),
          object: view
        };
      }

      this._highlightRange(rect, options);
    }
  });

  function viewName(view) {
    var name = view.constructor.toString(),
        match = undefined;
    if (name.match(/\._/)) {
      name = "virtual";
    } else if (match = name.match(/\(subclass of (.*)\)/)) {
      name = match[1];
    }
    return name;
  }

  function shortViewName(view) {
    var name = viewName(view);
    // jj-abrams-resolver adds `app@view:` and `app@component:`
    // Also `_debugContainerKey` has the format `type-key:factory-name`
    return name.replace(/.*(view|component):(?!$)/, '').replace(/:$/, '');
  }

  function getModelName(model) {
    var name = '<Unknown model>';
    if (model.toString) {
      name = model.toString();
    }

    if (name.length > 50) {
      name = name.substr(0, 50) + '...';
    }
    return name;
  }

  function shortModelName(model) {
    var name = getModelName(model);
    // jj-abrams-resolver adds `app@model:`
    return name.replace(/<[^>]+@model:/g, '<');
  }

  function controllerName(controller) {
    var className = controller.constructor.toString(),
        match = undefined;

    if (match = className.match(/^\(subclass of (.*)\)/)) {
      className = match[1];
    }

    return className;
  }

  function shortControllerName(controller) {
    var name = controllerName(controller);
    // jj-abrams-resolver adds `app@controller:` at the begining and `:` at the end
    return name.replace(/^.+@controller:/, '').replace(/:$/, '');
  }

  function escapeHTML(string) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(string));
    return div.innerHTML;
  }

  function virtualRange(view) {
    var start = undefined,
        end = undefined;
    var morph = view.get('morph');

    if (morph) {
      start = $('#' + morph.start)[0];
      end = $('#' + morph.end)[0];
    } else {
      // Support for metal-views
      morph = view.get('_morph');
      start = morph.start;
      end = morph.end;
    }

    var range = document.createRange();
    range.setStartAfter(start);
    range.setEndBefore(end);

    return range;
  }

  function viewDescription(view) {
    var templateName = view.get('templateName') || view.get('_debugTemplateName');
    var name = undefined,
        parentClassName = undefined;
    var viewClass = shortViewName(view);
    var controller = view.get('controller');

    if (templateName) {
      name = templateName;
    } else if (view instanceof Ember.LinkView) {
      name = 'link';
    } else if (view.get('_parentView.controller') === controller || view instanceof Ember.Component) {
      var viewClassName = view.get('_debugContainerKey');
      if (viewClassName) {
        viewClassName = viewClassName.match(/\:(.*)/);
        if (viewClassName) {
          viewClassName = viewClassName[1];
        }
      }
      if (!viewClassName && viewClass) {
        viewClassName = viewClass.match(/\.(.*)/);
        if (viewClassName) {
          viewClassName = viewClassName[1];
        } else {
          viewClassName = viewClass;
        }

        var shortName = viewClassName.match(/(.*)(View|Component)$/);
        if (shortName) {
          viewClassName = shortName[1];
        }
      }
      if (viewClassName) {
        name = Ember.String.camelize(viewClassName);
      }
    } else if (view.get('_parentView.controller') !== controller) {
      var key = controller.get('_debugContainerKey');
      var className = controller.constructor.toString();

      if (key) {
        name = key.split(':')[1];
      } else {
        if (parentClassName = className.match(/^\(subclass of (.*)\)/)) {
          className = parentClassName[1];
        }
        name = className.split('.').pop();
        name = Ember.String.camelize(name);
      }
    }

    if (!name) {
      name = '(inline view)';
    }
    return name;
  }
});
(function() {
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Define a module along with a payload.
 * @param {string} moduleName Name for the payload
 * @param {ignored} deps Ignored. For compatibility with CommonJS AMD Spec
 * @param {function} payload Function with (require, exports, module) params
 */
function define(moduleName, deps, payload) {
  if (typeof moduleName != "string") {
    throw new TypeError('Expected string, got: ' + moduleName);
  }

  if (arguments.length == 2) {
    payload = deps;
  }

  if (moduleName in define.modules) {
    throw new Error("Module already defined: " + moduleName);
  }
  define.modules[moduleName] = payload;
};

/**
 * The global store of un-instantiated modules
 */
define.modules = {};


/**
 * We invoke require() in the context of a Domain so we can have multiple
 * sets of modules running separate from each other.
 * This contrasts with JSMs which are singletons, Domains allows us to
 * optionally load a CommonJS module twice with separate data each time.
 * Perhaps you want 2 command lines with a different set of commands in each,
 * for example.
 */
function Domain() {
  this.modules = {};
  this._currentModule = null;
}

(function () {

  /**
   * Lookup module names and resolve them by calling the definition function if
   * needed.
   * There are 2 ways to call this, either with an array of dependencies and a
   * callback to call when the dependencies are found (which can happen
   * asynchronously in an in-page context) or with a single string an no callback
   * where the dependency is resolved synchronously and returned.
   * The API is designed to be compatible with the CommonJS AMD spec and
   * RequireJS.
   * @param {string[]|string} deps A name, or names for the payload
   * @param {function|undefined} callback Function to call when the dependencies
   * are resolved
   * @return {undefined|object} The module required or undefined for
   * array/callback method
   */
  Domain.prototype.require = function(deps, callback) {
    if (Array.isArray(deps)) {
      var params = deps.map(function(dep) {
        return this.lookup(dep);
      }, this);
      if (callback) {
        callback.apply(null, params);
      }
      return undefined;
    }
    else {
      return this.lookup(deps);
    }
  };

  function normalize(path) {
    var bits = path.split('/');
    var i = 1;
    while (i < bits.length) {
      if (bits[i] === '..') {
        bits.splice(i-1, 1);
      } else if (bits[i] === '.') {
        bits.splice(i, 1);
      } else {
        i++;
      }
    }
    return bits.join('/');
  }

  function join(a, b) {
    a = a.trim();
    b = b.trim();
    if (/^\//.test(b)) {
      return b;
    } else {
      return a.replace(/\/*$/, '/') + b;
    }
  }

  function dirname(path) {
    var bits = path.split('/');
    bits.pop();
    return bits.join('/');
  }

  /**
   * Lookup module names and resolve them by calling the definition function if
   * needed.
   * @param {string} moduleName A name for the payload to lookup
   * @return {object} The module specified by aModuleName or null if not found.
   */
  Domain.prototype.lookup = function(moduleName) {
    if (/^\./.test(moduleName)) {
      moduleName = normalize(join(dirname(this._currentModule), moduleName));
    }

    if (moduleName in this.modules) {
      var module = this.modules[moduleName];
      return module;
    }

    if (!(moduleName in define.modules)) {
      throw new Error("Module not defined: " + moduleName);
    }

    var module = define.modules[moduleName];

    if (typeof module == "function") {
      var exports = {};
      var previousModule = this._currentModule;
      this._currentModule = moduleName;
      module(this.require.bind(this), exports, { id: moduleName, uri: "" });
      this._currentModule = previousModule;
      module = exports;
    }

    // cache the resulting module object for next time
    this.modules[moduleName] = module;

    return module;
  };

}());

define.Domain = Domain;
define.globalDomain = new Domain();
var require = define.globalDomain.require.bind(define.globalDomain);
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define('source-map/source-map-generator', ['require', 'exports', 'module' ,  'source-map/base64-vlq', 'source-map/util', 'source-map/array-set', 'source-map/mapping-list'], function(require, exports, module) {

  var base64VLQ = require('./base64-vlq');
  var util = require('./util');
  var ArraySet = require('./array-set').ArraySet;
  var MappingList = require('./mapping-list').MappingList;

  /**
   * An instance of the SourceMapGenerator represents a source map which is
   * being built incrementally. You may pass an object with the following
   * properties:
   *
   *   - file: The filename of the generated source.
   *   - sourceRoot: A root for all relative URLs in this source map.
   */
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util.getArg(aArgs, 'file', null);
    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
    this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = new MappingList();
    this._sourcesContents = null;
  }

  SourceMapGenerator.prototype._version = 3;

  /**
   * Creates a new SourceMapGenerator based on a SourceMapConsumer
   *
   * @param aSourceMapConsumer The SourceMap.
   */
  SourceMapGenerator.fromSourceMap =
    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
      var sourceRoot = aSourceMapConsumer.sourceRoot;
      var generator = new SourceMapGenerator({
        file: aSourceMapConsumer.file,
        sourceRoot: sourceRoot
      });
      aSourceMapConsumer.eachMapping(function (mapping) {
        var newMapping = {
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
          }
        };

        if (mapping.source != null) {
          newMapping.source = mapping.source;
          if (sourceRoot != null) {
            newMapping.source = util.relative(sourceRoot, newMapping.source);
          }

          newMapping.original = {
            line: mapping.originalLine,
            column: mapping.originalColumn
          };

          if (mapping.name != null) {
            newMapping.name = mapping.name;
          }
        }

        generator.addMapping(newMapping);
      });
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          generator.setSourceContent(sourceFile, content);
        }
      });
      return generator;
    };

  /**
   * Add a single mapping from original source line and column to the generated
   * source's line and column for this source map being created. The mapping
   * object should have the following properties:
   *
   *   - generated: An object with the generated line and column positions.
   *   - original: An object with the original line and column positions.
   *   - source: The original source file (relative to the sourceRoot).
   *   - name: An optional original token name for this mapping.
   */
  SourceMapGenerator.prototype.addMapping =
    function SourceMapGenerator_addMapping(aArgs) {
      var generated = util.getArg(aArgs, 'generated');
      var original = util.getArg(aArgs, 'original', null);
      var source = util.getArg(aArgs, 'source', null);
      var name = util.getArg(aArgs, 'name', null);

      if (!this._skipValidation) {
        this._validateMapping(generated, original, source, name);
      }

      if (source != null && !this._sources.has(source)) {
        this._sources.add(source);
      }

      if (name != null && !this._names.has(name)) {
        this._names.add(name);
      }

      this._mappings.add({
        generatedLine: generated.line,
        generatedColumn: generated.column,
        originalLine: original != null && original.line,
        originalColumn: original != null && original.column,
        source: source,
        name: name
      });
    };

  /**
   * Set the source content for a source file.
   */
  SourceMapGenerator.prototype.setSourceContent =
    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
      var source = aSourceFile;
      if (this._sourceRoot != null) {
        source = util.relative(this._sourceRoot, source);
      }

      if (aSourceContent != null) {
        // Add the source content to the _sourcesContents map.
        // Create a new _sourcesContents map if the property is null.
        if (!this._sourcesContents) {
          this._sourcesContents = {};
        }
        this._sourcesContents[util.toSetString(source)] = aSourceContent;
      } else if (this._sourcesContents) {
        // Remove the source file from the _sourcesContents map.
        // If the _sourcesContents map is empty, set the property to null.
        delete this._sourcesContents[util.toSetString(source)];
        if (Object.keys(this._sourcesContents).length === 0) {
          this._sourcesContents = null;
        }
      }
    };

  /**
   * Applies the mappings of a sub-source-map for a specific source file to the
   * source map being generated. Each mapping to the supplied source file is
   * rewritten using the supplied source map. Note: The resolution for the
   * resulting mappings is the minimium of this map and the supplied map.
   *
   * @param aSourceMapConsumer The source map to be applied.
   * @param aSourceFile Optional. The filename of the source file.
   *        If omitted, SourceMapConsumer's file property will be used.
   * @param aSourceMapPath Optional. The dirname of the path to the source map
   *        to be applied. If relative, it is relative to the SourceMapConsumer.
   *        This parameter is needed when the two source maps aren't in the same
   *        directory, and the source map to be applied contains relative source
   *        paths. If so, those relative source paths need to be rewritten
   *        relative to the SourceMapGenerator.
   */
  SourceMapGenerator.prototype.applySourceMap =
    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
      var sourceFile = aSourceFile;
      // If aSourceFile is omitted, we will use the file property of the SourceMap
      if (aSourceFile == null) {
        if (aSourceMapConsumer.file == null) {
          throw new Error(
            'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
            'or the source map\'s "file" property. Both were omitted.'
          );
        }
        sourceFile = aSourceMapConsumer.file;
      }
      var sourceRoot = this._sourceRoot;
      // Make "sourceFile" relative if an absolute Url is passed.
      if (sourceRoot != null) {
        sourceFile = util.relative(sourceRoot, sourceFile);
      }
      // Applying the SourceMap can add and remove items from the sources and
      // the names array.
      var newSources = new ArraySet();
      var newNames = new ArraySet();

      // Find mappings for the "sourceFile"
      this._mappings.unsortedForEach(function (mapping) {
        if (mapping.source === sourceFile && mapping.originalLine != null) {
          // Check if it can be mapped by the source map, then update the mapping.
          var original = aSourceMapConsumer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
          });
          if (original.source != null) {
            // Copy mapping
            mapping.source = original.source;
            if (aSourceMapPath != null) {
              mapping.source = util.join(aSourceMapPath, mapping.source)
            }
            if (sourceRoot != null) {
              mapping.source = util.relative(sourceRoot, mapping.source);
            }
            mapping.originalLine = original.line;
            mapping.originalColumn = original.column;
            if (original.name != null) {
              mapping.name = original.name;
            }
          }
        }

        var source = mapping.source;
        if (source != null && !newSources.has(source)) {
          newSources.add(source);
        }

        var name = mapping.name;
        if (name != null && !newNames.has(name)) {
          newNames.add(name);
        }

      }, this);
      this._sources = newSources;
      this._names = newNames;

      // Copy sourcesContents of applied map.
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aSourceMapPath != null) {
            sourceFile = util.join(aSourceMapPath, sourceFile);
          }
          if (sourceRoot != null) {
            sourceFile = util.relative(sourceRoot, sourceFile);
          }
          this.setSourceContent(sourceFile, content);
        }
      }, this);
    };

  /**
   * A mapping can have one of the three levels of data:
   *
   *   1. Just the generated position.
   *   2. The Generated position, original position, and original source.
   *   3. Generated and original position, original source, as well as a name
   *      token.
   *
   * To maintain consistency, we validate that any new mapping being added falls
   * in to one of these categories.
   */
  SourceMapGenerator.prototype._validateMapping =
    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                                aName) {
      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
          && aGenerated.line > 0 && aGenerated.column >= 0
          && !aOriginal && !aSource && !aName) {
        // Case 1.
        return;
      }
      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
               && aGenerated.line > 0 && aGenerated.column >= 0
               && aOriginal.line > 0 && aOriginal.column >= 0
               && aSource) {
        // Cases 2 and 3.
        return;
      }
      else {
        throw new Error('Invalid mapping: ' + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          original: aOriginal,
          name: aName
        }));
      }
    };

  /**
   * Serialize the accumulated mappings in to the stream of base 64 VLQs
   * specified by the source map format.
   */
  SourceMapGenerator.prototype._serializeMappings =
    function SourceMapGenerator_serializeMappings() {
      var previousGeneratedColumn = 0;
      var previousGeneratedLine = 1;
      var previousOriginalColumn = 0;
      var previousOriginalLine = 0;
      var previousName = 0;
      var previousSource = 0;
      var result = '';
      var mapping;

      var mappings = this._mappings.toArray();
      for (var i = 0, len = mappings.length; i < len; i++) {
        mapping = mappings[i];

        if (mapping.generatedLine !== previousGeneratedLine) {
          previousGeneratedColumn = 0;
          while (mapping.generatedLine !== previousGeneratedLine) {
            result += ';';
            previousGeneratedLine++;
          }
        }
        else {
          if (i > 0) {
            if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
              continue;
            }
            result += ',';
          }
        }

        result += base64VLQ.encode(mapping.generatedColumn
                                   - previousGeneratedColumn);
        previousGeneratedColumn = mapping.generatedColumn;

        if (mapping.source != null) {
          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
                                     - previousSource);
          previousSource = this._sources.indexOf(mapping.source);

          // lines are stored 0-based in SourceMap spec version 3
          result += base64VLQ.encode(mapping.originalLine - 1
                                     - previousOriginalLine);
          previousOriginalLine = mapping.originalLine - 1;

          result += base64VLQ.encode(mapping.originalColumn
                                     - previousOriginalColumn);
          previousOriginalColumn = mapping.originalColumn;

          if (mapping.name != null) {
            result += base64VLQ.encode(this._names.indexOf(mapping.name)
                                       - previousName);
            previousName = this._names.indexOf(mapping.name);
          }
        }
      }

      return result;
    };

  SourceMapGenerator.prototype._generateSourcesContent =
    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
      return aSources.map(function (source) {
        if (!this._sourcesContents) {
          return null;
        }
        if (aSourceRoot != null) {
          source = util.relative(aSourceRoot, source);
        }
        var key = util.toSetString(source);
        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
                                                    key)
          ? this._sourcesContents[key]
          : null;
      }, this);
    };

  /**
   * Externalize the source map.
   */
  SourceMapGenerator.prototype.toJSON =
    function SourceMapGenerator_toJSON() {
      var map = {
        version: this._version,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
      };
      if (this._file != null) {
        map.file = this._file;
      }
      if (this._sourceRoot != null) {
        map.sourceRoot = this._sourceRoot;
      }
      if (this._sourcesContents) {
        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
      }

      return map;
    };

  /**
   * Render the source map being generated to a string.
   */
  SourceMapGenerator.prototype.toString =
    function SourceMapGenerator_toString() {
      return JSON.stringify(this.toJSON());
    };

  exports.SourceMapGenerator = SourceMapGenerator;

});
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define('source-map/base64-vlq', ['require', 'exports', 'module' ,  'source-map/base64'], function(require, exports, module) {

  var base64 = require('./base64');

  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
  // length quantities we use in the source map spec, the first bit is the sign,
  // the next four bits are the actual value, and the 6th bit is the
  // continuation bit. The continuation bit tells us whether there are more
  // digits in this value following this digit.
  //
  //   Continuation
  //   |    Sign
  //   |    |
  //   V    V
  //   101011

  var VLQ_BASE_SHIFT = 5;

  // binary: 100000
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

  // binary: 011111
  var VLQ_BASE_MASK = VLQ_BASE - 1;

  // binary: 100000
  var VLQ_CONTINUATION_BIT = VLQ_BASE;

  /**
   * Converts from a two-complement value to a value where the sign bit is
   * placed in the least significant bit.  For example, as decimals:
   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
   */
  function toVLQSigned(aValue) {
    return aValue < 0
      ? ((-aValue) << 1) + 1
      : (aValue << 1) + 0;
  }

  /**
   * Converts to a two-complement value from a value where the sign bit is
   * placed in the least significant bit.  For example, as decimals:
   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
   */
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative
      ? -shifted
      : shifted;
  }

  /**
   * Returns the base 64 VLQ encoded value.
   */
  exports.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;

    var vlq = toVLQSigned(aValue);

    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        // There are still more digits in this value, so we must make sure the
        // continuation bit is marked.
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);

    return encoded;
  };

  /**
   * Decodes the next base 64 VLQ value from the given string and returns the
   * value and the rest of the string via the out parameter.
   */
  exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;

    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }

      digit = base64.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }

      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);

    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };

});
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define('source-map/base64', ['require', 'exports', 'module' , ], function(require, exports, module) {

  var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

  /**
   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
   */
  exports.encode = function (number) {
    if (0 <= number && number < intToCharMap.length) {
      return intToCharMap[number];
    }
    throw new TypeError("Must be between 0 and 63: " + aNumber);
  };

  /**
   * Decode a single base 64 character code digit to an integer. Returns -1 on
   * failure.
   */
  exports.decode = function (charCode) {
    var bigA = 65;     // 'A'
    var bigZ = 90;     // 'Z'

    var littleA = 97;  // 'a'
    var littleZ = 122; // 'z'

    var zero = 48;     // '0'
    var nine = 57;     // '9'

    var plus = 43;     // '+'
    var slash = 47;    // '/'

    var littleOffset = 26;
    var numberOffset = 52;

    // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
    if (bigA <= charCode && charCode <= bigZ) {
      return (charCode - bigA);
    }

    // 26 - 51: abcdefghijklmnopqrstuvwxyz
    if (littleA <= charCode && charCode <= littleZ) {
      return (charCode - littleA + littleOffset);
    }

    // 52 - 61: 0123456789
    if (zero <= charCode && charCode <= nine) {
      return (charCode - zero + numberOffset);
    }

    // 62: +
    if (charCode == plus) {
      return 62;
    }

    // 63: /
    if (charCode == slash) {
      return 63;
    }

    // Invalid base64 digit.
    return -1;
  };

});
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define('source-map/util', ['require', 'exports', 'module' , ], function(require, exports, module) {

  /**
   * This is a helper function for getting values from parameter/options
   * objects.
   *
   * @param args The object we are extracting values from
   * @param name The name of the property we are getting.
   * @param defaultValue An optional value to return if the property is missing
   * from the object. If this is not specified and the property is missing, an
   * error will be thrown.
   */
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports.getArg = getArg;

  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
  var dataUrlRegexp = /^data:.+\,.+$/;

  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    };
  }
  exports.urlParse = urlParse;

  function urlGenerate(aParsedUrl) {
    var url = '';
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ':';
    }
    url += '//';
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + '@';
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports.urlGenerate = urlGenerate;

  /**
   * Normalizes a path, or the path portion of a URL:
   *
   * - Replaces consequtive slashes with one slash.
   * - Removes unnecessary '.' parts.
   * - Removes unnecessary '<dir>/..' parts.
   *
   * Based on code in the Node.js 'path' core module.
   *
   * @param aPath The path or url to normalize.
   */
  function normalize(aPath) {
    var path = aPath;
    var url = urlParse(aPath);
    if (url) {
      if (!url.path) {
        return aPath;
      }
      path = url.path;
    }
    var isAbsolute = exports.isAbsolute(path);

    var parts = path.split(/\/+/);
    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
      part = parts[i];
      if (part === '.') {
        parts.splice(i, 1);
      } else if (part === '..') {
        up++;
      } else if (up > 0) {
        if (part === '') {
          // The first part is blank if the path is absolute. Trying to go
          // above the root is a no-op. Therefore we can remove all '..' parts
          // directly after the root.
          parts.splice(i + 1, up);
          up = 0;
        } else {
          parts.splice(i, 2);
          up--;
        }
      }
    }
    path = parts.join('/');

    if (path === '') {
      path = isAbsolute ? '/' : '.';
    }

    if (url) {
      url.path = path;
      return urlGenerate(url);
    }
    return path;
  }
  exports.normalize = normalize;

  /**
   * Joins two paths/URLs.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be joined with the root.
   *
   * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
   *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
   *   first.
   * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
   *   is updated with the result and aRoot is returned. Otherwise the result
   *   is returned.
   *   - If aPath is absolute, the result is aPath.
   *   - Otherwise the two paths are joined with a slash.
   * - Joining for example 'http://' and 'www.example.com' is also supported.
   */
  function join(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    if (aPath === "") {
      aPath = ".";
    }
    var aPathUrl = urlParse(aPath);
    var aRootUrl = urlParse(aRoot);
    if (aRootUrl) {
      aRoot = aRootUrl.path || '/';
    }

    // `join(foo, '//www.example.org')`
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme;
      }
      return urlGenerate(aPathUrl);
    }

    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath;
    }

    // `join('http://', 'www.example.com')`
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath;
      return urlGenerate(aRootUrl);
    }

    var joined = aPath.charAt(0) === '/'
      ? aPath
      : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

    if (aRootUrl) {
      aRootUrl.path = joined;
      return urlGenerate(aRootUrl);
    }
    return joined;
  }
  exports.join = join;

  exports.isAbsolute = function (aPath) {
    return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
  };

  /**
   * Make a path relative to a URL or another path.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be made relative to aRoot.
   */
  function relative(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }

    aRoot = aRoot.replace(/\/$/, '');

    // It is possible for the path to be above the root. In this case, simply
    // checking whether the root is a prefix of the path won't work. Instead, we
    // need to remove components from the root one by one, until either we find
    // a prefix that fits, or we run out of components to remove.
    var level = 0;
    while (aPath.indexOf(aRoot + '/') !== 0) {
      var index = aRoot.lastIndexOf("/");
      if (index < 0) {
        return aPath;
      }

      // If the only part of the root that is left is the scheme (i.e. http://,
      // file:///, etc.), one or more slashes (/), or simply nothing at all, we
      // have exhausted all components, so the path is not relative to the root.
      aRoot = aRoot.slice(0, index);
      if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
        return aPath;
      }

      ++level;
    }

    // Make sure we add a "../" for each component we removed from the root.
    return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
  }
  exports.relative = relative;

  /**
   * Because behavior goes wacky when you set `__proto__` on objects, we
   * have to prefix all the strings in our set with an arbitrary character.
   *
   * See https://github.com/mozilla/source-map/pull/31 and
   * https://github.com/mozilla/source-map/issues/30
   *
   * @param String aStr
   */
  function toSetString(aStr) {
    return '$' + aStr;
  }
  exports.toSetString = toSetString;

  function fromSetString(aStr) {
    return aStr.substr(1);
  }
  exports.fromSetString = fromSetString;

  /**
   * Comparator between two mappings where the original positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same original source/line/column, but different generated
   * line and column the same. Useful when searching for a mapping with a
   * stubbed out mapping.
   */
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp = mappingA.source - mappingB.source;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0 || onlyCompareOriginal) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }

    return mappingA.name - mappingB.name;
  };
  exports.compareByOriginalPositions = compareByOriginalPositions;

  /**
   * Comparator between two mappings with deflated source and name indices where
   * the generated positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same generated line and column, but different
   * source/name/original line and column the same. Useful when searching for a
   * mapping with a stubbed out mapping.
   */
  function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0 || onlyCompareGenerated) {
      return cmp;
    }

    cmp = mappingA.source - mappingB.source;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }

    return mappingA.name - mappingB.name;
  };
  exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

  function strcmp(aStr1, aStr2) {
    if (aStr1 === aStr2) {
      return 0;
    }

    if (aStr1 > aStr2) {
      return 1;
    }

    return -1;
  }

  /**
   * Comparator between two mappings with inflated source and name strings where
   * the generated positions are compared.
   */
  function compareByGeneratedPositionsInflated(mappingA, mappingB) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }

    return strcmp(mappingA.name, mappingB.name);
  };
  exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

});
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define('source-map/array-set', ['require', 'exports', 'module' ,  'source-map/util'], function(require, exports, module) {

  var util = require('./util');

  /**
   * A data structure which is a combination of an array and a set. Adding a new
   * member is O(1), testing for membership is O(1), and finding the index of an
   * element is O(1). Removing elements from the set is not supported. Only
   * strings are supported for membership.
   */
  function ArraySet() {
    this._array = [];
    this._set = {};
  }

  /**
   * Static method for creating ArraySet instances from an existing array.
   */
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };

  /**
   * Return how many unique items are in this ArraySet. If duplicates have been
   * added, than those do not count towards the size.
   *
   * @returns Number
   */
  ArraySet.prototype.size = function ArraySet_size() {
    return Object.getOwnPropertyNames(this._set).length;
  };

  /**
   * Add the given string to this set.
   *
   * @param String aStr
   */
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var isDuplicate = this.has(aStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      this._set[util.toSetString(aStr)] = idx;
    }
  };

  /**
   * Is the given string a member of this set?
   *
   * @param String aStr
   */
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    return Object.prototype.hasOwnProperty.call(this._set,
                                                util.toSetString(aStr));
  };

  /**
   * What is the index of the given string in the array?
   *
   * @param String aStr
   */
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (this.has(aStr)) {
      return this._set[util.toSetString(aStr)];
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };

  /**
   * What is the element at the given index?
   *
   * @param Number aIdx
   */
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error('No element indexed by ' + aIdx);
  };

  /**
   * Returns the array representation of this set (which has the proper indices
   * indicated by indexOf). Note that this is a copy of the internal array used
   * for storing the members so that no one can mess with internal state.
   */
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };

  exports.ArraySet = ArraySet;

});
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define('source-map/mapping-list', ['require', 'exports', 'module' ,  'source-map/util'], function(require, exports, module) {

  var util = require('./util');

  /**
   * Determine whether mappingB is after mappingA with respect to generated
   * position.
   */
  function generatedPositionAfter(mappingA, mappingB) {
    // Optimized for most common case
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA ||
           util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }

  /**
   * A data structure to provide a sorted view of accumulated mappings in a
   * performance conscious manner. It trades a neglibable overhead in general
   * case for a large speedup in case of mappings being added in order.
   */
  function MappingList() {
    this._array = [];
    this._sorted = true;
    // Serves as infimum
    this._last = {generatedLine: -1, generatedColumn: 0};
  }

  /**
   * Iterate through internal items. This method takes the same arguments that
   * `Array.prototype.forEach` takes.
   *
   * NOTE: The order of the mappings is NOT guaranteed.
   */
  MappingList.prototype.unsortedForEach =
    function MappingList_forEach(aCallback, aThisArg) {
      this._array.forEach(aCallback, aThisArg);
    };

  /**
   * Add the given source mapping.
   *
   * @param Object aMapping
   */
  MappingList.prototype.add = function MappingList_add(aMapping) {
    var mapping;
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  };

  /**
   * Returns the flat, sorted array of mappings. The mappings are sorted by
   * generated position.
   *
   * WARNING: This method returns internal data without copying, for
   * performance. The return value must NOT be mutated, and should be treated as
   * an immutable borrow. If you want to take ownership, you must make your own
   * copy.
   */
  MappingList.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  };

  exports.MappingList = MappingList;

});
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define('source-map/source-map-consumer', ['require', 'exports', 'module' ,  'source-map/util', 'source-map/binary-search', 'source-map/array-set', 'source-map/base64-vlq', 'source-map/quick-sort'], function(require, exports, module) {

  var util = require('./util');
  var binarySearch = require('./binary-search');
  var ArraySet = require('./array-set').ArraySet;
  var base64VLQ = require('./base64-vlq');
  var quickSort = require('./quick-sort').quickSort;

  function SourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
    }

    return sourceMap.sections != null
      ? new IndexedSourceMapConsumer(sourceMap)
      : new BasicSourceMapConsumer(sourceMap);
  }

  SourceMapConsumer.fromSourceMap = function(aSourceMap) {
    return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
  }

  /**
   * The version of the source mapping spec that we are consuming.
   */
  SourceMapConsumer.prototype._version = 3;

  // `__generatedMappings` and `__originalMappings` are arrays that hold the
  // parsed mapping coordinates from the source map's "mappings" attribute. They
  // are lazily instantiated, accessed via the `_generatedMappings` and
  // `_originalMappings` getters respectively, and we only parse the mappings
  // and create these arrays once queried for a source location. We jump through
  // these hoops because there can be many thousands of mappings, and parsing
  // them is expensive, so we only want to do it if we must.
  //
  // Each object in the arrays is of the form:
  //
  //     {
  //       generatedLine: The line number in the generated code,
  //       generatedColumn: The column number in the generated code,
  //       source: The path to the original source file that generated this
  //               chunk of code,
  //       originalLine: The line number in the original source that
  //                     corresponds to this chunk of generated code,
  //       originalColumn: The column number in the original source that
  //                       corresponds to this chunk of generated code,
  //       name: The name of the original symbol which generated this chunk of
  //             code.
  //     }
  //
  // All properties except for `generatedLine` and `generatedColumn` can be
  // `null`.
  //
  // `_generatedMappings` is ordered by the generated positions.
  //
  // `_originalMappings` is ordered by the original positions.

  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
    get: function () {
      if (!this.__generatedMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__generatedMappings;
    }
  });

  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
    get: function () {
      if (!this.__originalMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__originalMappings;
    }
  });

  SourceMapConsumer.prototype._charIsMappingSeparator =
    function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
      var c = aStr.charAt(index);
      return c === ";" || c === ",";
    };

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  SourceMapConsumer.prototype._parseMappings =
    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      throw new Error("Subclasses must implement _parseMappings");
    };

  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;

  SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
  SourceMapConsumer.LEAST_UPPER_BOUND = 2;

  /**
   * Iterate over each mapping between an original source/line/column and a
   * generated line/column in this source map.
   *
   * @param Function aCallback
   *        The function that is called with each mapping.
   * @param Object aContext
   *        Optional. If specified, this object will be the value of `this` every
   *        time that `aCallback` is called.
   * @param aOrder
   *        Either `SourceMapConsumer.GENERATED_ORDER` or
   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
   *        iterate over the mappings sorted by the generated file's line/column
   *        order or the original's source/line/column order, respectively. Defaults to
   *        `SourceMapConsumer.GENERATED_ORDER`.
   */
  SourceMapConsumer.prototype.eachMapping =
    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
      var context = aContext || null;
      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

      var mappings;
      switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
      }

      var sourceRoot = this.sourceRoot;
      mappings.map(function (mapping) {
        var source = mapping.source === null ? null : this._sources.at(mapping.source);
        if (source != null && sourceRoot != null) {
          source = util.join(sourceRoot, source);
        }
        return {
          source: source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn,
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name === null ? null : this._names.at(mapping.name)
        };
      }, this).forEach(aCallback, context);
    };

  /**
   * Returns all generated line and column information for the original source,
   * line, and column provided. If no column is provided, returns all mappings
   * corresponding to a either the line we are searching for or the next
   * closest line that has any mappings. Otherwise, returns all mappings
   * corresponding to the given line and either the column we are searching for
   * or the next closest column that has any offsets.
   *
   * The only argument is an object with the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.
   *   - column: Optional. the column number in the original source.
   *
   * and an array of objects is returned, each with the following properties:
   *
   *   - line: The line number in the generated source, or null.
   *   - column: The column number in the generated source, or null.
   */
  SourceMapConsumer.prototype.allGeneratedPositionsFor =
    function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
      var line = util.getArg(aArgs, 'line');

      // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
      // returns the index of the closest mapping less than the needle. By
      // setting needle.originalColumn to 0, we thus find the last mapping for
      // the given line, provided such a mapping exists.
      var needle = {
        source: util.getArg(aArgs, 'source'),
        originalLine: line,
        originalColumn: util.getArg(aArgs, 'column', 0)
      };

      if (this.sourceRoot != null) {
        needle.source = util.relative(this.sourceRoot, needle.source);
      }
      if (!this._sources.has(needle.source)) {
        return [];
      }
      needle.source = this._sources.indexOf(needle.source);

      var mappings = [];

      var index = this._findMapping(needle,
                                    this._originalMappings,
                                    "originalLine",
                                    "originalColumn",
                                    util.compareByOriginalPositions,
                                    binarySearch.LEAST_UPPER_BOUND);
      if (index >= 0) {
        var mapping = this._originalMappings[index];

        if (aArgs.column === undefined) {
          var originalLine = mapping.originalLine;

          // Iterate until either we run out of mappings, or we run into
          // a mapping for a different line than the one we found. Since
          // mappings are sorted, this is guaranteed to find all mappings for
          // the line we found.
          while (mapping && mapping.originalLine === originalLine) {
            mappings.push({
              line: util.getArg(mapping, 'generatedLine', null),
              column: util.getArg(mapping, 'generatedColumn', null),
              lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
            });

            mapping = this._originalMappings[++index];
          }
        } else {
          var originalColumn = mapping.originalColumn;

          // Iterate until either we run out of mappings, or we run into
          // a mapping for a different line than the one we were searching for.
          // Since mappings are sorted, this is guaranteed to find all mappings for
          // the line we are searching for.
          while (mapping &&
                 mapping.originalLine === line &&
                 mapping.originalColumn == originalColumn) {
            mappings.push({
              line: util.getArg(mapping, 'generatedLine', null),
              column: util.getArg(mapping, 'generatedColumn', null),
              lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
            });

            mapping = this._originalMappings[++index];
          }
        }
      }

      return mappings;
    };

  exports.SourceMapConsumer = SourceMapConsumer;

  /**
   * A BasicSourceMapConsumer instance represents a parsed source map which we can
   * query for information about the original file positions by giving it a file
   * position in the generated source.
   *
   * The only parameter is the raw source map (either as a JSON string, or
   * already parsed to an object). According to the spec, source maps have the
   * following attributes:
   *
   *   - version: Which version of the source map spec this map is following.
   *   - sources: An array of URLs to the original source files.
   *   - names: An array of identifiers which can be referrenced by individual mappings.
   *   - sourceRoot: Optional. The URL root from which all sources are relative.
   *   - sourcesContent: Optional. An array of contents of the original source files.
   *   - mappings: A string of base64 VLQs which contain the actual mappings.
   *   - file: Optional. The generated file this source map is associated with.
   *
   * Here is an example source map, taken from the source map spec[0]:
   *
   *     {
   *       version : 3,
   *       file: "out.js",
   *       sourceRoot : "",
   *       sources: ["foo.js", "bar.js"],
   *       names: ["src", "maps", "are", "fun"],
   *       mappings: "AA,AB;;ABCDE;"
   *     }
   *
   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
   */
  function BasicSourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
    }

    var version = util.getArg(sourceMap, 'version');
    var sources = util.getArg(sourceMap, 'sources');
    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
    // requires the array) to play nice here.
    var names = util.getArg(sourceMap, 'names', []);
    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
    var mappings = util.getArg(sourceMap, 'mappings');
    var file = util.getArg(sourceMap, 'file', null);

    // Once again, Sass deviates from the spec and supplies the version as a
    // string rather than a number, so we use loose equality checking here.
    if (version != this._version) {
      throw new Error('Unsupported version: ' + version);
    }

    sources = sources
      // Some source maps produce relative source paths like "./foo.js" instead of
      // "foo.js".  Normalize these first so that future comparisons will succeed.
      // See bugzil.la/1090768.
      .map(util.normalize)
      // Always ensure that absolute sources are internally stored relative to
      // the source root, if the source root is absolute. Not doing this would
      // be particularly problematic when the source root is a prefix of the
      // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
      .map(function (source) {
        return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
          ? util.relative(sourceRoot, source)
          : source;
      });

    // Pass `true` below to allow duplicate names and sources. While source maps
    // are intended to be compressed and deduplicated, the TypeScript compiler
    // sometimes generates source maps with duplicates in them. See Github issue
    // #72 and bugzil.la/889492.
    this._names = ArraySet.fromArray(names, true);
    this._sources = ArraySet.fromArray(sources, true);

    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this.file = file;
  }

  BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

  /**
   * Create a BasicSourceMapConsumer from a SourceMapGenerator.
   *
   * @param SourceMapGenerator aSourceMap
   *        The source map that will be consumed.
   * @returns BasicSourceMapConsumer
   */
  BasicSourceMapConsumer.fromSourceMap =
    function SourceMapConsumer_fromSourceMap(aSourceMap) {
      var smc = Object.create(BasicSourceMapConsumer.prototype);

      var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
      var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
      smc.sourceRoot = aSourceMap._sourceRoot;
      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                              smc.sourceRoot);
      smc.file = aSourceMap._file;

      // Because we are modifying the entries (by converting string sources and
      // names to indices into the sources and names ArraySets), we have to make
      // a copy of the entry or else bad things happen. Shared mutable state
      // strikes again! See github issue #191.

      var generatedMappings = aSourceMap._mappings.toArray().slice();
      var destGeneratedMappings = smc.__generatedMappings = [];
      var destOriginalMappings = smc.__originalMappings = [];

      for (var i = 0, length = generatedMappings.length; i < length; i++) {
        var srcMapping = generatedMappings[i];
        var destMapping = new Mapping;
        destMapping.generatedLine = srcMapping.generatedLine;
        destMapping.generatedColumn = srcMapping.generatedColumn;

        if (srcMapping.source) {
          destMapping.source = sources.indexOf(srcMapping.source);
          destMapping.originalLine = srcMapping.originalLine;
          destMapping.originalColumn = srcMapping.originalColumn;

          if (srcMapping.name) {
            destMapping.name = names.indexOf(srcMapping.name);
          }

          destOriginalMappings.push(destMapping);
        }

        destGeneratedMappings.push(destMapping);
      }

      quickSort(smc.__originalMappings, util.compareByOriginalPositions);

      return smc;
    };

  /**
   * The version of the source mapping spec that we are consuming.
   */
  BasicSourceMapConsumer.prototype._version = 3;

  /**
   * The list of original sources.
   */
  Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
    get: function () {
      return this._sources.toArray().map(function (s) {
        return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
      }, this);
    }
  });

  /**
   * Provide the JIT with a nice shape / hidden class.
   */
  function Mapping() {
    this.generatedLine = 0;
    this.generatedColumn = 0;
    this.source = null;
    this.originalLine = null;
    this.originalColumn = null;
    this.name = null;
  }

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  BasicSourceMapConsumer.prototype._parseMappings =
    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      var generatedLine = 1;
      var previousGeneratedColumn = 0;
      var previousOriginalLine = 0;
      var previousOriginalColumn = 0;
      var previousSource = 0;
      var previousName = 0;
      var length = aStr.length;
      var index = 0;
      var cachedSegments = {};
      var temp = {};
      var originalMappings = [];
      var generatedMappings = [];
      var mapping, str, segment, end, value;

      while (index < length) {
        if (aStr.charAt(index) === ';') {
          generatedLine++;
          index++;
          previousGeneratedColumn = 0;
        }
        else if (aStr.charAt(index) === ',') {
          index++;
        }
        else {
          mapping = new Mapping();
          mapping.generatedLine = generatedLine;

          // Because each offset is encoded relative to the previous one,
          // many segments often have the same encoding. We can exploit this
          // fact by caching the parsed variable length fields of each segment,
          // allowing us to avoid a second parse if we encounter the same
          // segment again.
          for (end = index; end < length; end++) {
            if (this._charIsMappingSeparator(aStr, end)) {
              break;
            }
          }
          str = aStr.slice(index, end);

          segment = cachedSegments[str];
          if (segment) {
            index += str.length;
          } else {
            segment = [];
            while (index < end) {
              base64VLQ.decode(aStr, index, temp);
              value = temp.value;
              index = temp.rest;
              segment.push(value);
            }

            if (segment.length === 2) {
              throw new Error('Found a source, but no line and column');
            }

            if (segment.length === 3) {
              throw new Error('Found a source and line, but no column');
            }

            cachedSegments[str] = segment;
          }

          // Generated column.
          mapping.generatedColumn = previousGeneratedColumn + segment[0];
          previousGeneratedColumn = mapping.generatedColumn;

          if (segment.length > 1) {
            // Original source.
            mapping.source = previousSource + segment[1];
            previousSource += segment[1];

            // Original line.
            mapping.originalLine = previousOriginalLine + segment[2];
            previousOriginalLine = mapping.originalLine;
            // Lines are stored 0-based
            mapping.originalLine += 1;

            // Original column.
            mapping.originalColumn = previousOriginalColumn + segment[3];
            previousOriginalColumn = mapping.originalColumn;

            if (segment.length > 4) {
              // Original name.
              mapping.name = previousName + segment[4];
              previousName += segment[4];
            }
          }

          generatedMappings.push(mapping);
          if (typeof mapping.originalLine === 'number') {
            originalMappings.push(mapping);
          }
        }
      }

      quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
      this.__generatedMappings = generatedMappings;

      quickSort(originalMappings, util.compareByOriginalPositions);
      this.__originalMappings = originalMappings;
    };

  /**
   * Find the mapping that best matches the hypothetical "needle" mapping that
   * we are searching for in the given "haystack" of mappings.
   */
  BasicSourceMapConsumer.prototype._findMapping =
    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                           aColumnName, aComparator, aBias) {
      // To return the position we are searching for, we must first find the
      // mapping for the given position and then return the opposite position it
      // points to. Because the mappings are sorted, we can use binary search to
      // find the best mapping.

      if (aNeedle[aLineName] <= 0) {
        throw new TypeError('Line must be greater than or equal to 1, got '
                            + aNeedle[aLineName]);
      }
      if (aNeedle[aColumnName] < 0) {
        throw new TypeError('Column must be greater than or equal to 0, got '
                            + aNeedle[aColumnName]);
      }

      return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
    };

  /**
   * Compute the last column for each generated mapping. The last column is
   * inclusive.
   */
  BasicSourceMapConsumer.prototype.computeColumnSpans =
    function SourceMapConsumer_computeColumnSpans() {
      for (var index = 0; index < this._generatedMappings.length; ++index) {
        var mapping = this._generatedMappings[index];

        // Mappings do not contain a field for the last generated columnt. We
        // can come up with an optimistic estimate, however, by assuming that
        // mappings are contiguous (i.e. given two consecutive mappings, the
        // first mapping ends where the second one starts).
        if (index + 1 < this._generatedMappings.length) {
          var nextMapping = this._generatedMappings[index + 1];

          if (mapping.generatedLine === nextMapping.generatedLine) {
            mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
            continue;
          }
        }

        // The last mapping for each line spans the entire line.
        mapping.lastGeneratedColumn = Infinity;
      }
    };

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.
   *   - column: The column number in the generated source.
   *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
   *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.
   *   - column: The column number in the original source, or null.
   *   - name: The original identifier, or null.
   */
  BasicSourceMapConsumer.prototype.originalPositionFor =
    function SourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, 'line'),
        generatedColumn: util.getArg(aArgs, 'column')
      };

      var index = this._findMapping(
        needle,
        this._generatedMappings,
        "generatedLine",
        "generatedColumn",
        util.compareByGeneratedPositionsDeflated,
        util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
      );

      if (index >= 0) {
        var mapping = this._generatedMappings[index];

        if (mapping.generatedLine === needle.generatedLine) {
          var source = util.getArg(mapping, 'source', null);
          if (source !== null) {
            source = this._sources.at(source);
            if (this.sourceRoot != null) {
              source = util.join(this.sourceRoot, source);
            }
          }
          var name = util.getArg(mapping, 'name', null);
          if (name !== null) {
            name = this._names.at(name);
          }
          return {
            source: source,
            line: util.getArg(mapping, 'originalLine', null),
            column: util.getArg(mapping, 'originalColumn', null),
            name: name
          };
        }
      }

      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    };

  /**
   * Return true if we have the source content for every source in the source
   * map, false otherwise.
   */
  BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
    function BasicSourceMapConsumer_hasContentsOfAllSources() {
      if (!this.sourcesContent) {
        return false;
      }
      return this.sourcesContent.length >= this._sources.size() &&
        !this.sourcesContent.some(function (sc) { return sc == null; });
    };

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * availible.
   */
  BasicSourceMapConsumer.prototype.sourceContentFor =
    function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
      if (!this.sourcesContent) {
        return null;
      }

      if (this.sourceRoot != null) {
        aSource = util.relative(this.sourceRoot, aSource);
      }

      if (this._sources.has(aSource)) {
        return this.sourcesContent[this._sources.indexOf(aSource)];
      }

      var url;
      if (this.sourceRoot != null
          && (url = util.urlParse(this.sourceRoot))) {
        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
        // many users. We can help them out when they expect file:// URIs to
        // behave like it would if they were running a local HTTP server. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
        if (url.scheme == "file"
            && this._sources.has(fileUriAbsPath)) {
          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
        }

        if ((!url.path || url.path == "/")
            && this._sources.has("/" + aSource)) {
          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
        }
      }

      // This function is used recursively from
      // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
      // don't want to throw if we can't find the source - we just want to
      // return null, so we provide a flag to exit gracefully.
      if (nullOnMissing) {
        return null;
      }
      else {
        throw new Error('"' + aSource + '" is not in the SourceMap.');
      }
    };

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.
   *   - column: The column number in the original source.
   *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
   *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.
   *   - column: The column number in the generated source, or null.
   */
  BasicSourceMapConsumer.prototype.generatedPositionFor =
    function SourceMapConsumer_generatedPositionFor(aArgs) {
      var source = util.getArg(aArgs, 'source');
      if (this.sourceRoot != null) {
        source = util.relative(this.sourceRoot, source);
      }
      if (!this._sources.has(source)) {
        return {
          line: null,
          column: null,
          lastColumn: null
        };
      }
      source = this._sources.indexOf(source);

      var needle = {
        source: source,
        originalLine: util.getArg(aArgs, 'line'),
        originalColumn: util.getArg(aArgs, 'column')
      };

      var index = this._findMapping(
        needle,
        this._originalMappings,
        "originalLine",
        "originalColumn",
        util.compareByOriginalPositions,
        util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
      );

      if (index >= 0) {
        var mapping = this._originalMappings[index];

        if (mapping.source === needle.source) {
          return {
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          };
        }
      }

      return {
        line: null,
        column: null,
        lastColumn: null
      };
    };

  exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

  /**
   * An IndexedSourceMapConsumer instance represents a parsed source map which
   * we can query for information. It differs from BasicSourceMapConsumer in
   * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
   * input.
   *
   * The only parameter is a raw source map (either as a JSON string, or already
   * parsed to an object). According to the spec for indexed source maps, they
   * have the following attributes:
   *
   *   - version: Which version of the source map spec this map is following.
   *   - file: Optional. The generated file this source map is associated with.
   *   - sections: A list of section definitions.
   *
   * Each value under the "sections" field has two fields:
   *   - offset: The offset into the original specified at which this section
   *       begins to apply, defined as an object with a "line" and "column"
   *       field.
   *   - map: A source map definition. This source map could also be indexed,
   *       but doesn't have to be.
   *
   * Instead of the "map" field, it's also possible to have a "url" field
   * specifying a URL to retrieve a source map from, but that's currently
   * unsupported.
   *
   * Here's an example source map, taken from the source map spec[0], but
   * modified to omit a section which uses the "url" field.
   *
   *  {
   *    version : 3,
   *    file: "app.js",
   *    sections: [{
   *      offset: {line:100, column:10},
   *      map: {
   *        version : 3,
   *        file: "section.js",
   *        sources: ["foo.js", "bar.js"],
   *        names: ["src", "maps", "are", "fun"],
   *        mappings: "AAAA,E;;ABCDE;"
   *      }
   *    }],
   *  }
   *
   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
   */
  function IndexedSourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
    }

    var version = util.getArg(sourceMap, 'version');
    var sections = util.getArg(sourceMap, 'sections');

    if (version != this._version) {
      throw new Error('Unsupported version: ' + version);
    }

    this._sources = new ArraySet();
    this._names = new ArraySet();

    var lastOffset = {
      line: -1,
      column: 0
    };
    this._sections = sections.map(function (s) {
      if (s.url) {
        // The url field will require support for asynchronicity.
        // See https://github.com/mozilla/source-map/issues/16
        throw new Error('Support for url field in sections not implemented.');
      }
      var offset = util.getArg(s, 'offset');
      var offsetLine = util.getArg(offset, 'line');
      var offsetColumn = util.getArg(offset, 'column');

      if (offsetLine < lastOffset.line ||
          (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
        throw new Error('Section offsets must be ordered and non-overlapping.');
      }
      lastOffset = offset;

      return {
        generatedOffset: {
          // The offset fields are 0-based, but we use 1-based indices when
          // encoding/decoding from VLQ.
          generatedLine: offsetLine + 1,
          generatedColumn: offsetColumn + 1
        },
        consumer: new SourceMapConsumer(util.getArg(s, 'map'))
      }
    });
  }

  IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

  /**
   * The version of the source mapping spec that we are consuming.
   */
  IndexedSourceMapConsumer.prototype._version = 3;

  /**
   * The list of original sources.
   */
  Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
    get: function () {
      var sources = [];
      for (var i = 0; i < this._sections.length; i++) {
        for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
          sources.push(this._sections[i].consumer.sources[j]);
        }
      };
      return sources;
    }
  });

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.
   *   - column: The column number in the generated source.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.
   *   - column: The column number in the original source, or null.
   *   - name: The original identifier, or null.
   */
  IndexedSourceMapConsumer.prototype.originalPositionFor =
    function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, 'line'),
        generatedColumn: util.getArg(aArgs, 'column')
      };

      // Find the section containing the generated position we're trying to map
      // to an original position.
      var sectionIndex = binarySearch.search(needle, this._sections,
        function(needle, section) {
          var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
          if (cmp) {
            return cmp;
          }

          return (needle.generatedColumn -
                  section.generatedOffset.generatedColumn);
        });
      var section = this._sections[sectionIndex];

      if (!section) {
        return {
          source: null,
          line: null,
          column: null,
          name: null
        };
      }

      return section.consumer.originalPositionFor({
        line: needle.generatedLine -
          (section.generatedOffset.generatedLine - 1),
        column: needle.generatedColumn -
          (section.generatedOffset.generatedLine === needle.generatedLine
           ? section.generatedOffset.generatedColumn - 1
           : 0),
        bias: aArgs.bias
      });
    };

  /**
   * Return true if we have the source content for every source in the source
   * map, false otherwise.
   */
  IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
    function IndexedSourceMapConsumer_hasContentsOfAllSources() {
      return this._sections.every(function (s) {
        return s.consumer.hasContentsOfAllSources();
      });
    };

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * available.
   */
  IndexedSourceMapConsumer.prototype.sourceContentFor =
    function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];

        var content = section.consumer.sourceContentFor(aSource, true);
        if (content) {
          return content;
        }
      }
      if (nullOnMissing) {
        return null;
      }
      else {
        throw new Error('"' + aSource + '" is not in the SourceMap.');
      }
    };

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.
   *   - column: The column number in the original source.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.
   *   - column: The column number in the generated source, or null.
   */
  IndexedSourceMapConsumer.prototype.generatedPositionFor =
    function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];

        // Only consider this section if the requested source is in the list of
        // sources of the consumer.
        if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
          continue;
        }
        var generatedPosition = section.consumer.generatedPositionFor(aArgs);
        if (generatedPosition) {
          var ret = {
            line: generatedPosition.line +
              (section.generatedOffset.generatedLine - 1),
            column: generatedPosition.column +
              (section.generatedOffset.generatedLine === generatedPosition.line
               ? section.generatedOffset.generatedColumn - 1
               : 0)
          };
          return ret;
        }
      }

      return {
        line: null,
        column: null
      };
    };

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  IndexedSourceMapConsumer.prototype._parseMappings =
    function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      this.__generatedMappings = [];
      this.__originalMappings = [];
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];
        var sectionMappings = section.consumer._generatedMappings;
        for (var j = 0; j < sectionMappings.length; j++) {
          var mapping = sectionMappings[i];

          var source = section.consumer._sources.at(mapping.source);
          if (section.consumer.sourceRoot !== null) {
            source = util.join(section.consumer.sourceRoot, source);
          }
          this._sources.add(source);
          source = this._sources.indexOf(source);

          var name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);

          // The mappings coming from the consumer for the section have
          // generated positions relative to the start of the section, so we
          // need to offset them to be relative to the start of the concatenated
          // generated file.
          var adjustedMapping = {
            source: source,
            generatedLine: mapping.generatedLine +
              (section.generatedOffset.generatedLine - 1),
            generatedColumn: mapping.column +
              (section.generatedOffset.generatedLine === mapping.generatedLine)
              ? section.generatedOffset.generatedColumn - 1
              : 0,
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name: name
          };

          this.__generatedMappings.push(adjustedMapping);
          if (typeof adjustedMapping.originalLine === 'number') {
            this.__originalMappings.push(adjustedMapping);
          }
        };
      };

      quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
      quickSort(this.__originalMappings, util.compareByOriginalPositions);
    };

  exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

});
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define('source-map/binary-search', ['require', 'exports', 'module' , ], function(require, exports, module) {

  exports.GREATEST_LOWER_BOUND = 1;
  exports.LEAST_UPPER_BOUND = 2;

  /**
   * Recursive implementation of binary search.
   *
   * @param aLow Indices here and lower do not contain the needle.
   * @param aHigh Indices here and higher do not contain the needle.
   * @param aNeedle The element being searched for.
   * @param aHaystack The non-empty array being searched.
   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
   * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
   *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   */
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
    // This function terminates when one of the following is true:
    //
    //   1. We find the exact element we are looking for.
    //
    //   2. We did not find the exact element, but we can return the index of
    //      the next-closest element.
    //
    //   3. We did not find the exact element, and there is no next-closest
    //      element than the one we are searching for, so we return -1.
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid], true);
    if (cmp === 0) {
      // Found the element we are looking for.
      return mid;
    }
    else if (cmp > 0) {
      // Our needle is greater than aHaystack[mid].
      if (aHigh - mid > 1) {
        // The element is in the upper half.
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
      }

      // The exact needle element was not found in this haystack. Determine if
      // we are in termination case (3) or (2) and return the appropriate thing.
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return aHigh < aHaystack.length ? aHigh : -1;
      } else {
        return mid;
      }
    }
    else {
      // Our needle is less than aHaystack[mid].
      if (mid - aLow > 1) {
        // The element is in the lower half.
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
      }

      // we are in termination case (3) or (2) and return the appropriate thing.
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return mid;
      } else {
        return aLow < 0 ? -1 : aLow;
      }
    }
  }

  /**
   * This is an implementation of binary search which will always try and return
   * the index of the closest element if there is no exact hit. This is because
   * mappings between original and generated line/col pairs are single points,
   * and there is an implicit region between each of them, so a miss just means
   * that you aren't on the very start of a region.
   *
   * @param aNeedle The element you are looking for.
   * @param aHaystack The array that is being searched.
   * @param aCompare A function which takes the needle and an element in the
   *     array and returns -1, 0, or 1 depending on whether the needle is less
   *     than, equal to, or greater than the element, respectively.
   * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
   *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
   *     closest element that is smaller than or greater than the one we are
   *     searching for, respectively, if the exact element cannot be found.
   *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
   */
  exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
    if (aHaystack.length === 0) {
      return -1;
    }

    var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                                aCompare, aBias || exports.GREATEST_LOWER_BOUND);
    if (index < 0) {
      return -1;
    }

    // We have found either the exact element, or the next-closest element than
    // the one we are searching for. However, there may be more than one such
    // element. Make sure we always return the smallest of these.
    while (index - 1 >= 0) {
      if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
        break;
      }
      --index;
    }

    return index;
  };

});
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define('source-map/quick-sort', ['require', 'exports', 'module' , ], function(require, exports, module) {

  // It turns out that some (most?) JavaScript engines don't self-host
  // `Array.prototype.sort`. This makes sense because C++ will likely remain
  // faster than JS when doing raw CPU-intensive sorting. However, when using a
  // custom comparator function, calling back and forth between the VM's C++ and
  // JIT'd JS is rather slow *and* loses JIT type information, resulting in
  // worse generated code for the comparator function than would be optimal. In
  // fact, when sorting with a comparator, these costs outweigh the benefits of
  // sorting in C++. By using our own JS-implemented Quick Sort (below), we get
  // a ~3500ms mean speed-up in `bench/bench.html`.

  /**
   * Swap the elements indexed by `x` and `y` in the array `ary`.
   *
   * @param {Array} ary
   *        The array.
   * @param {Number} x
   *        The index of the first item.
   * @param {Number} y
   *        The index of the second item.
   */
  function swap(ary, x, y) {
    var temp = ary[x];
    ary[x] = ary[y];
    ary[y] = temp;
  }

  /**
   * Returns a random integer within the range `low .. high` inclusive.
   *
   * @param {Number} low
   *        The lower bound on the range.
   * @param {Number} high
   *        The upper bound on the range.
   */
  function randomIntInRange(low, high) {
    return Math.round(low + (Math.random() * (high - low)));
  }

  /**
   * The Quick Sort algorithm.
   *
   * @param {Array} ary
   *        An array to sort.
   * @param {function} comparator
   *        Function to use to compare two items.
   * @param {Number} p
   *        Start index of the array
   * @param {Number} r
   *        End index of the array
   */
  function doQuickSort(ary, comparator, p, r) {
    // If our lower bound is less than our upper bound, we (1) partition the
    // array into two pieces and (2) recurse on each half. If it is not, this is
    // the empty array and our base case.

    if (p < r) {
      // (1) Partitioning.
      //
      // The partitioning chooses a pivot between `p` and `r` and moves all
      // elements that are less than or equal to the pivot to the before it, and
      // all the elements that are greater than it after it. The effect is that
      // once partition is done, the pivot is in the exact place it will be when
      // the array is put in sorted order, and it will not need to be moved
      // again. This runs in O(n) time.

      // Always choose a random pivot so that an input array which is reverse
      // sorted does not cause O(n^2) running time.
      var pivotIndex = randomIntInRange(p, r);
      var i = p - 1;

      swap(ary, pivotIndex, r);
      var pivot = ary[r];

      // Immediately after `j` is incremented in this loop, the following hold
      // true:
      //
      //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
      //
      //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
      for (var j = p; j < r; j++) {
        if (comparator(ary[j], pivot) <= 0) {
          i += 1;
          swap(ary, i, j);
        }
      }

      swap(ary, i + 1, j);
      var q = i + 1;

      // (2) Recurse on each half.

      doQuickSort(ary, comparator, p, q - 1);
      doQuickSort(ary, comparator, q + 1, r);
    }
  }

  /**
   * Sort the given array in-place with the given comparator function.
   *
   * @param {Array} ary
   *        An array to sort.
   * @param {function} comparator
   *        Function to use to compare two items.
   */
  exports.quickSort = function (ary, comparator) {
    doQuickSort(ary, comparator, 0, ary.length - 1);
  };

});
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
define('source-map/source-node', ['require', 'exports', 'module' ,  'source-map/source-map-generator', 'source-map/util'], function(require, exports, module) {

  var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;
  var util = require('./util');

  // Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
  // operating systems these days (capturing the result).
  var REGEX_NEWLINE = /(\r?\n)/;

  // Newline character code for charCodeAt() comparisons
  var NEWLINE_CODE = 10;

  // Private symbol for identifying `SourceNode`s when multiple versions of
  // the source-map library are loaded. This MUST NOT CHANGE across
  // versions!
  var isSourceNode = "$$$isSourceNode$$$";

  /**
   * SourceNodes provide a way to abstract over interpolating/concatenating
   * snippets of generated JavaScript source code while maintaining the line and
   * column information associated with the original source code.
   *
   * @param aLine The original line number.
   * @param aColumn The original column number.
   * @param aSource The original source's filename.
   * @param aChunks Optional. An array of strings which are snippets of
   *        generated JS, or other SourceNodes.
   * @param aName The original identifier.
   */
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    this[isSourceNode] = true;
    if (aChunks != null) this.add(aChunks);
  }

  /**
   * Creates a SourceNode from generated code and a SourceMapConsumer.
   *
   * @param aGeneratedCode The generated code
   * @param aSourceMapConsumer The SourceMap for the generated code
   * @param aRelativePath Optional. The path that relative sources in the
   *        SourceMapConsumer should be relative to.
   */
  SourceNode.fromStringWithSourceMap =
    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
      // The SourceNode we want to fill with the generated code
      // and the SourceMap
      var node = new SourceNode();

      // All even indices of this array are one line of the generated code,
      // while all odd indices are the newlines between two adjacent lines
      // (since `REGEX_NEWLINE` captures its match).
      // Processed fragments are removed from this array, by calling `shiftNextLine`.
      var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
      var shiftNextLine = function() {
        var lineContents = remainingLines.shift();
        // The last line of a file might not have a newline.
        var newLine = remainingLines.shift() || "";
        return lineContents + newLine;
      };

      // We need to remember the position of "remainingLines"
      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

      // The generate SourceNodes we need a code range.
      // To extract it current and last mapping is used.
      // Here we store the last mapping.
      var lastMapping = null;

      aSourceMapConsumer.eachMapping(function (mapping) {
        if (lastMapping !== null) {
          // We add the code from "lastMapping" to "mapping":
          // First check if there is a new line in between.
          if (lastGeneratedLine < mapping.generatedLine) {
            var code = "";
            // Associate first line with "lastMapping"
            addMappingWithCode(lastMapping, shiftNextLine());
            lastGeneratedLine++;
            lastGeneratedColumn = 0;
            // The remaining code is added without mapping
          } else {
            // There is no new line in between.
            // Associate the code between "lastGeneratedColumn" and
            // "mapping.generatedColumn" with "lastMapping"
            var nextLine = remainingLines[0];
            var code = nextLine.substr(0, mapping.generatedColumn -
                                          lastGeneratedColumn);
            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
                                                lastGeneratedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
            addMappingWithCode(lastMapping, code);
            // No more remaining code, continue
            lastMapping = mapping;
            return;
          }
        }
        // We add the generated code until the first mapping
        // to the SourceNode without any mapping.
        // Each line is added as separate string.
        while (lastGeneratedLine < mapping.generatedLine) {
          node.add(shiftNextLine());
          lastGeneratedLine++;
        }
        if (lastGeneratedColumn < mapping.generatedColumn) {
          var nextLine = remainingLines[0];
          node.add(nextLine.substr(0, mapping.generatedColumn));
          remainingLines[0] = nextLine.substr(mapping.generatedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
        }
        lastMapping = mapping;
      }, this);
      // We have processed all mappings.
      if (remainingLines.length > 0) {
        if (lastMapping) {
          // Associate the remaining code in the current line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
        }
        // and add the remaining lines without any mapping
        node.add(remainingLines.join(""));
      }

      // Copy sourcesContent into SourceNode
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aRelativePath != null) {
            sourceFile = util.join(aRelativePath, sourceFile);
          }
          node.setSourceContent(sourceFile, content);
        }
      });

      return node;

      function addMappingWithCode(mapping, code) {
        if (mapping === null || mapping.source === undefined) {
          node.add(code);
        } else {
          var source = aRelativePath
            ? util.join(aRelativePath, mapping.source)
            : mapping.source;
          node.add(new SourceNode(mapping.originalLine,
                                  mapping.originalColumn,
                                  source,
                                  code,
                                  mapping.name));
        }
      }
    };

  /**
   * Add a chunk of generated JS to this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function (chunk) {
        this.add(chunk);
      }, this);
    }
    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Add a chunk of generated JS to the beginning of this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length-1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    }
    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Walk over the tree of JS snippets in this node and its children. The
   * walking function is called once for each snippet of JS and is passed that
   * snippet and the its original associated source's line/column location.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk[isSourceNode]) {
        chunk.walk(aFn);
      }
      else {
        if (chunk !== '') {
          aFn(chunk, { source: this.source,
                       line: this.line,
                       column: this.column,
                       name: this.name });
        }
      }
    }
  };

  /**
   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
   * each of `this.children`.
   *
   * @param aSep The separator.
   */
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len-1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };

  /**
   * Call String.prototype.replace on the very right-most source snippet. Useful
   * for trimming whitespace from the end of a source node, etc.
   *
   * @param aPattern The pattern to replace.
   * @param aReplacement The thing to replace the pattern with.
   */
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild[isSourceNode]) {
      lastChild.replaceRight(aPattern, aReplacement);
    }
    else if (typeof lastChild === 'string') {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    }
    else {
      this.children.push(''.replace(aPattern, aReplacement));
    }
    return this;
  };

  /**
   * Set the source content for a source file. This will be added to the SourceMapGenerator
   * in the sourcesContent field.
   *
   * @param aSourceFile The filename of the source file
   * @param aSourceContent The content of the source file
   */
  SourceNode.prototype.setSourceContent =
    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
    };

  /**
   * Walk over the tree of SourceNodes. The walking function is called for each
   * source file content and is passed the filename and source content.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walkSourceContents =
    function SourceNode_walkSourceContents(aFn) {
      for (var i = 0, len = this.children.length; i < len; i++) {
        if (this.children[i][isSourceNode]) {
          this.children[i].walkSourceContents(aFn);
        }
      }

      var sources = Object.keys(this.sourceContents);
      for (var i = 0, len = sources.length; i < len; i++) {
        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
      }
    };

  /**
   * Return the string representation of this source node. Walks over the tree
   * and concatenates all the various snippets together to one string.
   */
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function (chunk) {
      str += chunk;
    });
    return str;
  };

  /**
   * Returns the string representation of this source node along with a source
   * map.
   */
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function (chunk, original) {
      generated.code += chunk;
      if (original.source !== null
          && original.line !== null
          && original.column !== null) {
        if(lastOriginalSource !== original.source
           || lastOriginalLine !== original.line
           || lastOriginalColumn !== original.column
           || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      for (var idx = 0, length = chunk.length; idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++;
          generated.column = 0;
          // Mappings end at eol
          if (idx + 1 === length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      }
    });
    this.walkSourceContents(function (sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });

    return { code: generated.code, map: map };
  };

  exports.SourceNode = SourceNode;

});
/* -*- Mode: js; js-indent-level: 2; -*- */
///////////////////////////////////////////////////////////////////////////////

/*** COMMENTED BY TEDDY ***/
// this.define = define;
// this.require = require;
/**************************/

this.sourceMap = {
  SourceMapConsumer: require('source-map/source-map-consumer').SourceMapConsumer,
  SourceMapGenerator: require('source-map/source-map-generator').SourceMapGenerator,
  SourceNode: require('source-map/source-node').SourceNode
};
if (typeof module === "object" && module && module.exports) {
  module.exports = this.sourceMap;
}

}());
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

var EMBER_VERSIONS_SUPPORTED = ['0.0.0','2.7.0'];

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
    var triggerOnce = function() {
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
    window.addEventListener('Ember.Application', triggerOnce, false);
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

}('chrome', 'production'));
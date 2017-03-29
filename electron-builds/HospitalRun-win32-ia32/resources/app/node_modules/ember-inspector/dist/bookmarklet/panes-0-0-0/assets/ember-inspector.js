/* jshint ignore:start */

/* jshint ignore:end */

define('ember-inspector/adapters/basic', ['exports', 'ember', 'ember-inspector/config/environment'], function (exports, Ember, config) {

  'use strict';

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  /**
   * The adapter stores logic specific to each environment.
   * Extend this object with env specific code (such as chrome/firefox/test),
   * then set the application's `adapter` property to the name of this adapter.
   *
   * example:
   *
   * ```javascript
   * const EmberInspector = App.Create({
   *   adapter: 'chrome'
   * });
   * ```
   */
  var computed = Ember['default'].computed;
  var K = Ember['default'].K;

  exports['default'] = Ember['default'].Object.extend({
    /**
     * Called when the adapter is created (when
     * the inspector app boots).
     *
     * @method init
     */
    init: function init() {
      this._super.apply(this, arguments);
      this._checkVersion();
    },

    /**
     * Listens to `EmberInspectorDebugger` message about
     * Ember version mismatch. If a mismatch message is received
     * it means the current inspector app does not support the current
     * Ember version and needs to switch to an inspector version
     * that does.
     *
     * @method _checkVersion
     * @private
     */
    _checkVersion: function _checkVersion() {
      var _this = this;

      this.onMessageReceived(function (message) {
        var name = message.name;
        var version = message.version;

        if (name === 'version-mismatch') {
          var previousVersions = config['default'].previousEmberVersionsSupported;

          var _config$emberVersionsSupported = _slicedToArray(config['default'].emberVersionsSupported, 2);

          var fromVersion = _config$emberVersionsSupported[0];
          var tillVersion = _config$emberVersionsSupported[1];

          var neededVersion = undefined;

          if (compareVersion(version, fromVersion) === -1) {
            neededVersion = previousVersions[previousVersions.length - 1];
          } else if (tillVersion && compareVersion(version, tillVersion) !== -1) {
            neededVersion = tillVersion;
          } else {
            return;
          }
          _this.onVersionMismatch(neededVersion);
        }
      });
      this.sendMessage({ type: 'check-version', from: 'devtools' });
    },

    /**
     * Hook called when the Ember version is not
     * supported by the current inspector version.
     *
     * Each adapter should implement this hook
     * to switch to an older/new inspector version
     * that supports this Ember version.
     *
     * @method onVersionMismatch
     * @param {String} neededVersion (The version to go to)
     */
    onVersionMismatch: K,

    name: 'basic',

    /**
      Used to send messages to EmberDebug
       @param type {Object} the message to the send
    **/
    sendMessage: function sendMessage() {},

    /**
      Register functions to be called
      when a message from EmberDebug is received
    **/
    onMessageReceived: function onMessageReceived(callback) {
      this.get('_messageCallbacks').pushObject(callback);
    },

    _messageCallbacks: computed(function () {
      return [];
    }),

    _messageReceived: function _messageReceived(message) {
      this.get('_messageCallbacks').forEach(function (callback) {
        callback(message);
      });
    },

    // Called when the "Reload" is clicked by the user
    willReload: K,

    canOpenResource: false,
    openResource: function openResource() /* file, line */{}

  });

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

});
define('ember-inspector/adapters/bookmarklet', ['exports', 'ember-inspector/adapters/basic', 'ember'], function (exports, BasicAdapter, Ember) {

  'use strict';

  var computed = Ember['default'].computed;

  exports['default'] = BasicAdapter['default'].extend({
    name: 'bookmarklet',

    /**
     * Called when the adapter is created.
     *
     * @method init
     */
    init: function init() {
      this._connect();
      return this._super.apply(this, arguments);
    },

    inspectedWindow: computed(function () {
      return window.opener || window.parent;
    }),

    inspectedWindowURL: computed(function () {
      return loadPageVar('inspectedWindowURL');
    }),

    sendMessage: function sendMessage(options) {
      options = options || {};
      this.get('inspectedWindow').postMessage(options, this.get('inspectedWindowURL'));
    },

    /**
     * Redirect to the correct inspector version.
     *
     * @method onVersionMismatch
     * @param {String} goToVersion
     */
    onVersionMismatch: function onVersionMismatch(goToVersion) {
      this.sendMessage({ name: 'version-mismatch', version: goToVersion });
      window.location.href = '../panes-' + goToVersion.replace(/\./g, '-') + '/index.html' + window.location.search;
    },

    _connect: function _connect() {
      var _this = this;

      window.addEventListener('message', function (e) {
        var message = e.data;
        if (e.origin !== _this.get('inspectedWindowURL')) {
          return;
        }
        // close inspector if inspected window is unloading
        if (message && message.unloading) {
          window.close();
        }
        if (message.from === 'inspectedWindow') {
          _this._messageReceived(message);
        }
      });
    }
  });

  function loadPageVar(sVar) {
    return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  }

});
define('ember-inspector/adapters/chrome', ['exports', 'ember-inspector/adapters/basic', 'ember', 'ember-inspector/config/environment'], function (exports, BasicAdapter, Ember, config) {

  'use strict';

  /* globals chrome */
  var computed = Ember['default'].computed;

  var emberDebug = null;

  exports['default'] = BasicAdapter['default'].extend({
    /**
     * Called when the adapter is created.
     *
     * @method init
     */
    init: function init() {
      this._connect();
      this._handleReload();
      this._injectDebugger();
      return this._super.apply(this, arguments);
    },

    name: 'chrome',

    sendMessage: function sendMessage(options) {
      options = options || {};
      this.get('_chromePort').postMessage(options);
    },

    _chromePort: computed(function () {
      return chrome.extension.connect();
    }),

    _connect: function _connect() {
      var _this = this;

      var chromePort = this.get('_chromePort');
      chromePort.postMessage({ appId: chrome.devtools.inspectedWindow.tabId });

      chromePort.onMessage.addListener(function (message) {
        if (typeof message.type === 'string' && message.type === 'iframes') {
          sendIframes(message.urls);
        }
        _this._messageReceived(message);
      });
    },

    _handleReload: function _handleReload() {
      var self = this;
      chrome.devtools.network.onNavigated.addListener(function () {
        self._injectDebugger();
        location.reload(true);
      });
    },

    _injectDebugger: function _injectDebugger() {
      chrome.devtools.inspectedWindow.eval(loadEmberDebug());
      chrome.devtools.inspectedWindow.onResourceAdded.addListener(function (opts) {
        if (opts.type === 'document') {
          sendIframes([opts.url]);
        }
      });
    },

    willReload: function willReload() {
      this._injectDebugger();
    },

    /**
     * Redirect to the correct inspector version.
     *
     * @method onVersionMismatch
     * @param {String} goToVersion
     */
    onVersionMismatch: function onVersionMismatch(goToVersion) {
      window.location.href = '../panes-' + goToVersion.replace(/\./g, '-') + '/index.html';
    },

    /**
      We handle the reload here so we can inject
      scripts as soon as possible into the new page.
    */
    reloadTab: function reloadTab() {
      chrome.devtools.inspectedWindow.reload({
        injectedScript: loadEmberDebug()
      });
    },

    canOpenResource: true,

    openResource: function openResource(file, line) {
      /*global chrome */
      // For some reason it opens the line after the one specified
      chrome.devtools.panels.openResource(file, line - 1);
    }

  });

  function sendIframes(urls) {
    urls.forEach(function (url) {
      chrome.devtools.inspectedWindow.eval(loadEmberDebug(), { frameURL: url });
    });
  }

  function loadEmberDebug() {
    var minimumVersion = config['default'].emberVersionsSupported[0].replace(/\./g, '-');
    var xhr = undefined;
    if (!emberDebug) {
      xhr = new XMLHttpRequest();
      xhr.open("GET", chrome.extension.getURL('/panes-' + minimumVersion + '/ember_debug.js'), false);
      xhr.send();
      emberDebug = xhr.responseText;
    }
    return emberDebug;
  }

});
define('ember-inspector/adapters/firefox', ['exports', 'ember', 'ember-inspector/adapters/basic'], function (exports, Ember, BasicAdapter) {

  'use strict';

  exports['default'] = BasicAdapter['default'].extend({
    name: 'firefox',

    /**
     * Called when the adapter is created.
     *
     * @method init
     */
    init: function init() {
      this._connect();
      return this._super.apply(this, arguments);
    },

    sendMessage: function sendMessage(options) {
      options = options || {};
      window.parent.postMessage(options, "*");
    },

    /**
     * Redirects to the correct inspector version.
     * Also re-injects the correct EmberDebug version.
     *
     * @method onVersionMismatch
     * @param {String} goToVersion
     */
    onVersionMismatch: function onVersionMismatch(version) {
      this.sendMessage({ type: "injectEmberDebug", version: version });
      window.location.href = "../panes-" + version.replace(/\./g, '-') + "/index.html";
    },

    _connect: function _connect() {
      // NOTE: chrome adapter sends a appId message on connect (not needed on firefox)
      //this.sendMessage({ appId: "test" });
      this._onMessage = this._onMessage.bind(this);
      window.addEventListener("message", this._onMessage, false);
    },

    _onMessage: function _onMessage(evt) {
      if (this.isDestroyed || this.isDestroying) {
        window.removeEventListener("message", this._onMessage, false);
        return;
      }

      var message = evt.data;
      // check if the event is originated by our privileged ember inspector code
      if (evt.isTrusted) {
        if (typeof message.type === 'string' && message.type === 'iframes') {
          this._sendIframes(message.urls);
        } else {
          // We clone the object so that Ember prototype extensions
          // are applied.
          this._messageReceived(Ember['default'].$.extend(true, {}, message));
        }
      } else {
        console.log("EMBER INSPECTOR: ignored post message", evt);
      }
    },

    _sendIframes: function _sendIframes(urls) {
      var _this = this;

      urls.forEach(function (url) {
        _this.sendMessage({ type: 'injectEmberDebug', frameURL: url });
      });
    },

    canOpenResource: true,

    openResource: function openResource(file, line) {
      this.sendMessage({
        type: 'devtools:openSource',
        url: file,
        line: line
      });
    }

  });

});
define('ember-inspector/adapters/websocket', ['exports', 'ember', 'ember-inspector/adapters/basic'], function (exports, Ember, BasicAdapter) {

  'use strict';

  var computed = Ember['default'].computed;

  exports['default'] = BasicAdapter['default'].extend({
    init: function init() {
      this._super();
      this._connect();
    },

    sendMessage: function sendMessage(options) {
      options = options || {};
      this.get('socket').emit('emberInspectorMessage', options);
    },

    socket: computed(function () {
      return window.EMBER_INSPECTOR_CONFIG.remoteDebugSocket;
    }),

    _connect: function _connect() {
      var _this = this;

      this.get('socket').on('emberInspectorMessage', function (message) {
        Ember['default'].run(function () {
          _this._messageReceived(message);
        });
      });
    },

    _disconnect: function _disconnect() {
      this.get('socket').removeAllListeners("emberInspectorMessage");
    },

    willDestroy: function willDestroy() {
      this._disconnect();
    }
  });

});
define('ember-inspector/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'ember-inspector/config/environment', 'ember-inspector/port', 'ember-inspector/libs/promise-assembler', 'ember-inspector/helpers/ms-to-time'], function (exports, Ember, Resolver, loadInitializers, config, Port, PromiseAssembler, msToTime) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var version = '1.10.0';

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  config['default'].VERSION = version;

  // Register Helpers
  Ember['default'].Handlebars.helper('ms-to-time', msToTime['default']);

  // Inject adapter
  App.initializer({
    name: "extension-init",

    initialize: function initialize(container, app) {
      // bookmarklet is replaced by the build process.
      app.adapter = 'bookmarklet';

      // register and inject adapter
      var Adapter = undefined;
      if (Ember['default'].typeOf(app.adapter) === 'string') {
        Adapter = container.resolve('adapter:' + app.adapter);
      } else {
        Adapter = app.adapter;
      }
      container.register('adapter:main', Adapter);
      container.typeInjection('port', 'adapter', 'adapter:main');
      container.injection('route:application', 'adapter', 'adapter:main');
      container.injection('route:deprecations', 'adapter', 'adapter:main');
      container.injection('controller:deprecations', 'adapter', 'adapter:main');

      // register config
      container.register('config:main', config['default'], { instantiate: false });
      container.typeInjection('route', 'config', 'config:main');

      // inject port
      container.register('port:main', app.Port || Port['default']);
      container.typeInjection('controller', 'port', 'port:main');
      container.typeInjection('route', 'port', 'port:main');
      container.typeInjection('promise-assembler', 'port', 'port:main');

      // register and inject promise assembler
      container.register('promise-assembler:main', PromiseAssembler['default']);
      container.injection('route:promiseTree', 'assembler', 'promise-assembler:main');
    }
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('ember-inspector/components/action-checkbox', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Component = Ember['default'].Component;

  exports['default'] = Component.extend({
    tagName: 'input',
    attributeBindings: ['type', 'checked'],
    type: 'checkbox',

    checked: false,

    change: function change() {
      this._updateElementValue();
    },

    _updateElementValue: function _updateElementValue() {
      this.set('checked', this.$().prop('checked'));
      this.sendAction('on-update', this.get('checked'));
    }
  });

});
define('ember-inspector/components/clear-button', ['exports', 'ember-inspector/components/icon-button'], function (exports, IconButton) {

  'use strict';

  exports['default'] = IconButton['default'].extend({
    title: 'Clear'
  });

});
define('ember-inspector/components/date-property-field', ['exports', 'ember', 'ember-inspector/components/pikaday-input'], function (exports, Ember, DatePicker) {

  'use strict';

  var on = Ember['default'].on;
  var once = Ember['default'].run.once;

  var KEY_EVENTS = {
    enter: 13,
    escape: 27
  };

  exports['default'] = DatePicker['default'].extend({
    attributeBindings: ['label:data-label'],

    openDatePicker: on('didInsertElement', function () {
      once(this.$(), 'click');
    }),

    keyUp: function keyUp(e) {
      if (e.keyCode === KEY_EVENTS.enter) {
        this.insertNewline();
      } else if (e.keyCode === KEY_EVENTS.escape) {
        this.cancel();
      }
    },

    insertNewline: function insertNewline() {
      this.sendAction('save-property');
      this.sendAction('finished-editing');
    },

    cancel: function cancel() {
      this.sendAction('finished-editing');
    }
  });

});
define('ember-inspector/components/drag-handle', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var computed = Ember['default'].computed;
  var SafeString = Ember['default'].Handlebars.SafeString;

  exports['default'] = Ember['default'].Component.extend({
    classNames: ['drag-handle'],
    classNameBindings: ['isLeft:drag-handle--left', 'isRight:drag-handle--right', 'class'],
    attributeBindings: ['style'],
    position: 0,
    side: '',
    isRight: Ember['default'].computed.equal('side', 'right'),
    isLeft: Ember['default'].computed.equal('side', 'left'),
    minWidth: 60,

    startDragging: function startDragging() {
      var _this = this;

      var $container = this.$().parent();
      var $containerOffsetLeft = $container.offset().left;
      var $containerOffsetRight = $containerOffsetLeft + $container.width();
      var namespace = 'drag-' + this.get('elementId');

      this.sendAction('action', true);

      Ember['default'].$('body').on('mousemove.' + namespace, function (e) {
        var position = _this.get('isLeft') ? e.pageX - $containerOffsetLeft : $containerOffsetRight - e.pageX;

        if (position >= _this.get('minWidth')) {
          _this.set('position', position);
        }
      }).on('mouseup.' + namespace + ' mouseleave.' + namespace, function () {
        _this.stopDragging();
      });
    },

    stopDragging: function stopDragging() {
      this.sendAction('action', false);
      Ember['default'].$('body').off('.drag-' + this.get('elementId'));
    },

    willDestroyElement: function willDestroyElement() {
      this._super();
      this.stopDragging();
    },

    mouseDown: function mouseDown() {
      this.startDragging();
      return false;
    },

    style: computed('side', 'position', function () {
      if (this.get('side')) {
        return new SafeString(this.get('side') + ': ' + this.get('position') + 'px;');
      }
      return '';
    })
  });

});
define('ember-inspector/components/draggable-column', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  // DraggableColumn
  // ===============
  // A wrapper for a resizable-column and a drag-handle component

  var Component = Ember['default'].Component;
  var computed = Ember['default'].computed;

  exports['default'] = Component.extend({
    tagName: '', // Prevent wrapping in a div
    side: 'left',
    minWidth: 60,
    setIsDragging: 'setIsDragging',
    classes: computed('classNames.[]', function () {
      return this.get('classNames').join(' ');
    }),
    actions: {
      setIsDragging: function setIsDragging(isDragging) {
        this.sendAction('setIsDragging', isDragging);
      }
    }
  });

});
define('ember-inspector/components/icon-button', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Component = Ember['default'].Component;

  exports['default'] = Component.extend({
    attributeBindings: ['dataLabel:data-label', 'title'],

    tagName: 'button',

    title: null,

    click: function click() {
      this.sendAction();
    }
  });

});
define('ember-inspector/components/pikaday-input', ['exports', 'ember', 'ember-pikaday/components/pikaday-input'], function (exports, Ember, PikadayInputComponent) {

	'use strict';

	exports['default'] = PikadayInputComponent['default'];

});
define('ember-inspector/components/property-field', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].TextField.extend({
    attributeBindings: ['label:data-label'],

    didInsertElement: function didInsertElement() {
      this._super();
      this.$().select();
    },

    insertNewline: function insertNewline() {
      this.sendAction('save-property');
      this.sendAction('finished-editing');
    },

    cancel: function cancel() {
      this.sendAction('finished-editing');
    },

    focusOut: function focusOut() {
      this.sendAction('finished-editing');
    }
  });

});
define('ember-inspector/components/record-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Component = Ember['default'].Component;
  var computed = Ember['default'].computed;
  var SafeString = Ember['default'].Handlebars.SafeString;
  var isEmpty = Ember['default'].isEmpty;

  var COLOR_MAP = {
    red: '#ff2717',
    blue: '#174fff',
    green: '#006400'
  };

  exports['default'] = Component.extend({
    modelTypeColumns: null,

    classNames: ['list-tree__item', 'row', 'row_highlight'],

    attributeBindings: ['label:data-label'],

    label: 'record-row',

    // TODO: Color record based on `color` property.
    style: computed('model.color', function () {
      var colorName = this.get('model.color');
      if (!isEmpty(colorName)) {
        var color = COLOR_MAP[colorName];
        if (color) {
          return new SafeString('color: ' + color + ';');
        }
      }
      return '';
    }),

    columns: computed('modelTypeColumns.@each', 'model.columnValues', function () {
      var _this = this;

      var columns = this.get('modelTypeColumns') || [];
      return columns.map(function (col) {
        return { name: col.name, value: _this.get('model.columnValues.' + col.name) };
      });
    }),

    click: function click() {
      this.sendAction('inspect', this.get('model'));
      return false;
    }
  });

});
define('ember-inspector/components/reload-button', ['exports', 'ember-inspector/components/icon-button'], function (exports, IconButton) {

  'use strict';

  exports['default'] = IconButton['default'].extend({
    title: 'Reload'
  });

});
define('ember-inspector/components/resizable-column', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Component = Ember['default'].Component;
  var computed = Ember['default'].computed;
  var SafeString = Ember['default'].Handlebars.SafeString;

  exports['default'] = Component.extend({
    width: null,

    attributeBindings: ['style'],

    style: computed('width', function () {
      return new SafeString('-webkit-flex: none; flex: none; width: ' + this.get('width') + 'px;');
    }),

    didInsertElement: function didInsertElement() {
      if (!this.get('width')) {
        this.set('width', this.$().width());
      }
    }
  });

});
define('ember-inspector/components/route-item', ['exports', 'ember', 'ember-inspector/utils/check-current-route'], function (exports, Ember, checkCurrentRoute) {

  'use strict';

  var Component = Ember['default'].Component;
  var computed = Ember['default'].computed;
  var SafeString = Ember['default'].Handlebars.SafeString;

  exports['default'] = Component.extend({
    // passed as an attribute to the component
    currentRoute: null,

    classNames: ['list-tree__item', 'row'],
    classNameBindings: ['isCurrent:row_highlight'],
    attributeBindings: ['label:data-label'],

    label: 'route-node',

    labelStyle: computed('model.parentCount', function () {
      return new SafeString('padding-left: ' + (+this.get('model.parentCount') * 20 + 5) + 'px;');
    }),

    isCurrent: computed('currentRoute', 'model.value.name', function () {
      var currentRoute = this.get('currentRoute');
      if (!currentRoute) {
        return false;
      }

      return checkCurrentRoute['default'](currentRoute, this.get('model.value.name'));
    })
  });

});
define('ember-inspector/components/send-to-console', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: 'button',
    classNames: ['send-to-console'],
    attributeBindings: ['dataLabel:data-label'],
    dataLabel: 'send-to-console-btn',
    action: 'sendValueToConsole',
    click: function click() {
      this.sendAction('action', this.get('param'));
    }
  });

});
define('ember-inspector/components/sidebar-toggle', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    tagName: 'button',

    side: 'right',

    isExpanded: false,

    isRight: Ember['default'].computed.equal('side', 'right'),

    classNames: 'sidebar-toggle',

    classNameBindings: 'isRight:sidebar-toggle--right:sidebar-toggle--left',

    click: function click() {
      this.sendAction();
    }

  });

});
define('ember-inspector/components/view-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var computed = Ember['default'].computed;
  var Component = Ember['default'].Component;
  var SafeString = Ember['default'].Handlebars.SafeString;
  var not = computed.not;
  var bool = computed.bool;

  exports['default'] = Component.extend({
    classNames: ['list-tree__item', 'row'],

    classNameBindings: ['isCurrent:row_highlight'],

    hasView: not('model.value.isVirtual'),
    hasElement: not('model.value.isVirtual'),
    hasModel: bool('model.value.model'),

    // passed as an attribute
    pinnedObjectId: null,

    isCurrent: computed('pinnedObjectId', 'model.value.objectId', function () {
      return this.get('pinnedObjectId') === this.get('model.value.objectId');
    }),

    hasController: bool('model.value.controller'),

    modelInspectable: computed('hasModel', 'model.value.model.type', function () {
      return this.get('hasModel') && this.get('model.value.model.type') === 'type-ember-object';
    }),

    labelStyle: computed('model.parentCount', function () {
      return new SafeString('padding-left: ' + (+this.get('model.parentCount') * 20 + 5) + 'px;');
    }),

    actions: {
      inspectView: function inspectView() {
        if (this.get('hasView')) {
          this.sendAction('inspect', this.get('model.value.objectId'));
        }
      },
      inspectElement: function inspectElement(objectId) {
        if (!objectId && this.get('hasElement')) {
          objectId = this.get('model.value.objectId');
        }

        if (objectId) {
          this.sendAction('inspectElement', objectId);
        }
      },
      inspectModel: function inspectModel(objectId) {
        if (this.get('modelInspectable')) {
          this.sendAction('inspect', objectId);
        }
      }
    }

  });

});
define('ember-inspector/computed/custom-filter', ['exports', 'ember'], function (exports, Ember) {

  'use strict';


  exports['default'] = filterComputed;
  function filterComputed() {
    var dependentKeys = undefined,
        callback = undefined;

    if (arguments.length > 1) {
      var slice = [].slice;
      dependentKeys = slice.call(arguments, 0, -1);
      callback = slice.call(arguments, -1)[0];
    }
    var options = {
      initialize: function initialize(array, changeMeta, instanceMeta) {
        instanceMeta.filteredArrayIndexes = new Ember['default'].SubArray();
      },

      addedItem: function addedItem(array, item, changeMeta, instanceMeta) {
        var match = !!callback.call(this, item);
        var filterIndex = instanceMeta.filteredArrayIndexes.addItem(changeMeta.index, match);

        if (match) {
          array.insertAt(filterIndex, item);
        }

        return array;
      },

      removedItem: function removedItem(array, item, changeMeta, instanceMeta) {
        var filterIndex = instanceMeta.filteredArrayIndexes.removeItem(changeMeta.index);

        if (filterIndex > -1) {
          array.removeAt(filterIndex);
        }

        return array;
      }
    };
    var args = dependentKeys;
    args.push(options);

    /*jshint validthis:true */
    return Ember['default'].arrayComputed.apply(this, args);
  }

});
define('ember-inspector/computed/debounce', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var run = Ember['default'].run;
  var computed = Ember['default'].computed;
  var debounce = run.debounce;

  // Use this if you want a property to debounce
  // another property with a certain delay.
  // This means that every time this prop changes,
  // the other prop will change to the same val after [delay]
  exports['default'] = function (prop, delay, callback) {
    var value = undefined;

    var updateVal = function updateVal() {
      this.set(prop, value);
      if (callback) {
        callback.call(this);
      }
    };

    return computed(function (key, val) {
      if (arguments.length > 1) {
        value = val;
        debounce(this, updateVal, delay);
        return val;
      }
    });
  }

});
define('ember-inspector/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var _Ember$computed = Ember['default'].computed;
  var readOnly = _Ember$computed.readOnly;
  var equal = _Ember$computed.equal;

  exports['default'] = Ember['default'].Controller.extend({
    needs: ['mixin-stack', 'mixin-details'],

    emberApplication: false,
    navWidth: 180,
    inspectorWidth: 360,
    mixinStack: readOnly('controllers.mixin-stack'),
    mixinDetails: readOnly('controllers.mixin-details'),
    isChrome: equal('port.adapter.name', 'chrome'),

    deprecationCount: 0,

    // Indicates that the extension window is focused,
    active: true,

    inspectorExpanded: false,

    pushMixinDetails: function pushMixinDetails(name, property, objectId, details, errors) {
      details = {
        name: name,
        property: property,
        objectId: objectId,
        mixins: details,
        errors: errors
      };

      this.get('mixinStack').pushObject(details);
      this.set('mixinDetails.model', details);
    },

    popMixinDetails: function popMixinDetails() {
      var mixinStack = this.get('controllers.mixin-stack');
      var item = mixinStack.popObject();
      this.set('mixinDetails.model', mixinStack.get('lastObject'));
      this.get('port').send('objectInspector:releaseObject', { objectId: item.objectId });
    },

    activateMixinDetails: function activateMixinDetails(name, objectId, details, errors) {
      var _this = this;

      this.get('mixinStack').forEach(function (item) {
        _this.get('port').send('objectInspector:releaseObject', { objectId: item.objectId });
      });

      this.set('mixinStack.model', []);
      this.pushMixinDetails(name, undefined, objectId, details, errors);
    },

    droppedObject: function droppedObject(objectId) {
      var mixinStack = this.get('mixinStack.model');
      var obj = mixinStack.findProperty('objectId', objectId);
      if (obj) {
        var index = mixinStack.indexOf(obj);
        var objectsToRemove = [];
        for (var i = index; i >= 0; i--) {
          objectsToRemove.pushObject(mixinStack.objectAt(i));
        }
        objectsToRemove.forEach(function (item) {
          mixinStack.removeObject(item);
        });
      }
      if (mixinStack.get('length') > 0) {
        this.set('mixinDetails.model', mixinStack.get('lastObject'));
      } else {
        this.set('mixinDetails.model', null);
      }
    }
  });

});
define('ember-inspector/controllers/container-type', ['exports', 'ember', 'ember-inspector/computed/debounce', 'ember-inspector/utils/search-match'], function (exports, Ember, debounceComputed, searchMatch) {

  'use strict';

  var ArrayController = Ember['default'].ArrayController;
  var computed = Ember['default'].computed;
  var get = Ember['default'].get;
  var filter = computed.filter;

  exports['default'] = ArrayController.extend({
    needs: ['application'],
    sortProperties: ['name'],

    searchVal: debounceComputed['default']('search', 300),

    search: null,

    arrangedContent: filter('model', function (item) {
      return searchMatch['default'](get(item, 'name'), this.get('search'));
    }).property('model.@each.name', 'search')
  });

});
define('ember-inspector/controllers/container-types', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Controller = Ember['default'].Controller;
  var sort = Ember['default'].computed.sort;

  exports['default'] = Controller.extend({
    sortProperties: ['name'],
    sorted: sort('model', 'sortProperties')
  });

});
define('ember-inspector/controllers/deprecation-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Controller = Ember['default'].Controller;
  var computed = Ember['default'].computed;
  var notEmpty = computed.notEmpty;

  exports['default'] = Controller.extend({
    isExpanded: true,

    hasMap: notEmpty('model.hasSourceMap'),

    expandedClass: computed('hasMap', 'isExpanded', function () {
      if (this.get('isExpanded')) {
        return 'row_arrow_expanded';
      } else {
        return 'row_arrow_collapsed';
      }
    }),

    actions: {
      toggleExpand: function toggleExpand() {
        this.toggleProperty('isExpanded');
      }

    }
  });

});
define('ember-inspector/controllers/deprecation-source', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Controller = Ember['default'].Controller;
  var computed = Ember['default'].computed;
  var bool = computed.bool;
  var readOnly = computed.readOnly;
  var and = computed.and;

  exports['default'] = Controller.extend({
    known: bool('model.map.source'),

    url: computed('model.map.source', 'model.map.line', 'known', function () {
      var source = this.get('model.map.source');
      if (this.get('known')) {
        return source + ':' + this.get('model.map.line');
      } else {
        return 'Unkown source';
      }
    }),

    adapter: readOnly('port.adapter'),

    isClickable: and('known', 'adapter.canOpenResource')
  });

});
define('ember-inspector/controllers/deprecations', ['exports', 'ember', 'ember-inspector/computed/debounce', 'ember-inspector/utils/search-match'], function (exports, Ember, debounceComputed, searchMatch) {

  'use strict';

  var Controller = Ember['default'].Controller;
  var computed = Ember['default'].computed;
  var get = Ember['default'].get;
  var filter = computed.filter;

  exports['default'] = Controller.extend({
    needs: ['application'],
    search: null,
    searchVal: debounceComputed['default']('search', 300),
    filtered: filter('model', function (item) {
      return searchMatch['default'](get(item, 'message'), this.get('search'));
    }).property('model.@each.message', 'search')
  });

});
define('ember-inspector/controllers/iframes', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var ArrayController = Ember['default'].ArrayController;
  var computed = Ember['default'].computed;
  var run = Ember['default'].run;
  var observer = Ember['default'].observer;
  var alias = computed.alias;
  var map = computed.map;

  exports['default'] = ArrayController.extend({
    model: map('port.detectedApplications', function (item) {
      var name = item.split('__');
      return {
        name: name[1],
        val: item
      };
    }),

    selectedApp: alias('port.applicationId'),

    selectedDidChange: observer('selectedApp', function () {
      // Change iframe being debugged
      var url = '/';
      var applicationId = this.get('selectedApp');
      var list = this.get('port').get('detectedApplications');
      var app = this.container.lookup('application:main');

      run(app, app.reset);
      var router = app.__container__.lookup('router:main');
      var port = app.__container__.lookup('port:main');
      port.set('applicationId', applicationId);
      port.set('detectedApplications', list);

      // start
      router.location.setURL(url);
      run(app, app.handleURL, url);
    })
  });

});
define('ember-inspector/controllers/info', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var Controller = Ember['default'].Controller;

	exports['default'] = Controller;

});
define('ember-inspector/controllers/mixin-detail', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var computed = Ember['default'].computed;
  var oneWay = computed.oneWay;

  exports['default'] = Ember['default'].ObjectController.extend({
    needs: ['mixin-details'],

    mixinDetails: oneWay('controllers.mixin-details').readOnly(),
    objectId: oneWay('mixinDetails.model.objectId').readOnly(),

    isExpanded: computed('model.expand', 'model.properties.length', function () {
      return this.get('model.expand') && this.get('model.properties.length') > 0;
    }),

    actions: {
      calculate: function calculate(property) {
        var objectId = this.get('objectId');
        var mixinIndex = this.get('mixinDetails.model.mixins').indexOf(this.get('model'));

        this.get('port').send('objectInspector:calculate', {
          objectId: objectId,
          property: property.name,
          mixinIndex: mixinIndex
        });
      },

      sendToConsole: function sendToConsole(property) {
        var objectId = this.get('objectId');

        this.get('port').send('objectInspector:sendToConsole', {
          objectId: objectId,
          property: property.name
        });
      },

      toggleExpanded: function toggleExpanded() {
        this.toggleProperty('isExpanded');
      },

      digDeeper: function digDeeper(property) {
        var objectId = this.get('objectId');

        this.get('port').send('objectInspector:digDeeper', {
          objectId: objectId,
          property: property.name
        });
      },

      saveProperty: function saveProperty(prop, val, type) {
        var mixinIndex = this.get('mixinDetails.model.mixins').indexOf(this.get('model'));

        this.get('port').send('objectInspector:saveProperty', {
          objectId: this.get('objectId'),
          property: prop,
          value: val,
          mixinIndex: mixinIndex,
          dataType: type
        });
      }
    }
  });

});
define('ember-inspector/controllers/mixin-details', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Controller = Ember['default'].Controller;

  exports['default'] = Controller.extend({
    actions: {
      traceErrors: function traceErrors() {
        this.get('port').send('objectInspector:traceErrors', {
          objectId: this.get('model.objectId')
        });
      }
    }
  });

});
define('ember-inspector/controllers/mixin-property', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var computed = Ember['default'].computed;
  var equal = computed.equal;
  var alias = computed.alias;

  exports['default'] = Ember['default'].ObjectController.extend({
    isEdit: false,

    // Bound to editing textbox
    txtValue: null,
    dateValue: null,

    isCalculated: computed('value.type', function () {
      return this.get('value.type') !== 'type-descriptor';
    }),

    isEmberObject: equal('value.type', 'type-ember-object'),

    isComputedProperty: alias('value.computed'),

    isFunction: equal('value.type', 'type-function'),

    isArray: equal('value.type', 'type-array'),

    isDate: equal('value.type', 'type-date'),

    _parseTextValue: function _parseTextValue(value) {
      var parsedValue = undefined;
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        // if surrounded by quotes, remove quotes
        var match = value.match(/^"(.*)"$/);
        if (match && match.length > 1) {
          parsedValue = match[1];
        } else {
          parsedValue = value;
        }
      }
      return parsedValue;
    },

    actions: {
      valueClick: function valueClick() {
        if (this.get('isEmberObject') || this.get('isArray')) {
          this.get('target').send('digDeeper', this.get('model'));
          return;
        }

        if (this.get('isComputedProperty') && !this.get('isCalculated')) {
          this.get('target').send('calculate', this.get('model'));
          return;
        }

        if (this.get('isFunction') || this.get('overridden') || this.get('readOnly')) {
          return;
        }

        var value = this.get('value.inspect');
        var type = this.get('value.type');
        if (type === 'type-string') {
          value = '"' + value + '"';
        }
        if (!this.get('isDate')) {
          this.set('txtValue', value);
        } else {
          this.set('dateValue', new Date(value));
        }
        this.set('isEdit', true);
      },

      saveProperty: function saveProperty() {
        var realValue = undefined,
            dataType = undefined;
        if (!this.get('isDate')) {
          realValue = this._parseTextValue(this.get('txtValue'));
        } else {
          realValue = this.get('dateValue').getTime();
          dataType = 'date';
        }
        this.get('target').send('saveProperty', this.get('name'), realValue, dataType);
      },

      finishedEditing: function finishedEditing() {
        this.set('isEdit', false);
      }
    }
  });

});
define('ember-inspector/controllers/mixin-stack', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var computed = Ember['default'].computed;

  exports['default'] = Ember['default'].ArrayController.extend({
    needs: ['application'],

    trail: computed('[]', function () {
      var nested = this.slice(1);
      if (nested.length === 0) {
        return "";
      }
      return "." + nested.mapProperty('property').join(".");
    }),

    isNested: computed('[]', function () {
      return this.get('length') > 1;
    }),

    actions: {
      popStack: function popStack() {
        if (this.get('isNested')) {
          this.get('controllers.application').popMixinDetails();
        }
      },

      sendObjectToConsole: function sendObjectToConsole(obj) {
        var objectId = Ember['default'].get(obj, 'objectId');
        this.get('port').send('objectInspector:sendToConsole', {
          objectId: objectId
        });
      }
    }
  });

});
define('ember-inspector/controllers/model-type-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var computed = Ember['default'].computed;
  var oneWay = computed.oneWay;

  exports['default'] = Ember['default'].ObjectController.extend({
    needs: ['model-types'],

    modelTypes: oneWay('controllers.model-types').readOnly(),

    selected: computed('modelTypes.selected', function () {
      return this.get('model') === this.get('modelTypes.selected');
    })
  });

});
define('ember-inspector/controllers/model-types', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Controller = Ember['default'].Controller;
  var _Ember$computed = Ember['default'].computed;
  var sort = _Ember$computed.sort;
  var filter = _Ember$computed.filter;
  var get = Ember['default'].get;

  exports['default'] = Controller.extend({
    navWidth: 180,
    sortProperties: ['name'],
    options: {
      hideEmptyModelTypes: false
    },

    sorted: sort('filtered', 'sortProperties'),

    filtered: filter('model', function (typeItem) {
      var hideEmptyModels = get(this, 'options.hideEmptyModelTypes');

      if (hideEmptyModels) {
        return !!get(typeItem, 'count');
      } else {
        return true;
      }
    }).property('model', 'options.hideEmptyModelTypes')
  });

});
define('ember-inspector/controllers/promise-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var computed = Ember['default'].computed;
  var SafeString = Ember['default'].Handlebars.SafeString;
  var alias = computed.alias;
  var notEmpty = computed.notEmpty;
  var empty = computed.empty;
  var gt = computed.gt;
  var equal = computed.equal;

  var COLOR_MAP = {
    red: '#ff2717',
    blue: '#174fff',
    green: '#006400'
  };

  exports['default'] = Ember['default'].ObjectProxy.extend({
    promiseTreeController: computed(function () {
      return this.container.lookup('controller:promiseTree');
    }),

    filter: alias('promiseTreeController.filter'),
    effectiveSearch: alias('promiseTreeController.effectiveSearch'),

    model: alias('content'),

    isError: equal('reason.type', 'type-error'),

    style: computed('model.state', function () {
      var color = '';
      if (this.get('isFulfilled')) {
        color = 'green';
      } else if (this.get('isRejected')) {
        color = 'red';
      } else {
        color = 'blue';
      }
      return new SafeString('background-color: ' + COLOR_MAP[color] + '; color: white;');
    }),

    nodeStyle: computed('state', 'filter', 'effectiveSearch', function () {
      var relevant = undefined;
      switch (this.get('filter')) {
        case 'pending':
          relevant = this.get('isPending');
          break;
        case 'rejected':
          relevant = this.get('isRejected');
          break;
        case 'fulfilled':
          relevant = this.get('isFulfilled');
          break;
        default:
          relevant = true;
      }
      if (relevant && !Ember['default'].isEmpty(this.get('effectiveSearch'))) {
        relevant = this.get('model').matchesExactly(this.get('effectiveSearch'));
      }
      if (!relevant) {
        return new SafeString('opacity: 0.3;');
      }
    }),

    labelStyle: computed('level', function () {
      return new SafeString('padding-left: ' + (+this.get('level') * 20 + 5) + 'px;');
    }),

    expandedClass: computed('hasChildren', 'isExpanded', function () {
      if (!this.get('hasChildren')) {
        return;
      }

      if (this.get('isExpanded')) {
        return 'row_arrow_expanded';
      } else {
        return 'row_arrow_collapsed';
      }
    }),

    hasChildren: gt('children.length', 0),

    isTopNode: empty('parent'),

    settledValue: computed('value', function () {
      if (this.get('isFulfilled')) {
        return this.get('value');
      } else if (this.get('isRejected')) {
        return this.get('reason');
      } else {
        return '--';
      }
    }),

    isValueInspectable: notEmpty('settledValue.objectId'),

    hasValue: computed('settledValue', 'isSettled', function () {
      return this.get('isSettled') && this.get('settledValue.type') !== 'type-undefined';
    }),

    label: computed('model.label', function () {
      return this.get('model.label') || !!this.get('model.parent') && 'Then' || '<Unknown Promise>';
    }),

    state: computed('model.state', function () {
      if (this.get('isFulfilled')) {
        return 'Fulfilled';
      } else if (this.get('isRejected')) {
        return 'Rejected';
      } else if (this.get('parent') && !this.get('parent.isSettled')) {
        return 'Waiting for parent';
      } else {
        return 'Pending';
      }
    }),

    timeToSettle: computed('createdAt', 'settledAt', 'parent.settledAt', function () {
      if (!this.get('createdAt') || !this.get('settledAt')) {
        return ' -- ';
      }
      var startedAt = this.get('parent.settledAt') || this.get('createdAt');
      var remaining = this.get('settledAt').getTime() - startedAt.getTime();
      return remaining;
    })
  });

});
define('ember-inspector/controllers/promise-tree', ['exports', 'ember', 'ember-inspector/computed/custom-filter'], function (exports, Ember, filterComputed) {

  'use strict';

  var computed = Ember['default'].computed;
  var observer = Ember['default'].observer;
  var equal = computed.equal;
  var bool = computed.bool;
  var and = computed.and;
  var not = computed.not;

  // Manual implementation of item controllers
  function itemProxyComputed(dependentKey, itemProxy) {
    var options = {
      addedItem: function addedItem(array, item, changeMeta) {
        var proxy = itemProxy.create({ content: item });
        array.insertAt(changeMeta.index, proxy);
        return array;
      },
      removedItem: function removedItem(array, item, changeMeta) {
        var proxy = array.objectAt(changeMeta.index);
        array.removeAt(changeMeta.index, 1);
        proxy.destroy();
        return array;
      }
    };

    return Ember['default'].arrayComputed(dependentKey, options);
  }

  exports['default'] = Ember['default'].ArrayController.extend({
    needs: ['application'],

    queryParams: ['filter'],

    createdAfter: null,

    // below used to show the "refresh" message
    isEmpty: equal('model.length', 0),
    wasCleared: bool('createdAfter'),
    neverCleared: not('wasCleared'),
    shouldRefresh: and('isEmpty', 'neverCleared'),

    // Keep track of promise stack traces.
    // It is opt-in due to performance reasons.
    instrumentWithStack: false,

    init: function init() {
      this._super.apply(this, arguments);
      // List-view does not support item controllers
      this.reopen({
        items: itemProxyComputed('filtered', this.get('promiseItemController'))
      });
    },

    promiseItemController: computed(function () {
      return this.container.lookupFactory('controller:promise-item');
    }),

    /* jscs:disable validateIndentation */
    // TODO: This filter can be further optimized
    filtered: filterComputed['default']('model.@each.createdAt', 'model.@each.fulfilledBranch', 'model.@each.rejectedBranch', 'model.@each.pendingBranch', 'model.@each.isVisible', function (item) {

      // exclude cleared promises
      if (this.get('createdAfter') && item.get('createdAt') < this.get('createdAfter')) {
        return false;
      }

      if (!item.get('isVisible')) {
        return false;
      }

      // Exclude non-filter complying promises
      // If at least one of their children passes the filter,
      // then they pass
      var include = true;
      if (this.get('filter') === 'pending') {
        include = item.get('pendingBranch');
      } else if (this.get('filter') === 'rejected') {
        include = item.get('rejectedBranch');
      } else if (this.get('filter') === 'fulfilled') {
        include = item.get('fulfilledBranch');
      }
      if (!include) {
        return false;
      }

      // Search filter
      // If they or at least one of their children
      // match the search, then include them
      var search = this.get('effectiveSearch');
      if (!Ember['default'].isEmpty(search)) {
        return item.matches(search);
      }
      return true;
    }),
    /* jscs:enable validateIndentation */

    filter: 'all',

    noFilter: equal('filter', 'all'),
    isRejectedFilter: equal('filter', 'rejected'),
    isPendingFilter: equal('filter', 'pending'),
    isFulfilledFilter: equal('filter', 'fulfilled'),

    search: null,
    effectiveSearch: null,

    searchChanged: observer('search', function () {
      Ember['default'].run.debounce(this, this.notifyChange, 500);
    }),

    notifyChange: function notifyChange() {
      var self = this;
      this.set('effectiveSearch', this.get('search'));
      Ember['default'].run.next(function () {
        self.notifyPropertyChange('model');
      });
    },

    actions: {
      setFilter: function setFilter(filter) {
        var self = this;
        this.set('filter', filter);
        Ember['default'].run.next(function () {
          self.notifyPropertyChange('filtered');
        });
      },
      clear: function clear() {
        this.set('createdAfter', new Date());
        Ember['default'].run.once(this, this.notifyChange);
      },
      tracePromise: function tracePromise(promise) {
        this.get('port').send('promise:tracePromise', { promiseId: promise.get('guid') });
      },
      updateInstrumentWithStack: function updateInstrumentWithStack(bool) {
        this.port.send('promise:setInstrumentWithStack', { instrumentWithStack: bool });
      }
    }
  });

});
define('ember-inspector/controllers/record-filter', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var computed = Ember['default'].computed;

  exports['default'] = Ember['default'].ObjectController.extend({
    needs: ['records'],

    checked: computed('controllers.records.filterValue', function () {
      return this.get('controllers.records.filterValue') === this.get('name');
    })
  });

});
define('ember-inspector/controllers/records', ['exports', 'ember', 'ember-inspector/utils/escape-reg-exp'], function (exports, Ember, escapeRegExp) {

  'use strict';

  var Controller = Ember['default'].Controller;
  var computed = Ember['default'].computed;
  var observer = Ember['default'].observer;
  var none = computed.none;
  var alias = computed.alias;

  exports['default'] = Controller.extend({
    needs: ['application'],

    queryParams: ['filterValue', 'search'],

    columns: alias('modelType.columns'),

    search: '',
    filters: computed(function () {
      return [];
    }),
    filterValue: null,

    noFilterValue: none('filterValue'),

    actions: {
      setFilter: function setFilter(val) {
        val = val || null;
        this.set('filterValue', val);
      }
    },

    modelChanged: observer('model', function () {
      this.set('search', '');
    }),

    recordToString: function recordToString(record) {
      var search = '';
      var searchKeywords = Ember['default'].get(record, 'searchKeywords');
      if (searchKeywords) {
        search = Ember['default'].get(record, 'searchKeywords').join(' ');
      }
      return search.toLowerCase();
    },

    filtered: computed('search', 'model.@each.columnValues', 'model.@each.filterValues', 'filterValue', function () {
      var _this = this;

      var search = this.get('search'),
          filter = this.get('filterValue');
      return this.get('model').filter(function (item) {
        // check filters
        if (filter && !Ember['default'].get(item, 'filterValues.' + filter)) {
          return false;
        }

        // check search
        if (!Ember['default'].isEmpty(search)) {
          var searchString = _this.recordToString(item);
          return !!searchString.match(new RegExp('.*' + escapeRegExp['default'](search.toLowerCase()) + '.*'));
        }
        return true;
      });
    })
  });

});
define('ember-inspector/controllers/render-item', ['exports', 'ember', 'ember-inspector/utils/escape-reg-exp'], function (exports, Ember, escapeRegExp) {

  'use strict';

  var ObjectController = Ember['default'].ObjectController;
  var computed = Ember['default'].computed;
  var isEmpty = Ember['default'].isEmpty;
  var run = Ember['default'].run;
  var on = Ember['default'].on;
  var observer = Ember['default'].observer;
  var SafeString = Ember['default'].Handlebars.SafeString;
  var gt = computed.gt;
  var readOnly = computed.readOnly;
  var once = run.once;

  exports['default'] = ObjectController.extend({
    needs: ['render-tree'],

    search: readOnly('controllers.render-tree.search'),

    isExpanded: false,

    expand: function expand() {
      this.set('isExpanded', true);
    },

    searchChanged: on('init', observer('search', function () {
      var search = this.get('search');
      if (!isEmpty(search)) {
        once(this, 'expand');
      }
    })),

    searchMatch: computed('search', 'name', function () {
      var search = this.get('search');
      if (isEmpty(search)) {
        return true;
      }
      var name = this.get('name');
      var regExp = new RegExp(escapeRegExp['default'](search.toLowerCase()));
      return !!name.toLowerCase().match(regExp);
    }),

    nodeStyle: computed('searchMatch', function () {
      if (!this.get('searchMatch')) {
        return new SafeString('opacity: 0.5;');
      }
    }),

    level: computed('target.level', function () {
      var parentLevel = this.get('target.level');
      if (parentLevel === undefined) {
        parentLevel = -1;
      }
      return parentLevel + 1;
    }),

    nameStyle: computed('level', function () {
      return new SafeString("padding-left: " + (+this.get('level') * 20 + 5) + "px;");
    }),

    hasChildren: gt('children.length', 0),

    expandedClass: computed('hasChildren', 'isExpanded', function () {
      if (!this.get('hasChildren')) {
        return;
      }

      if (this.get('isExpanded')) {
        return 'row_arrow_expanded';
      } else {
        return 'row_arrow_collapsed';
      }
    }),

    readableTime: computed('timestamp', function () {
      var d = new Date(this.get('timestamp'));
      var ms = d.getMilliseconds();
      var seconds = d.getSeconds();
      var minutes = d.getMinutes().toString().length === 1 ? '0' + d.getMinutes() : d.getMinutes();
      var hours = d.getHours().toString().length === 1 ? '0' + d.getHours() : d.getHours();

      return hours + ':' + minutes + ':' + seconds + ':' + ms;
    }),

    actions: {
      toggleExpand: function toggleExpand() {
        this.toggleProperty('isExpanded');
      }
    }

  });

});
define('ember-inspector/controllers/render-tree', ['exports', 'ember', 'ember-inspector/utils/escape-reg-exp', 'ember-inspector/computed/debounce'], function (exports, Ember, escapeRegExp, debounceComputed) {

  'use strict';

  var computed = Ember['default'].computed;
  var isEmpty = Ember['default'].isEmpty;
  var Controller = Ember['default'].Controller;
  var and = computed.and;
  var equal = computed.equal;
  var filter = computed.filter;

  var get = Ember['default'].get;

  exports['default'] = Controller.extend({
    needs: ['application'],

    initialEmpty: false,
    modelEmpty: equal('model.length', 0),
    showEmpty: and('initialEmpty', 'modelEmpty'),

    // bound to the input field, updates the `search` property
    // 300ms after changing
    searchField: debounceComputed['default']('search', 300),

    // model filtered based on this value
    search: '',

    escapedSearch: computed('search', function () {
      return escapeRegExp['default'](this.get('search').toLowerCase());
    }),

    filtered: filter('model', function (item) {
      var search = this.get('escapedSearch');
      if (isEmpty(search)) {
        return true;
      }
      var regExp = new RegExp(search);
      return !!recursiveMatch(item, regExp);
    }).property('model.@each.name', 'search')
  });

  function recursiveMatch(item, regExp) {
    var children = undefined,
        child = undefined;
    var name = get(item, 'name');
    if (name.toLowerCase().match(regExp)) {
      return true;
    }
    children = get(item, 'children');
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (recursiveMatch(child, regExp)) {
        return true;
      }
    }
    return false;
  }

});
define('ember-inspector/controllers/route-tree', ['exports', 'ember', 'ember-inspector/utils/check-current-route'], function (exports, Ember, checkCurrentRoute) {

  'use strict';

  var Controller = Ember['default'].Controller;
  var computed = Ember['default'].computed;
  var filter = computed.filter;

  exports['default'] = Controller.extend({
    needs: ['application'],
    currentRoute: null,
    options: {
      hideRoutes: false
    },

    filtered: filter('content', function (routeItem) {
      var currentRoute = this.get('currentRoute');
      var hideRoutes = this.get('options.hideRoutes');

      if (hideRoutes && currentRoute) {
        return checkCurrentRoute['default'](currentRoute, routeItem.value.name);
      } else {
        return true;
      }
    }).property('content', 'options.hideRoutes', 'currentRoute')
  });

});
define('ember-inspector/controllers/view-tree', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var computed = Ember['default'].computed;
  var Controller = Ember['default'].Controller;
  var on = Ember['default'].on;
  var observer = Ember['default'].observer;
  var alias = computed.alias;

  exports['default'] = Controller.extend({
    needs: ['application'],
    pinnedObjectId: null,
    inspectingViews: false,
    queryParams: ['components', 'allViews'],
    components: alias('options.components'),
    allViews: alias('options.allViews'),
    options: {
      components: false,
      allViews: false
    },

    optionsChanged: on('init', observer('options.components', 'options.allViews', function () {
      this.port.send('view:setOptions', { options: this.get('options') });
    })),

    actions: {
      previewLayer: function previewLayer(node) {
        // We are passing both objectId and renderNodeId to support both pre-glimmer and post-glimmer
        this.get('port').send('view:previewLayer', { objectId: node.value.objectId, renderNodeId: node.value.renderNodeId });
      },

      hidePreview: function hidePreview() {
        this.get('port').send('view:hidePreview');
      },

      toggleViewInspection: function toggleViewInspection() {
        this.get('port').send('view:inspectViews', { inspect: !this.get('inspectingViews') });
      },

      sendModelToConsole: function sendModelToConsole(value) {
        // do not use `sendObjectToConsole` because models don't have to be ember objects
        this.get('port').send('view:sendModelToConsole', { viewId: value.objectId, renderNodeId: value.renderNodeId });
      },

      sendObjectToConsole: function sendObjectToConsole(objectId) {
        this.get('port').send('objectInspector:sendToConsole', { objectId: objectId });
      }
    }
  });

});
define('ember-inspector/helpers/ms-to-time', ['exports'], function (exports) {

  'use strict';

  exports['default'] = function (time) {
    if (time && !isNaN(+time)) {
      var formatted = time.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      return formatted + 'ms';
    }
  }

});
define('ember-inspector/initializers/app-version', ['exports', 'ember-inspector/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('ember-inspector/initializers/export-application-global', ['exports', 'ember', 'ember-inspector/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('ember-inspector/initializers/list-view-helper', ['exports', 'ember', 'ember-list-view/helper'], function (exports, Ember, helper) {

  'use strict';

  var initialize = helper.registerListViewHelpers;

  exports['default'] = {
    name: 'list-view-helper',
    initialize: helper.registerListViewHelpers
  };

  exports.initialize = initialize;

});
define('ember-inspector/libs/promise-assembler', ['exports', 'ember', 'ember-inspector/models/promise'], function (exports, Ember, Promise) {

  'use strict';

  var EventedMixin = Ember['default'].Evented;

  var arrayComputed = Ember['default'].computed(function () {
    return [];
  });

  var objectComputed = Ember['default'].computed(function () {
    return {};
  });

  exports['default'] = Ember['default'].Object.extend(EventedMixin, {
    all: arrayComputed,
    topSort: arrayComputed,
    topSortMeta: objectComputed,
    promiseIndex: objectComputed,

    // Used to track whether current message received
    // is the first in the request
    // Mainly helps in triggering 'firstMessageReceived' event
    firstMessageReceived: false,

    start: function start() {
      this.get('port').on('promise:promisesUpdated', this, this.addOrUpdatePromises);
      this.get('port').send('promise:getAndObservePromises');
    },

    stop: function stop() {
      this.get('port').off('promise:promisesUpdated', this, this.addOrUpdatePromises);
      this.get('port').send('promise:releasePromises');
      this.reset();
    },

    reset: function reset() {
      this.set('topSortMeta', {});
      this.set('promiseIndex', {});
      this.get('topSort').clear();

      this.set('firstMessageReceived', false);
      var all = this.get('all');
      // Lazily destroy promises
      // Allows for a smooth transition on deactivate,
      // and thus providing the illusion of better perf
      Ember['default'].run.later(this, function () {
        this.destroyPromises(all);
      }, 500);
      this.set('all', []);
    },

    destroyPromises: function destroyPromises(promises) {
      promises.forEach(function (item) {
        item.destroy();
      });
    },

    addOrUpdatePromises: function addOrUpdatePromises(message) {
      this.rebuildPromises(message.promises);

      if (!this.get('firstMessageReceived')) {
        this.set('firstMessageReceived', true);
        this.trigger('firstMessageReceived');
      }
    },

    rebuildPromises: function rebuildPromises(promises) {
      var _this = this;

      promises.forEach(function (props) {
        props = Ember['default'].copy(props);
        var childrenIds = props.children;
        var parentId = props.parent;
        delete props.children;
        delete props.parent;
        if (parentId && parentId !== props.guid) {
          props.parent = _this.updateOrCreate({ guid: parentId });
        }
        var promise = _this.updateOrCreate(props);
        if (childrenIds) {
          childrenIds.forEach(function (childId) {
            // avoid infinite recursion
            if (childId === props.guid) {
              return;
            }
            var child = _this.updateOrCreate({ guid: childId, parent: promise });
            promise.get('children').pushObject(child);
          });
        }
      });
    },

    updateTopSort: function updateTopSort(promise) {
      var topSortMeta = this.get('topSortMeta');
      var guid = promise.get('guid');
      var meta = topSortMeta[guid];
      var isNew = !meta;
      var hadParent = false;
      var hasParent = !!promise.get('parent');
      var topSort = this.get('topSort');
      var parentChanged = isNew;

      if (isNew) {
        meta = topSortMeta[guid] = {};
      } else {
        hadParent = meta.hasParent;
      }
      if (!isNew && hasParent !== hadParent) {
        // todo: implement recursion to reposition children
        topSort.removeObject(promise);
        parentChanged = true;
      }
      meta.hasParent = hasParent;
      if (parentChanged) {
        this.insertInTopSort(promise);
      }
    },

    insertInTopSort: function insertInTopSort(promise) {
      var _this2 = this;

      var topSort = this.get('topSort');
      if (promise.get('parent')) {
        var parentIndex = topSort.indexOf(promise.get('parent'));
        topSort.insertAt(parentIndex + 1, promise);
      } else {
        topSort.pushObject(promise);
      }
      promise.get('children').forEach(function (child) {
        topSort.removeObject(child);
        _this2.insertInTopSort(child);
      });
    },

    updateOrCreate: function updateOrCreate(props) {
      var guid = props.guid;
      var promise = this.findOrCreate(guid);

      promise.setProperties(props);

      this.updateTopSort(promise);

      return promise;
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
      if (!guid) {
        Ember['default'].assert('You have tried to findOrCreate without a guid');
      }
      return this.find(guid) || this.createPromise({
        guid: guid
      });
    }
  });

});
define('ember-inspector/mixins/fake-table', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  /* list-view comes with its own scrollbar
   * The header columns however are not inside list-view.  The scrollbar will
   * cause flexbox to fail to match header and content.
   * This is a hack to allow account for scrollbar width (if any)
   */
  var on = Ember['default'].on;

  function accountForScrollbar() {
    /*jshint validthis:true */
    var outside = this.$('.list-tree').innerWidth();
    var inside = this.$('.ember-list-container').innerWidth();
    this.$('.spacer').width(outside - inside);
  }

  exports['default'] = Ember['default'].Mixin.create({
    _accountForScrollbar: on('didInsertElement', function () {
      Ember['default'].run.scheduleOnce('afterRender', this, accountForScrollbar);
    })
  });

});
define('ember-inspector/models/promise', ['exports', 'ember', 'ember-inspector/utils/escape-reg-exp', 'ember-new-computed'], function (exports, Ember, escapeRegExp, computed) {

  'use strict';

  var $ = Ember['default'].$;
  var observer = Ember['default'].observer;
  var typeOf = Ember['default'].typeOf;
  var _Ember$computed = Ember['default'].computed;
  var or = _Ember$computed.or;
  var equal = _Ember$computed.equal;
  var not = _Ember$computed.not;

  var dateComputed = function dateComputed() {
    return computed['default']({
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

  exports['default'] = Ember['default'].Object.extend({
    createdAt: dateComputed(),
    settledAt: dateComputed(),

    parent: null,

    level: computed['default']('parent.level', function () {
      var parent = this.get('parent');
      if (!parent) {
        return 0;
      }
      return parent.get('level') + 1;
    }),

    isSettled: or('isFulfilled', 'isRejected'),

    isFulfilled: equal('state', 'fulfilled'),

    isRejected: equal('state', 'rejected'),

    isPending: not('isSettled'),

    children: computed['default'](function () {
      return [];
    }),

    pendingBranch: computed['default']('isPending', 'children.@each.pendingBranch', function () {
      return this.recursiveState('isPending', 'pendingBranch');
    }),

    rejectedBranch: computed['default']('isRejected', 'children.@each.rejectedBranch', function () {
      return this.recursiveState('isRejected', 'rejectedBranch');
    }),

    fulfilledBranch: computed['default']('isFulfilled', 'children.@each.fulfilledBranch', function () {
      return this.recursiveState('isFulfilled', 'fulfilledBranch');
    }),

    recursiveState: function recursiveState(prop, cp) {
      if (this.get(prop)) {
        return true;
      }
      for (var i = 0; i < this.get('children.length'); i++) {
        if (this.get('children').objectAt(i).get(cp)) {
          return true;
        }
      }
      return false;
    },

    // Need this observer because CP dependent keys do not support nested arrays
    // TODO: This can be so much better
    stateChanged: observer('pendingBranch', 'fulfilledBranch', 'rejectedBranch', function () {
      if (!this.get('parent')) {
        return;
      }
      if (this.get('pendingBranch') && !this.get('parent.pendingBranch')) {
        this.get('parent').notifyPropertyChange('fulfilledBranch');
        this.get('parent').notifyPropertyChange('rejectedBranch');
        this.get('parent').notifyPropertyChange('pendingBranch');
      } else if (this.get('fulfilledBranch') && !this.get('parent.fulfilledBranch')) {
        this.get('parent').notifyPropertyChange('fulfilledBranch');
        this.get('parent').notifyPropertyChange('rejectedBranch');
        this.get('parent').notifyPropertyChange('pendingBranch');
      } else if (this.get('rejectedBranch') && !this.get('parent.rejectedBranch')) {
        this.get('parent').notifyPropertyChange('fulfilledBranch');
        this.get('parent').notifyPropertyChange('rejectedBranch');
        this.get('parent').notifyPropertyChange('pendingBranch');
      }
    }),

    updateParentLabel: observer('label', 'parent', function () {
      this.addBranchLabel(this.get('label'), true);
    }),

    addBranchLabel: function addBranchLabel(label, replace) {
      if (Ember['default'].isEmpty(label)) {
        return;
      }
      if (replace) {
        this.set('branchLabel', label);
      } else {
        this.set('branchLabel', this.get('branchLabel') + ' ' + label);
      }

      var parent = this.get('parent');
      if (parent) {
        parent.addBranchLabel(label);
      }
    },

    branchLabel: '',

    matches: function matches(val) {
      return !!this.get('branchLabel').toLowerCase().match(new RegExp('.*' + escapeRegExp['default'](val.toLowerCase()) + '.*'));
    },

    matchesExactly: function matchesExactly(val) {
      return !!(this.get('label') || '').toLowerCase().match(new RegExp('.*' + escapeRegExp['default'](val.toLowerCase()) + '.*'));
    },

    // EXPANDED / COLLAPSED PROMISES

    isExpanded: false,

    isManuallyExpanded: undefined,

    stateOrParentChanged: observer('isPending', 'isFulfilled', 'isRejected', 'parent', function () {
      var parent = this.get('parent');
      if (parent) {
        Ember['default'].run.once(parent, 'recalculateExpanded');
      }
    }),

    _findTopParent: function _findTopParent() {
      var parent = this.get('parent');
      if (!parent) {
        return this;
      } else {
        return parent._findTopParent();
      }
    },

    recalculateExpanded: function recalculateExpanded() {
      var isExpanded = false;
      if (this.get('isManuallyExpanded') !== undefined) {
        isExpanded = this.get('isManuallyExpanded');
      } else {
        var children = this._allChildren();
        for (var i = 0, l = children.length; i < l; i++) {
          var child = children[i];
          if (child.get('isRejected')) {
            isExpanded = true;
          }
          if (child.get('isPending') && !child.get('parent.isPending')) {
            isExpanded = true;
          }
          if (isExpanded) {
            break;
          }
        }
        var parents = this._allParents();
        if (isExpanded) {
          parents.forEach(function (parent) {
            parent.set('isExpanded', true);
          });
        } else if (this.get('parent.isExpanded')) {
          this.get('parent').recalculateExpanded();
        }
      }
      this.set('isExpanded', isExpanded);
      return isExpanded;
    },

    isVisible: computed['default']('parent.isExpanded', 'parent', 'parent.isVisible', function () {
      if (this.get('parent')) {
        return this.get('parent.isExpanded') && this.get('parent.isVisible');
      }
      return true;
    }),

    _allChildren: function _allChildren() {
      var children = $.extend([], this.get('children'));
      children.forEach(function (item) {
        children = $.merge(children, item._allChildren());
      });
      return children;
    },

    _allParents: function _allParents() {
      var parent = this.get('parent');
      if (parent) {
        return $.merge([parent], parent._allParents());
      } else {
        return [];
      }
    }
  });

});
define('ember-inspector/port', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var computed = Ember['default'].computed;

  exports['default'] = Ember['default'].Object.extend(Ember['default'].Evented, {
    applicationId: undefined,

    detectedApplications: computed(function () {
      return [];
    }),

    init: function init() {
      var _this = this;

      var detectedApplications = this.get('detectedApplications');
      this.get('adapter').onMessageReceived(function (message) {
        if (!message.applicationId) {
          return;
        }
        if (!_this.get('applicationId')) {
          _this.set('applicationId', message.applicationId);
        }
        // save list of application ids
        if (detectedApplications.indexOf(message.applicationId) === -1) {
          detectedApplications.pushObject(message.applicationId);
        }

        var applicationId = _this.get('applicationId');
        if (applicationId === message.applicationId) {
          _this.trigger(message.type, message, applicationId);
        }
      });
    },
    send: function send(type, message) {
      message = message || {};
      message.type = type;
      message.from = 'devtools';
      message.applicationId = this.get('applicationId');
      this.get('adapter').sendMessage(message);
    }
  });

});
define('ember-inspector/router', ['exports', 'ember', 'ember-inspector/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.resource('app-detected', { path: '/' }, function () {
      this.resource('view-tree', { path: '/' });
      this.resource('route-tree');

      this.resource('data', function () {
        this.resource('model-types', function () {
          this.resource('model-type', { path: '/:type_id' }, function () {
            this.resource('records');
          });
        });
      });

      this.resource('promises', function () {
        this.resource('promise-tree');
      });

      this.resource('info');
      this.resource('render-tree');
      this.resource('container-types', function () {
        this.resource('container-type', { path: '/:type_id' });
      });

      this.resource('deprecations');
    });
  });

  exports['default'] = Router;

});
define('ember-inspector/routes/app-detected', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Route = Ember['default'].Route;
  var Promise = Ember['default'].RSVP.Promise;

  exports['default'] = Route.extend({
    model: function model() {
      var _this = this;

      var port = this.get('port');
      return new Promise(function (resolve) {
        port.on('general:applicationBooted', _this, function (message) {
          if (message.booted) {
            port.off('general:applicationBooted');
            resolve();
          }
        });
        port.send('general:applicationBooted');
      });
    },

    setupController: function setupController() {
      this.controllerFor('application').set('emberApplication', true);
      this.get('port').one('general:reset', this, this.reset);
    },

    reset: function reset() {
      this.container.lookup('application:main').reset();
    },

    deactivate: function deactivate() {
      this.get('port').off('general:applicationBooted');
      this.get('port').off('general:reset', this, this.reset);
    }
  });

});
define('ember-inspector/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Route = Ember['default'].Route;

  var set = Ember['default'].set;

  exports['default'] = Route.extend({

    setupController: function setupController() {
      this.controllerFor('mixinStack').set('model', []);
      var port = this.get('port');
      port.on('objectInspector:updateObject', this, this.updateObject);
      port.on('objectInspector:updateProperty', this, this.updateProperty);
      port.on('objectInspector:updateErrors', this, this.updateErrors);
      port.on('objectInspector:droppedObject', this, this.droppedObject);
      port.on('deprecation:count', this, this.setDeprecationCount);
      port.send('deprecation:getCount');
    },

    deactivate: function deactivate() {
      var port = this.get('port');
      port.off('objectInspector:updateObject', this, this.updateObject);
      port.off('objectInspector:updateProperty', this, this.updateProperty);
      port.off('objectInspector:updateErrors', this, this.updateErrors);
      port.off('objectInspector:droppedObject', this, this.droppedObject);
      port.off('deprecation:count', this, this.setDeprecationCount);
    },

    updateObject: function updateObject(options) {
      var details = options.details,
          name = options.name,
          property = options.property,
          objectId = options.objectId,
          errors = options.errors;

      Ember['default'].NativeArray.apply(details);
      details.forEach(arrayize);

      var controller = this.get('controller');

      if (options.parentObject) {
        controller.pushMixinDetails(name, property, objectId, details);
      } else {
        controller.activateMixinDetails(name, objectId, details, errors);
      }

      this.send('expandInspector');
    },

    setDeprecationCount: function setDeprecationCount(message) {
      this.controller.set('deprecationCount', message.count);
    },

    updateProperty: function updateProperty(options) {
      var detail = this.controllerFor('mixinDetails').get('model.mixins').objectAt(options.mixinIndex);
      var property = Ember['default'].get(detail, 'properties').findProperty('name', options.property);
      set(property, 'value', options.value);
    },

    updateErrors: function updateErrors(options) {
      var mixinDetails = this.controllerFor('mixinDetails');
      if (mixinDetails.get('model.objectId') === options.objectId) {
        mixinDetails.set('model.errors', options.errors);
      }
    },

    droppedObject: function droppedObject(message) {
      var controller = this.get('controller');
      controller.droppedObject(message.objectId);
    },

    actions: {
      expandInspector: function expandInspector() {
        this.set("controller.inspectorExpanded", true);
      },
      toggleInspector: function toggleInspector() {
        this.toggleProperty("controller.inspectorExpanded");
      },
      inspectObject: function inspectObject(objectId) {
        if (objectId) {
          this.get('port').send('objectInspector:inspectById', { objectId: objectId });
        }
      },
      setIsDragging: function setIsDragging(isDragging) {
        this.set('controller.isDragging', isDragging);
      },
      refreshPage: function refreshPage() {
        // If the adapter defined a `reloadTab` method, it means
        // they prefer to handle the reload themselves
        if (typeof this.get('adapter').reloadTab === 'function') {
          this.get('adapter').reloadTab();
        } else {
          // inject ember_debug as quickly as possible in chrome
          // so that promises created on dom ready are caught
          this.get('port').send('general:refresh');
          this.get('adapter').willReload();
        }
      }
    }
  });

  function arrayize(mixin) {
    Ember['default'].NativeArray.apply(mixin.properties);
  }

});
define('ember-inspector/routes/container-type', ['exports', 'ember', 'ember-inspector/routes/tab'], function (exports, Ember, TabRoute) {

  'use strict';

  var get = Ember['default'].get;
  var Promise = Ember['default'].RSVP.Promise;

  exports['default'] = TabRoute['default'].extend({
    setupController: function setupController(controller) {
      controller.setProperties({
        search: '',
        searchVal: ''
      });
      this._super.apply(this, arguments);
    },
    model: function model(params) {
      var type = params.type_id;
      var port = this.get('port');
      return new Promise(function (resolve, reject) {
        port.one('container:instances', function (message) {
          if (message.status === 200) {
            resolve(message.instances);
          } else {
            reject(message);
          }
        });
        port.send('container:getInstances', { containerType: type });
      });
    },

    actions: {
      error: function error(err) {
        if (err && err.status === 404) {
          this.transitionTo('container-types.index');
        }
      },
      inspectInstance: function inspectInstance(obj) {
        if (!get(obj, 'inspectable')) {
          return;
        }
        this.get('port').send('objectInspector:inspectByContainerLookup', { name: get(obj, 'fullName') });
      },
      sendInstanceToConsole: function sendInstanceToConsole(obj) {
        this.get('port').send('container:sendInstanceToConsole', { name: get(obj, 'fullName') });
      }
    }
  });

});
define('ember-inspector/routes/container-types', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Route = Ember['default'].Route;
  var Promise = Ember['default'].RSVP.Promise;

  exports['default'] = Route.extend({
    model: function model() {
      var port = this.get('port');
      return new Promise(function (resolve) {
        port.one('container:types', function (message) {
          resolve(message.types);
        });
        port.send('container:getTypes');
      });
    },
    actions: {
      reload: function reload() {
        this.refresh();
      }
    }
  });

});
define('ember-inspector/routes/container-types/index', ['exports', 'ember-inspector/routes/tab'], function (exports, TabRoute) {

	'use strict';

	exports['default'] = TabRoute['default'];

});
define('ember-inspector/routes/data/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Promise = Ember['default'].RSVP.Promise;

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      var route = this;
      return new Promise(function (resolve) {
        route.get('port').one('data:hasAdapter', function (message) {
          resolve(message.hasAdapter);
        });
        route.get('port').send('data:checkAdapter');
      });
    },
    afterModel: function afterModel(model) {
      if (model) {
        this.transitionTo('model-types');
      }
    }
  });

});
define('ember-inspector/routes/deprecations', ['exports', 'ember', 'ember-inspector/routes/tab'], function (exports, Ember, TabRoute) {

  'use strict';

  var set = Ember['default'].set;

  exports['default'] = TabRoute['default'].extend({
    setupController: function setupController() {
      var port = this.get('port');
      port.on('deprecation:deprecationsAdded', this, this.deprecationsAdded);
      port.send('deprecation:watch');
      this._super.apply(this, arguments);
    },

    model: function model() {
      return [];
    },

    deactivate: function deactivate() {
      this.get('port').off('deprecation:deprecationsAdded', this, this.deprecationsAdded);
    },

    deprecationsAdded: function deprecationsAdded(message) {
      var model = this.get('currentModel');
      message.deprecations.forEach(function (item) {
        var record = model.findBy('id', item.id);
        if (record) {
          set(record, 'count', item.count);
          set(record, 'sources', item.sources);
          set(record, 'url', item.url);
        } else {
          model.pushObject(item);
        }
      });
    },

    actions: {
      openResource: function openResource(item) {
        this.get('adapter').openResource(item.fullSource, item.line);
      },

      traceDeprecations: function traceDeprecations(deprecation) {
        this.get('port').send('deprecation:sendStackTraces', {
          deprecation: deprecation
        });
      },

      traceSource: function traceSource(deprecation, source) {
        this.get('port').send('deprecation:sendStackTraces', {
          deprecation: {
            message: deprecation.message,
            sources: [source]
          }
        });
      },

      clear: function clear() {
        this.get('port').send('deprecation:clear');
        this.get('currentModel').clear();
      }

    }
  });

});
define('ember-inspector/routes/info', ['exports', 'ember', 'ember-inspector/routes/tab'], function (exports, Ember, TabRoute) {

  'use strict';

  var Promise = Ember['default'].RSVP.Promise;
  var computed = Ember['default'].computed;
  var oneWay = computed.oneWay;

  exports['default'] = TabRoute['default'].extend({
    version: oneWay('config.VERSION').readOnly(),

    model: function model() {
      var version = this.get('version');
      var port = this.get('port');
      return new Promise(function (resolve) {
        port.one('general:libraries', function (message) {
          message.libraries.insertAt(0, {
            name: 'Ember Inspector',
            version: version
          });
          resolve(message.libraries);
        });
        port.send('general:getLibraries');
      });
    }
  });

});
define('ember-inspector/routes/model-type', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Promise = Ember['default'].RSVP.Promise;

  /*eslint camelcase: 0 */
  exports['default'] = Ember['default'].Route.extend({
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      this.controllerFor('model-types').set('selected', model);
    },

    model: function model(params) {
      var _this = this;

      return new Promise(function (resolve) {
        var type = _this.modelFor('model-types').findBy('name', params.type_id);
        if (type) {
          resolve(type);
        } else {
          _this.transitionTo('model-types.index');
        }
      });
    },

    deactivate: function deactivate() {
      this.controllerFor('model-types').set('selected', null);
    },

    serialize: function serialize(model) {
      return { type_id: Ember['default'].get(model, 'name') };
    }
  });

});
define('ember-inspector/routes/model-types', ['exports', 'ember', 'ember-inspector/routes/tab'], function (exports, Ember, TabRoute) {

  'use strict';

  var Promise = Ember['default'].RSVP.Promise;

  exports['default'] = TabRoute['default'].extend({
    setupController: function setupController(controller, model) {
      this._super(controller, model);
      this.get('port').on('data:modelTypesAdded', this, this.addModelTypes);
      this.get('port').on('data:modelTypesUpdated', this, this.updateModelTypes);
    },

    model: function model() {
      var port = this.get('port');
      return new Promise(function (resolve) {
        port.one('data:modelTypesAdded', this, function (message) {
          resolve(message.modelTypes);
        });
        port.send('data:getModelTypes');
      });
    },

    deactivate: function deactivate() {
      this.get('port').off('data:modelTypesAdded', this, this.addModelTypes);
      this.get('port').off('data:modelTypesUpdated', this, this.updateModelTypes);
      this.get('port').send('data:releaseModelTypes');
    },

    addModelTypes: function addModelTypes(message) {
      this.get('currentModel').pushObjects(message.modelTypes);
    },

    updateModelTypes: function updateModelTypes(message) {
      var route = this;
      message.modelTypes.forEach(function (modelType) {
        var currentType = route.get('currentModel').findProperty('objectId', modelType.objectId);
        Ember['default'].set(currentType, 'count', modelType.count);
      });
    }
  });

});
define('ember-inspector/routes/promise-tree', ['exports', 'ember', 'ember-inspector/routes/tab'], function (exports, Ember, TabRoute) {

  'use strict';

  var Promise = Ember['default'].RSVP.Promise;

  exports['default'] = TabRoute['default'].extend({
    model: function model() {
      var _this = this;

      // block rendering until first batch arrives
      // Helps prevent flashing of "please refresh the page"
      return new Promise(function (resolve) {
        _this.get('assembler').one('firstMessageReceived', function () {
          resolve(_this.get('assembler.topSort'));
        });
        _this.get('assembler').start();
      });
    },

    setupController: function setupController() {
      this._super.apply(this, arguments);
      this.get('port').on('promise:instrumentWithStack', this, this.setInstrumentWithStack);
      this.get('port').send('promise:getInstrumentWithStack');
    },

    setInstrumentWithStack: function setInstrumentWithStack(message) {
      this.set('controller.instrumentWithStack', message.instrumentWithStack);
    },

    deactivate: function deactivate() {
      this.get('assembler').stop();
      this.get('port').off('promse:getInstrumentWithStack', this, this.setInstrumentWithStack);
    },

    actions: {
      sendValueToConsole: function sendValueToConsole(promise) {
        this.get('port').send('promise:sendValueToConsole', { promiseId: promise.get('guid') });
      },

      toggleExpand: function toggleExpand(promise) {
        var isExpanded = !promise.get('isExpanded');
        promise.set('isManuallyExpanded', isExpanded);
        promise.recalculateExpanded();
        var children = promise._allChildren();
        if (isExpanded) {
          children.forEach(function (child) {
            var isManuallyExpanded = child.get('isManuallyExpanded');
            if (isManuallyExpanded === undefined) {
              child.set('isManuallyExpanded', isExpanded);
              child.recalculateExpanded();
            }
          });
        }
      }
    }
  });

});
define('ember-inspector/routes/promises/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var Promise = Ember['default'].RSVP.Promise;
  var Route = Ember['default'].Route;

  exports['default'] = Route.extend({
    beforeModel: function beforeModel() {
      var _this = this;

      return new Promise(function (resolve) {
        _this.get('port').one('promise:supported', function (message) {
          if (message.supported) {
            _this.transitionTo('promise-tree');
          } else {
            resolve();
          }
        });
        _this.get('port').send('promise:supported');
      });
    },

    renderTemplate: function renderTemplate() {
      this.render('promises.error');
    }
  });

});
define('ember-inspector/routes/records', ['exports', 'ember', 'ember-inspector/routes/tab'], function (exports, Ember, TabRoute) {

  'use strict';

  var set = Ember['default'].set;

  exports['default'] = TabRoute['default'].extend({
    setupController: function setupController(controller, model) {
      this._super(controller, model);

      var type = this.modelFor('model_type');

      controller.set('modelType', type);

      this.get('port').on('data:recordsAdded', this, this.addRecords);
      this.get('port').on('data:recordsUpdated', this, this.updateRecords);
      this.get('port').on('data:recordsRemoved', this, this.removeRecords);
      this.get('port').one('data:filters', this, function (message) {
        this.set('controller.filters', message.filters);
      });
      this.get('port').send('data:getFilters');
      this.get('port').send('data:getRecords', { objectId: type.objectId });
    },

    model: function model() {
      return [];
    },

    deactivate: function deactivate() {
      this.get('port').off('data:recordsAdded', this, this.addRecords);
      this.get('port').off('data:recordsUpdated', this, this.updateRecords);
      this.get('port').off('data:recordsRemoved', this, this.removeRecords);
      this.get('port').send('data:releaseRecords');
    },

    updateRecords: function updateRecords(message) {
      var _this = this;

      message.records.forEach(function (record) {
        var currentRecord = _this.get('currentModel').findProperty('objectId', record.objectId);
        if (currentRecord) {
          set(currentRecord, 'columnValues', record.columnValues);
          set(currentRecord, 'filterValues', record.filterValues);
          set(currentRecord, 'searchIndex', record.searchIndex);
          set(currentRecord, 'color', record.color);
        }
      });
    },

    addRecords: function addRecords(message) {
      this.get('currentModel').pushObjects(message.records);
    },

    removeRecords: function removeRecords(message) {
      this.get('currentModel').removeAt(message.index, message.count);
    },

    actions: {
      inspectModel: function inspectModel(model) {
        this.get('port').send('data:inspectModel', { objectId: Ember['default'].get(model, 'objectId') });
      }
    }
  });

});
define('ember-inspector/routes/render-tree', ['exports', 'ember', 'ember-inspector/routes/tab'], function (exports, Ember, TabRoute) {

  'use strict';

  var Promise = Ember['default'].RSVP.Promise;

  exports['default'] = TabRoute['default'].extend({
    model: function model() {
      var port = this.get('port');
      return new Promise(function (resolve) {
        port.one('render:profilesAdded', function (message) {
          resolve(message.profiles);
        });
        port.send('render:watchProfiles');
      });
    },

    setupController: function setupController(controller, model) {
      this._super.apply(this, arguments);
      if (model.length === 0) {
        controller.set('initialEmpty', true);
      }
      var port = this.get('port');
      port.on('render:profilesUpdated', this, this.profilesUpdated);
      port.on('render:profilesAdded', this, this.profilesAdded);
    },

    deactivate: function deactivate() {
      var port = this.get('port');
      port.off('render:profilesUpdated', this, this.profilesUpdated);
      port.off('render:profilesAdded', this, this.profilesAdded);
      port.send('render:releaseProfiles');
    },

    profilesUpdated: function profilesUpdated(message) {
      this.set('controller.model', message.profiles);
    },

    profilesAdded: function profilesAdded(message) {
      var model = this.get('controller.model');
      var profiles = message.profiles;

      model.pushObjects(profiles);
    },

    actions: {
      clearProfiles: function clearProfiles() {
        this.get('port').send('render:clear');
      }
    }

  });

});
define('ember-inspector/routes/route-tree', ['exports', 'ember', 'ember-inspector/routes/tab'], function (exports, Ember, TabRoute) {

  'use strict';

  var $ = Ember['default'].$;

  exports['default'] = TabRoute['default'].extend({
    setupController: function setupController() {
      this.get('port').on('route:currentRoute', this, this.setCurrentRoute);
      this.get('port').send('route:getCurrentRoute');
      this.get('port').on('route:routeTree', this, this.setTree);
      this.get('port').send('route:getTree');
    },

    deactivate: function deactivate() {
      this.get('port').off('route:currentRoute');
      this.get('port').off('route:routeTree', this, this.setTree);
    },

    setCurrentRoute: function setCurrentRoute(message) {
      this.get('controller').set('currentRoute', message.name);
    },

    setTree: function setTree(options) {
      var routeArray = topSort(options.tree);
      this.set('controller.model', routeArray);
    },

    actions: {
      inspectRoute: function inspectRoute(name) {
        this.get('port').send('objectInspector:inspectRoute', { name: name });
      },

      inspectController: function inspectController(controller) {
        if (!controller.exists) {
          return;
        }
        this.get('port').send('objectInspector:inspectController', { name: controller.name });
      },

      sendControllerToConsole: function sendControllerToConsole(controllerName) {
        this.get('port').send('objectInspector:sendControllerToConsole', { name: controllerName });
      },

      sendRouteHandlerToConsole: function sendRouteHandlerToConsole(routeName) {
        this.get('port').send('objectInspector:sendRouteHandlerToConsole', { name: routeName });
      }
    }
  });

  function topSort(tree, list) {
    list = list || [];
    var route = $.extend({}, tree);
    delete route.children;
    // Firt node in the tree doesn't have a value
    if (route.value) {
      route.parentCount = route.parentCount || 0;
      list.push(route);
    }
    tree.children = tree.children || [];
    tree.children.forEach(function (child) {
      child.parentCount = route.parentCount + 1;
      topSort(child, list);
    });
    return list;
  }

});
define('ember-inspector/routes/tab', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  /* eslint no-empty:0 */
  exports['default'] = Ember['default'].Route.extend({
    renderTemplate: function renderTemplate() {
      this.render();
      try {
        this.render(this.get('routeName').replace(/\./g, '/') + '-toolbar', {
          into: 'application',
          outlet: 'toolbar'
        });
      } catch (e) {}
    }
  });

});
define('ember-inspector/routes/view-tree', ['exports', 'ember', 'ember-inspector/routes/tab'], function (exports, Ember, TabRoute) {

  'use strict';

  var $ = Ember['default'].$;

  exports['default'] = TabRoute['default'].extend({
    model: function model() {
      return [];
    },

    setupController: function setupController() {
      this._super.apply(this, arguments);
      this.get('port').on('view:viewTree', this, this.setViewTree);
      this.get('port').on('view:stopInspecting', this, this.stopInspecting);
      this.get('port').on('view:startInspecting', this, this.startInspecting);
      this.get('port').on('view:pinView', this, this.pinView);
      this.get('port').on('view:unpinView', this, this.unpinView);
      this.get('port').send('view:getTree');
    },

    deactivate: function deactivate() {
      this.get('port').off('view:viewTree', this, this.setViewTree);
      this.get('port').off('view:stopInspecting', this, this.stopInspecting);
      this.get('port').off('view:startInspecting', this, this.startInspecting);
      this.get('port').off('view:pinView', this, this.pinView);
      this.get('port').off('view:unpinView', this, this.unpinView);
    },

    setViewTree: function setViewTree(options) {
      var viewArray = topSort(options.tree);
      this.set('controller.model', viewArray);
    },

    startInspecting: function startInspecting() {
      this.set('controller.inspectingViews', true);
    },

    stopInspecting: function stopInspecting() {
      this.set('controller.inspectingViews', false);
    },

    pinView: function pinView(message) {
      this.set('controller.pinnedObjectId', message.objectId);
    },

    unpinView: function unpinView() {
      this.set('controller.pinnedObjectId', null);
    },

    actions: {
      inspect: function inspect(objectId) {
        if (objectId) {
          this.get('port').send('objectInspector:inspectById', { objectId: objectId });
        }
      },
      inspectElement: function inspectElement(objectId) {
        this.get('port').send('view:inspectElement', { objectId: objectId });
      }
    }

  });

  function topSort(tree, list) {
    list = list || [];
    var view = $.extend({}, tree);
    view.parentCount = view.parentCount || 0;
    delete view.children;
    list.push(view);
    tree.children.forEach(function (child) {
      child.parentCount = view.parentCount + 1;
      topSort(child, list);
    });
    return list;
  }

});
define('ember-inspector/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, inline = hooks.inline;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
              inline(env, morph0, context, "render", ["mixinStack"], {});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            block(env, morph0, context, "draggable-column", [], {"side": "right", "width": get(env, context, "inspectorWidth"), "classNames": "split__panel"}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","split");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","split__panel");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
          var morph1 = dom.createMorphAt(element0,3,3);
          inline(env, morph0, context, "partial", ["main"], {});
          block(env, morph1, context, "if", [get(env, context, "inspectorExpanded")], {}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("    ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("li");
              var el2 = dom.createTextNode("You are using the file:// protocol (instead of http://), in which case:\n      ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("ul");
              var el3 = dom.createTextNode("\n        ");
              dom.appendChild(el2, el3);
              var el3 = dom.createElement("li");
              var el4 = dom.createTextNode("Visit the URL: chrome://extensions.");
              dom.appendChild(el3, el4);
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode("\n        ");
              dom.appendChild(el2, el3);
              var el3 = dom.createElement("li");
              var el4 = dom.createTextNode("Find the Ember Inspector.");
              dom.appendChild(el3, el4);
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode("\n        ");
              dom.appendChild(el2, el3);
              var el3 = dom.createElement("li");
              var el4 = dom.createTextNode("Make sure \"Allow access to file URLs\" is checked.");
              dom.appendChild(el3, el4);
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode("\n      ");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n    ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createTextNode("This is not an Ember application.");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createTextNode("You are using an old version of Ember (< rc5).");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,5,5,contextualElement);
            dom.insertBoundary(fragment, null);
            block(env, morph0, context, "if", [get(env, context, "isChrome")], {}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "not-detected", [], {"description": "Ember application"}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "emberApplication")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/clear-button', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"width","16px");
        dom.setAttribute(el1,"height","16px");
        dom.setAttribute(el1,"viewBox","0 0 16 16");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("g");
        dom.setAttribute(el2,"class","svg-stroke");
        dom.setAttribute(el2,"transform","translate(3.000000, 3.7500000)");
        dom.setAttribute(el2,"stroke","#000000");
        dom.setAttribute(el2,"stroke-width","2");
        dom.setAttribute(el2,"fill","none");
        dom.setAttribute(el2,"fill-rule","evenodd");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("circle");
        dom.setAttribute(el3,"cx","5.5");
        dom.setAttribute(el3,"cy","5.5");
        dom.setAttribute(el3,"r","5.5");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("path");
        dom.setAttribute(el3,"d","M1.98253524,1.98253524 L9,9");
        dom.setAttribute(el3,"id","Line");
        dom.setAttribute(el3,"stroke-linecap","square");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/drag-handle', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","drag-handle__border");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/draggable-column', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          content(env, morph0, context, "yield");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "resizable-column", [], {"width": get(env, context, "width"), "class": get(env, context, "classes")}, child0, null);
        inline(env, morph1, context, "drag-handle", [], {"side": get(env, context, "side"), "position": get(env, context, "width"), "minWidth": get(env, context, "minWidth"), "action": "setIsDragging"});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/expandable-render', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("-");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("+");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          dom.setAttribute(el1,"class","title");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","expander");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","duration");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, get = hooks.get, block = hooks.block, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element1 = dom.childAt(fragment, [0]);
          var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),0,0);
          var morph1 = dom.createMorphAt(element1,3,3);
          var morph2 = dom.createMorphAt(dom.childAt(element1, [5]),0,0);
          element(env, element1, context, "action", ["expand"], {});
          block(env, morph0, context, "if", [get(env, context, "expanded")], {}, child0, child1);
          inline(env, morph1, context, "unbound", [get(env, context, "node.name")], {});
          inline(env, morph2, context, "unbound", [get(env, context, "node.duration")], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","title");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode(" ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","duration");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element0,0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [2]),0,0);
          inline(env, morph0, context, "unbound", [get(env, context, "node.name")], {});
          inline(env, morph1, context, "unbound", [get(env, context, "node.duration")], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "node.children")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/not-detected', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          content(env, morph0, context, "reasonsTitle");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          Here are some common reasons this happens:\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","error-page");
        dom.setAttribute(el1,"data-label","error-page");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","error-page__content");
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","error-page__header");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","error-page__title");
        dom.setAttribute(el4,"data-label","error-page-title");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" not detected!");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","error-page__reasons");
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","error-page__reasons-title");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","error-page__list");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      If you're still having trouble, please file an issue on the Ember Inspector's\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://github.com/tildeio/ember-extension");
        dom.setAttribute(el4,"target","_blank");
        var el5 = dom.createTextNode("GitHub page.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        content(env, morph0, context, "description");
        block(env, morph1, context, "if", [get(env, context, "reasonsTitle")], {}, child0, child1);
        content(env, morph2, context, "yield");
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/property-field', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/record-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "yield", [get(env, context, "this")], {});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/reload-button', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el1 = dom.createElement("svg");
        dom.setAttribute(el1,"version","1.1");
        dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
        dom.setAttribute(el1,"x","0px");
        dom.setAttribute(el1,"y","0px");
        dom.setAttribute(el1,"width","14px");
        dom.setAttribute(el1,"height","14px");
        dom.setAttribute(el1,"viewBox","0 0 54.203 55.142");
        dom.setAttribute(el1,"enable-background","new 0 0 54.203 55.142");
        dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("path");
        dom.setAttribute(el2,"fill","#797979");
        dom.setAttribute(el2,"d","M54.203,21.472l-0.101-1.042h0.101c-0.042-0.159-0.101-0.311-0.146-0.468l-1.82-18.786l-6.056,6.055\n  C41.277,2.741,34.745,0,27.571,0C12.344,0,0,12.344,0,27.571s12.344,27.571,27.571,27.571c12.757,0,23.485-8.666,26.632-20.431\n  h-8.512c-2.851,7.228-9.881,12.349-18.12,12.349c-10.764,0-19.49-8.726-19.49-19.489s8.727-19.489,19.49-19.489\n  c4.942,0,9.441,1.853,12.873,4.887l-6.536,6.536L54.203,21.472z");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/route-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "yield", [get(env, context, "this")], {});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/send-to-console', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("img");
        dom.setAttribute(el1,"src","assets/images/send.png");
        dom.setAttribute(el1,"title","Send to console");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/sidebar-toggle', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            dom.setNamespace("http://www.w3.org/2000/svg");
            var el1 = dom.createElement("svg");
            dom.setAttribute(el1,"width","16px");
            dom.setAttribute(el1,"height","14px");
            dom.setAttribute(el1,"viewBox","0 0 16 14");
            dom.setAttribute(el1,"version","1.1");
            dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
            dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("title");
            var el3 = dom.createTextNode("Collapse Right Sidebar");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("g");
            dom.setAttribute(el2,"id","expand-sidebar-left");
            dom.setAttribute(el2,"stroke","none");
            dom.setAttribute(el2,"fill","none");
            dom.setAttribute(el2,"transform","translate(0,1)");
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("rect");
            dom.setAttribute(el3,"class","svg-stroke");
            dom.setAttribute(el3,"stroke","#000000");
            dom.setAttribute(el3,"x","0.5");
            dom.setAttribute(el3,"y","0.5");
            dom.setAttribute(el3,"width","14");
            dom.setAttribute(el3,"height","12");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("path");
            dom.setAttribute(el3,"class","svg-stroke");
            dom.setAttribute(el3,"shape-rendering","crispEdges");
            dom.setAttribute(el3,"d","M10.75,0 L10.75,12");
            dom.setAttribute(el3,"stroke","#000000");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("path");
            dom.setAttribute(el3,"class","svg-fill");
            dom.setAttribute(el3,"d","M6.25,4 L9.25,9.5 L3.25,9.5 L6.25,4 Z");
            dom.setAttribute(el3,"fill","#000");
            dom.setAttribute(el3,"transform","translate(6.250000, 6.500000) scale(-1, 1) rotate(-90.000000) translate(-6.250000, -6.500000) ");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            dom.setNamespace("http://www.w3.org/2000/svg");
            var el1 = dom.createElement("svg");
            dom.setAttribute(el1,"width","16px");
            dom.setAttribute(el1,"height","14px");
            dom.setAttribute(el1,"viewBox","0 0 16 14");
            dom.setAttribute(el1,"version","1.1");
            dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
            dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("title");
            var el3 = dom.createTextNode("Expand Right Sidebar");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("g");
            dom.setAttribute(el2,"id","expand-sidebar-left");
            dom.setAttribute(el2,"stroke","none");
            dom.setAttribute(el2,"fill","none");
            dom.setAttribute(el2,"transform","translate(0,1)");
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("rect");
            dom.setAttribute(el3,"class","svg-stroke");
            dom.setAttribute(el3,"stroke","#000000");
            dom.setAttribute(el3,"x","0.5");
            dom.setAttribute(el3,"y","0.5");
            dom.setAttribute(el3,"width","14");
            dom.setAttribute(el3,"height","12");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("path");
            dom.setAttribute(el3,"class","svg-stroke");
            dom.setAttribute(el3,"shape-rendering","crispEdges");
            dom.setAttribute(el3,"d","M10.75,0 L10.75,12");
            dom.setAttribute(el3,"stroke","#000000");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("path");
            dom.setAttribute(el3,"class","svg-fill");
            dom.setAttribute(el3,"d","M5.25,4 L8.25,9.25 L2.25,9.25 L5.25,4 L5.25,4 Z");
            dom.setAttribute(el3,"fill","#000000");
            dom.setAttribute(el3,"transform","translate(5.250000, 6.500000) rotate(-90.000000) translate(-5.250000, -6.500000)");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "if", [get(env, context, "isExpanded")], {}, child0, child1);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            dom.setNamespace("http://www.w3.org/2000/svg");
            var el1 = dom.createElement("svg");
            dom.setAttribute(el1,"width","16px");
            dom.setAttribute(el1,"height","14px");
            dom.setAttribute(el1,"viewBox","0 0 16 14");
            dom.setAttribute(el1,"version","1.1");
            dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
            dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("title");
            var el3 = dom.createTextNode("Collapse Left Sidebar");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("g");
            dom.setAttribute(el2,"id","expand-sidebar-left");
            dom.setAttribute(el2,"stroke","none");
            dom.setAttribute(el2,"fill","none");
            dom.setAttribute(el2,"transform","translate(8.000000, 8.000000) scale(-1, 1) translate(-8.000000, -7.000000)");
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("rect");
            dom.setAttribute(el3,"class","svg-stroke");
            dom.setAttribute(el3,"stroke","#000000");
            dom.setAttribute(el3,"x","0.5");
            dom.setAttribute(el3,"y","0.5");
            dom.setAttribute(el3,"width","14");
            dom.setAttribute(el3,"height","12");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("path");
            dom.setAttribute(el3,"class","svg-stroke");
            dom.setAttribute(el3,"shape-rendering","crispEdges");
            dom.setAttribute(el3,"d","M10.5,0 L10.5,12");
            dom.setAttribute(el3,"stroke","#000000");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("path");
            dom.setAttribute(el3,"class","svg-fill");
            dom.setAttribute(el3,"d","M6.25,4 L9.25,9.5 L3.25,9.5 L6.25,4 Z");
            dom.setAttribute(el3,"fill","#000");
            dom.setAttribute(el3,"transform","translate(6.250000, 6.500000) scale(-1, 1) rotate(-90.000000) translate(-6.250000, -6.500000) ");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            dom.setNamespace("http://www.w3.org/2000/svg");
            var el1 = dom.createElement("svg");
            dom.setAttribute(el1,"width","16px");
            dom.setAttribute(el1,"height","14px");
            dom.setAttribute(el1,"viewBox","0 0 16 14");
            dom.setAttribute(el1,"version","1.1");
            dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
            dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("title");
            var el3 = dom.createTextNode("Expand Left Sidebar");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("g");
            dom.setAttribute(el2,"id","expand-sidebar-left");
            dom.setAttribute(el2,"stroke","none");
            dom.setAttribute(el2,"fill","none");
            dom.setAttribute(el2,"transform","translate(8.000000, 8.000000) scale(-1, 1) translate(-8.000000, -7.000000)");
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("rect");
            dom.setAttribute(el3,"class","svg-stroke");
            dom.setAttribute(el3,"stroke","#000000");
            dom.setAttribute(el3,"x","0.5");
            dom.setAttribute(el3,"y","0.5");
            dom.setAttribute(el3,"width","14");
            dom.setAttribute(el3,"height","12");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("path");
            dom.setAttribute(el3,"class","svg-stroke");
            dom.setAttribute(el3,"shape-rendering","crispEdges");
            dom.setAttribute(el3,"d","M10.5,0 L10.5,12");
            dom.setAttribute(el3,"stroke","#000000");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("path");
            dom.setAttribute(el3,"class","svg-fill");
            dom.setAttribute(el3,"d","M5.25,4 L8.25,9.25 L2.25,9.25 L5.25,4 L5.25,4 Z");
            dom.setAttribute(el3,"fill","#000000");
            dom.setAttribute(el3,"transform","translate(5.250000, 6.500000) rotate(-90.000000) translate(-5.250000, -6.500000)");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n      ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "if", [get(env, context, "isExpanded")], {}, child0, child1);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "isRight")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/components/view-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "yield", [get(env, context, "this")], {});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/container-type-toolbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","toolbar");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","toolbar__search toolbar__search--small");
        dom.setAttribute(el2,"data-label","container-instance-search");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, get = hooks.get;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        inline(env, morph0, context, "reload-button", [], {"action": "reload", "classNames": "toolbar__icon-button", "dataLabel": "reload-container-btn"});
        inline(env, morph1, context, "input", [], {"value": get(env, context, "searchVal"), "placeholder": "Search"});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/container-type', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","list-view");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","list-view__header row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header");
        dom.setAttribute(el3,"data-label","column-title");
        var el4 = dom.createTextNode("Name");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Account for scrollbar width :'(  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header spacer");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","list-view__list-container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 3]),1,1);
        inline(env, morph0, context, "view", ["instanceList"], {"content": get(env, context, "this")});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/container-types', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("              ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("span");
              dom.setAttribute(el1,"data-label","container-type-name");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n              (");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("span");
              dom.setAttribute(el1,"data-label","container-type-count");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode(")\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
              var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
              content(env, morph0, context, "containerType.name");
              content(env, morph1, context, "containerType.count");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"data-label","container-type");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
            set(env, context, "containerType", blockArguments[0]);
            block(env, morph0, context, "link-to", ["container-type", get(env, context, "containerType.name")], {}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","split__panel__bd");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","nav__title");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("h3");
          var el4 = dom.createTextNode("Types");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 3]),1,1);
          block(env, morph0, context, "each", [get(env, context, "sorted")], {}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","split");
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","split__panel");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","split__panel__bd");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3, 1]),1,1);
        block(env, morph0, context, "draggable-column", [], {"width": 180, "classNames": "split__panel split__panel--sidebar-2 nav"}, child0, null);
        content(env, morph1, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/container-types/index-toolbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","toolbar");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        inline(env, morph0, context, "reload-button", [], {"action": "reload", "classNames": "toolbar__icon-button", "dataLabel": "reload-container-btn"});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/data', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/data/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("You are using an old version of Ember (< rc7).");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("You are using an old version of Ember Data (< 0.14).");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("You are using another persistence library, in which case:\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("li");
          var el4 = dom.createTextNode("Make sure the library has a data adapter.");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","data-error-page-container");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        block(env, morph0, context, "not-detected", [], {"description": "Data adapter"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/deprecations-toolbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","toolbar");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","toolbar__search");
        dom.setAttribute(el2,"data-label","promise-search");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, get = hooks.get;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        inline(env, morph0, context, "clear-button", [], {"action": "clear", "classNames": "toolbar__icon-button", "dataLabel": "clear-deprecations-btn"});
        inline(env, morph1, context, "input", [], {"value": get(env, context, "searchVal"), "placeholder": "Search"});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/deprecations', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("                ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("a");
              dom.setAttribute(el1,"class","external-link");
              dom.setAttribute(el1,"target","_blank");
              dom.setAttribute(el1,"title","Transition Plan");
              dom.setAttribute(el1,"data-label","deprecation-url");
              var el2 = dom.createTextNode("\n                  Transition Plan\n                ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, element = hooks.element;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element5 = dom.childAt(fragment, [1]);
              element(env, element5, context, "bind-attr", [], {"href": get(env, context, "item.model.url")});
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          var child0 = (function() {
            var child0 = (function() {
              var child0 = (function() {
                return {
                  isHTMLBars: true,
                  revision: "Ember@1.12.0",
                  blockParams: 0,
                  cachedFragment: null,
                  hasRendered: false,
                  build: function build(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createTextNode("                    ");
                    dom.appendChild(el0, el1);
                    var el1 = dom.createElement("a");
                    dom.setAttribute(el1,"data-label","deprecation-source-link");
                    dom.setAttribute(el1,"href","#");
                    var el2 = dom.createComment("");
                    dom.appendChild(el1, el2);
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode("\n");
                    dom.appendChild(el0, el1);
                    return el0;
                  },
                  render: function render(context, env, contextualElement) {
                    var dom = env.dom;
                    var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
                    dom.detectNamespace(contextualElement);
                    var fragment;
                    if (env.useFragmentCache && dom.canClone) {
                      if (this.cachedFragment === null) {
                        fragment = this.build(dom);
                        if (this.hasRendered) {
                          this.cachedFragment = fragment;
                        } else {
                          this.hasRendered = true;
                        }
                      }
                      if (this.cachedFragment) {
                        fragment = dom.cloneNode(this.cachedFragment, true);
                      }
                    } else {
                      fragment = this.build(dom);
                    }
                    var element2 = dom.childAt(fragment, [1]);
                    var morph0 = dom.createMorphAt(element2,0,0);
                    element(env, element2, context, "action", ["openResource", get(env, context, "source.model.map")], {});
                    content(env, morph0, context, "source.url");
                    return fragment;
                  }
                };
              }());
              var child1 = (function() {
                return {
                  isHTMLBars: true,
                  revision: "Ember@1.12.0",
                  blockParams: 0,
                  cachedFragment: null,
                  hasRendered: false,
                  build: function build(dom) {
                    var el0 = dom.createDocumentFragment();
                    var el1 = dom.createTextNode("                    ");
                    dom.appendChild(el0, el1);
                    var el1 = dom.createElement("span");
                    dom.setAttribute(el1,"data-label","deprecation-source-text");
                    var el2 = dom.createComment("");
                    dom.appendChild(el1, el2);
                    dom.appendChild(el0, el1);
                    var el1 = dom.createTextNode("\n");
                    dom.appendChild(el0, el1);
                    return el0;
                  },
                  render: function render(context, env, contextualElement) {
                    var dom = env.dom;
                    var hooks = env.hooks, content = hooks.content;
                    dom.detectNamespace(contextualElement);
                    var fragment;
                    if (env.useFragmentCache && dom.canClone) {
                      if (this.cachedFragment === null) {
                        fragment = this.build(dom);
                        if (this.hasRendered) {
                          this.cachedFragment = fragment;
                        } else {
                          this.hasRendered = true;
                        }
                      }
                      if (this.cachedFragment) {
                        fragment = dom.cloneNode(this.cachedFragment, true);
                      }
                    } else {
                      fragment = this.build(dom);
                    }
                    var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
                    content(env, morph0, context, "source.url");
                    return fragment;
                  }
                };
              }());
              return {
                isHTMLBars: true,
                revision: "Ember@1.12.0",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: false,
                build: function build(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("            ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createElement("div");
                  dom.setAttribute(el1,"class","list-tree__item-wrapper row-wrapper");
                  dom.setAttribute(el1,"data-label","deprecation-source");
                  var el2 = dom.createTextNode("\n              ");
                  dom.appendChild(el1, el2);
                  var el2 = dom.createElement("div");
                  dom.setAttribute(el2,"class","list-tree__item row");
                  var el3 = dom.createTextNode("\n                ");
                  dom.appendChild(el2, el3);
                  var el3 = dom.createElement("div");
                  dom.setAttribute(el3,"class","cell_type_main cell cell_size_larger");
                  dom.setAttribute(el3,"style","padding-left:48px");
                  var el4 = dom.createTextNode("\n                  ");
                  dom.appendChild(el3, el4);
                  var el4 = dom.createElement("span");
                  dom.setAttribute(el4,"class","source");
                  var el5 = dom.createTextNode("\n");
                  dom.appendChild(el4, el5);
                  var el5 = dom.createComment("");
                  dom.appendChild(el4, el5);
                  var el5 = dom.createTextNode("                  ");
                  dom.appendChild(el4, el5);
                  dom.appendChild(el3, el4);
                  var el4 = dom.createTextNode("\n                ");
                  dom.appendChild(el3, el4);
                  dom.appendChild(el2, el3);
                  var el3 = dom.createTextNode("\n                ");
                  dom.appendChild(el2, el3);
                  var el3 = dom.createElement("div");
                  dom.setAttribute(el3,"class","cell");
                  var el4 = dom.createTextNode("\n                     \n                  ");
                  dom.appendChild(el3, el4);
                  var el4 = dom.createElement("span");
                  dom.setAttribute(el4,"class","send-trace-to-console");
                  dom.setAttribute(el4,"title","Trace deprecations in console");
                  dom.setAttribute(el4,"data-label","trace-deprecations-btn");
                  var el5 = dom.createTextNode("\n                    Trace in the console\n                  ");
                  dom.appendChild(el4, el5);
                  dom.appendChild(el3, el4);
                  var el4 = dom.createTextNode("\n                ");
                  dom.appendChild(el3, el4);
                  dom.appendChild(el2, el3);
                  var el3 = dom.createTextNode("\n              ");
                  dom.appendChild(el2, el3);
                  dom.appendChild(el1, el2);
                  var el2 = dom.createTextNode("\n            ");
                  dom.appendChild(el1, el2);
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                render: function render(context, env, contextualElement) {
                  var dom = env.dom;
                  var hooks = env.hooks, get = hooks.get, block = hooks.block, element = hooks.element;
                  dom.detectNamespace(contextualElement);
                  var fragment;
                  if (env.useFragmentCache && dom.canClone) {
                    if (this.cachedFragment === null) {
                      fragment = this.build(dom);
                      if (this.hasRendered) {
                        this.cachedFragment = fragment;
                      } else {
                        this.hasRendered = true;
                      }
                    }
                    if (this.cachedFragment) {
                      fragment = dom.cloneNode(this.cachedFragment, true);
                    }
                  } else {
                    fragment = this.build(dom);
                  }
                  var element3 = dom.childAt(fragment, [1, 1]);
                  var element4 = dom.childAt(element3, [3, 1]);
                  var morph0 = dom.createMorphAt(dom.childAt(element3, [1, 1]),1,1);
                  block(env, morph0, context, "if", [get(env, context, "source.isClickable")], {}, child0, child1);
                  element(env, element4, context, "action", ["traceSource", get(env, context, "item"), get(env, context, "source")], {});
                  return fragment;
                }
              };
            }());
            return {
              isHTMLBars: true,
              revision: "Ember@1.12.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, get = hooks.get, block = hooks.block;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
                dom.insertBoundary(fragment, null);
                dom.insertBoundary(fragment, 0);
                block(env, morph0, context, "each", [get(env, context, "item.model.sources")], {"itemController": "deprecation-source", "keyword": "source"}, child0, null);
                return fragment;
              }
            };
          }());
          var child1 = (function() {
            return {
              isHTMLBars: true,
              revision: "Ember@1.12.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("          ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("div");
                dom.setAttribute(el1,"class","list-tree__item-wrapper row-wrapper");
                dom.setAttribute(el1,"data-label","deprecation-full-trace");
                var el2 = dom.createTextNode("\n            ");
                dom.appendChild(el1, el2);
                var el2 = dom.createElement("div");
                dom.setAttribute(el2,"class","list-tree__item row");
                var el3 = dom.createTextNode("\n              ");
                dom.appendChild(el2, el3);
                var el3 = dom.createElement("div");
                dom.setAttribute(el3,"class","cell_type_main cell cell_clickable");
                dom.setAttribute(el3,"style","padding-left:48px");
                var el4 = dom.createTextNode("\n                ");
                dom.appendChild(el3, el4);
                var el4 = dom.createElement("div");
                dom.setAttribute(el4,"class","send-trace-to-console");
                dom.setAttribute(el4,"title","Trace deprecations in console");
                dom.setAttribute(el4,"data-label","full-trace-deprecations-btn");
                var el5 = dom.createTextNode("\n                  Trace in the console\n                ");
                dom.appendChild(el4, el5);
                dom.appendChild(el3, el4);
                var el4 = dom.createTextNode("\n              ");
                dom.appendChild(el3, el4);
                dom.appendChild(el2, el3);
                var el3 = dom.createTextNode("\n            ");
                dom.appendChild(el2, el3);
                dom.appendChild(el1, el2);
                var el2 = dom.createTextNode("\n          ");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, get = hooks.get, element = hooks.element;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var element1 = dom.childAt(fragment, [1, 1, 1, 1]);
                element(env, element1, context, "action", ["traceDeprecations", get(env, context, "item")], {});
                return fragment;
              }
            };
          }());
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, block = hooks.block;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
              dom.insertBoundary(fragment, null);
              dom.insertBoundary(fragment, 0);
              block(env, morph0, context, "if", [get(env, context, "item.model.hasSourceMap")], {}, child0, child1);
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"data-label","deprecation-item");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2,"data-label","deprecation-row");
            dom.setAttribute(el2,"class","list-tree__item-wrapper row-wrapper");
            var el3 = dom.createTextNode("\n          ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("div");
            dom.setAttribute(el3,"class","list-tree__item row");
            var el4 = dom.createTextNode("\n\n            ");
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("div");
            dom.setAttribute(el4,"class","cell_type_main cell");
            dom.setAttribute(el4,"data-label","deprecation-main-cell");
            var el5 = dom.createTextNode("\n\n              ");
            dom.appendChild(el4, el5);
            var el5 = dom.createElement("span");
            var el6 = dom.createTextNode("\n                ");
            dom.appendChild(el5, el6);
            var el6 = dom.createElement("span");
            dom.setAttribute(el6,"class","cell__arrow");
            dom.appendChild(el5, el6);
            var el6 = dom.createTextNode("\n                ");
            dom.appendChild(el5, el6);
            var el6 = dom.createElement("span");
            dom.setAttribute(el6,"class","pill pill_not-clickable");
            dom.setAttribute(el6,"data-label","deprecation-count");
            var el7 = dom.createComment("");
            dom.appendChild(el6, el7);
            dom.appendChild(el5, el6);
            var el6 = dom.createTextNode("\n                ");
            dom.appendChild(el5, el6);
            var el6 = dom.createElement("span");
            dom.setAttribute(el6,"data-label","deprecation-message");
            dom.setAttribute(el6,"data-label","deprecation-message");
            var el7 = dom.createComment("");
            dom.appendChild(el6, el7);
            dom.appendChild(el5, el6);
            var el6 = dom.createTextNode("\n              ");
            dom.appendChild(el5, el6);
            dom.appendChild(el4, el5);
            var el5 = dom.createTextNode("\n");
            dom.appendChild(el4, el5);
            var el5 = dom.createComment("");
            dom.appendChild(el4, el5);
            var el5 = dom.createTextNode("            ");
            dom.appendChild(el4, el5);
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n          ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element6 = dom.childAt(fragment, [1]);
            var element7 = dom.childAt(element6, [1, 1, 1]);
            var element8 = dom.childAt(element7, [1]);
            var morph0 = dom.createMorphAt(dom.childAt(element8, [3]),0,0);
            var morph1 = dom.createMorphAt(dom.childAt(element8, [5]),0,0);
            var morph2 = dom.createMorphAt(element7,3,3);
            var morph3 = dom.createMorphAt(element6,3,3);
            element(env, element8, context, "bind-attr", [], {"title": "message", "class": "item.expandedClass"});
            element(env, element8, context, "action", ["toggleExpand"], {});
            content(env, morph0, context, "item.model.count");
            content(env, morph1, context, "item.model.message");
            block(env, morph2, context, "if", [get(env, context, "item.model.url")], {}, child0, null);
            block(env, morph3, context, "if", [get(env, context, "item.isExpanded")], {}, child1, null);
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("         ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","notice");
            dom.setAttribute(el1,"data-label","page-refresh");
            var el2 = dom.createTextNode("\n           ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("p");
            var el3 = dom.createTextNode("No deprecations have been detected. Try reloading to catch the deprecations that were logged before you opened the inspector.");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n           ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"data-label","page-refresh-btn");
            var el3 = dom.createTextNode("Reload");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n         ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1, 3]);
            element(env, element0, context, "action", ["refreshPage"], {});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "each", [get(env, context, "filtered")], {"itemController": "deprecation-item", "keyword": "item"}, child0, child1);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","list-view");
        dom.setAttribute(el1,"data-label","deprecations");
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","ember-list-container");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 1]),1,1);
        block(env, morph0, context, "view", ["render-list"], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/iframes', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","dropdown");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","dropdown__arrow");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        inline(env, morph0, context, "view", ["select"], {"content": get(env, context, "model"), "value": get(env, context, "selectedApp"), "optionValuePath": "content.val", "optionLabelPath": "content.name", "class": "dropdown__select"});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/info', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"data-label","library-row");
          dom.setAttribute(el1,"class","list-tree__item-wrapper row-wrapper");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","list-tree__item row");
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","cell_type_main cell cell_size_large");
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("span");
          dom.setAttribute(el4,"data-label","lib-name");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n              ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","cell");
          var el4 = dom.createTextNode("\n                ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("span");
          dom.setAttribute(el4,"data-label","lib-version");
          var el5 = dom.createComment("");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n              ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n            ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1, 1]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3, 1]),0,0);
          set(env, context, "library", blockArguments[0]);
          inline(env, morph0, context, "unbound", [get(env, context, "library.name")], {});
          inline(env, morph1, context, "unbound", [get(env, context, "library.version")], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","list-view");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","list-view__header row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header cell_size_large");
        var el4 = dom.createTextNode("\n      Library\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header");
        var el4 = dom.createTextNode("\n      Version\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Account for scrollbar width :'(  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header spacer");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","list-view__list-container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","list-tree");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","ember-list-container");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 3, 1, 1]),1,1);
        block(env, morph0, context, "each", [get(env, context, "model")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/instance-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","list-tree__item row");
        dom.setAttribute(el1,"data-label","instance-row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var morph0 = dom.createMorphAt(element1,1,1);
        element(env, element0, context, "action", ["inspectInstance", get(env, context, "this")], {});
        element(env, element1, context, "bind-attr", [], {"class": ":cell inspectable:cell_clickable"});
        content(env, morph0, context, "name");
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/loading', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/main', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","split__panel__hd");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","split__panel__bd");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","split__panel__ft");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          dom.setAttribute(el2,"target","_blank");
          dom.setAttribute(el2,"href","https://github.com/emberjs/ember-inspector/issues");
          var el3 = dom.createTextNode("\n        Submit an Issue\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
          inline(env, morph0, context, "render", ["iframes"], {});
          inline(env, morph1, context, "partial", ["nav"], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          inline(env, morph0, context, "sidebar-toggle", [], {"action": "toggleInspector", "side": "right", "isExpanded": false, "classNames": "toolbar__icon-button"});
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          content(env, morph0, context, "outlet");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","split split--main");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","split__panel");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","split__panel__hd");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element1, [1]);
        var morph0 = dom.createMorphAt(element0,1,1);
        var morph1 = dom.createMorphAt(element2,1,1);
        var morph2 = dom.createMorphAt(element2,3,3);
        var morph3 = dom.createMorphAt(element1,3,3);
        block(env, morph0, context, "draggable-column", [], {"width": get(env, context, "navWidth"), "classNames": "split__panel split__panel--sidebar-1"}, child0, null);
        inline(env, morph1, context, "outlet", ["toolbar"], {});
        block(env, morph2, context, "unless", [get(env, context, "inspectorExpanded")], {}, child1, null);
        block(env, morph3, context, "view", ["main-content"], {"classNames": "split__panel__bd"}, child2, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/mixin-details', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","mixin__error");
            dom.setAttribute(el1,"data-label","object-inspector-error");
            var el2 = dom.createTextNode("\n      Error while computing: ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
            set(env, context, "error", blockArguments[0]);
            content(env, morph0, context, "error.property");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","mixin mixin_props_no");
          dom.setAttribute(el1,"data-label","object-inspector-errors");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h2");
          dom.setAttribute(el2,"class","mixin__name mixin__name_errors");
          var el3 = dom.createTextNode("\n    Errors\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","send-trace-to-console");
          dom.setAttribute(el3,"data-label","send-errors-to-console");
          var el4 = dom.createTextNode("\n      Trace in the console\n    ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","mixin__properties");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element6 = dom.childAt(fragment, [0]);
          var element7 = dom.childAt(element6, [1, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(element6, [3]),1,1);
          element(env, element7, context, "action", ["traceErrors"], {});
          block(env, morph0, context, "each", [get(env, context, "model.errors")], {}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("h2");
            dom.setAttribute(el1,"class","mixin__name");
            dom.setAttribute(el1,"data-label","object-detail-name");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element4 = dom.childAt(fragment, [1]);
            var morph0 = dom.createMorphAt(element4,0,0);
            element(env, element4, context, "action", ["toggleExpanded"], {"target": "mixin"});
            content(env, morph0, context, "mixin.name");
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("h2");
            dom.setAttribute(el1,"class","mixin__name");
            dom.setAttribute(el1,"data-label","object-detail-name");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
            content(env, morph0, context, "mixin.name");
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        var child0 = (function() {
          var child0 = (function() {
            return {
              isHTMLBars: true,
              revision: "Ember@1.12.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("        ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("button");
                dom.setAttribute(el1,"data-label","calculate");
                var el2 = dom.createElement("img");
                dom.setAttribute(el2,"src","assets/images/calculate.svg");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, element = hooks.element, get = hooks.get;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var element1 = dom.childAt(fragment, [1]);
                element(env, element1, context, "bind-attr", [], {"class": ":mixin__calc-btn property.isCalculated:mixin__calc-btn_calculated"});
                element(env, element1, context, "action", ["calculate", get(env, context, "property.model")], {"bubbles": false});
                return fragment;
              }
            };
          }());
          var child1 = (function() {
            return {
              isHTMLBars: true,
              revision: "Ember@1.12.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("        ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("span");
                dom.setAttribute(el1,"class","pad");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                return fragment;
              }
            };
          }());
          var child2 = (function() {
            return {
              isHTMLBars: true,
              revision: "Ember@1.12.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("        ");
                dom.appendChild(el0, el1);
                var el1 = dom.createElement("span");
                dom.setAttribute(el1,"data-label","object-property-value");
                var el2 = dom.createComment("");
                dom.appendChild(el1, el2);
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var element0 = dom.childAt(fragment, [1]);
                var morph0 = dom.createMorphAt(element0,0,0);
                element(env, element0, context, "action", ["valueClick", get(env, context, "property.model")], {});
                element(env, element0, context, "bind-attr", [], {"class": "property.value.type :mixin__property-value"});
                content(env, morph0, context, "property.value.inspect");
                return fragment;
              }
            };
          }());
          var child3 = (function() {
            var child0 = (function() {
              return {
                isHTMLBars: true,
                revision: "Ember@1.12.0",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: false,
                build: function build(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("          ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createComment("");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                render: function render(context, env, contextualElement) {
                  var dom = env.dom;
                  var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
                  dom.detectNamespace(contextualElement);
                  var fragment;
                  if (env.useFragmentCache && dom.canClone) {
                    if (this.cachedFragment === null) {
                      fragment = this.build(dom);
                      if (this.hasRendered) {
                        this.cachedFragment = fragment;
                      } else {
                        this.hasRendered = true;
                      }
                    }
                    if (this.cachedFragment) {
                      fragment = dom.cloneNode(this.cachedFragment, true);
                    }
                  } else {
                    fragment = this.build(dom);
                  }
                  var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
                  inline(env, morph0, context, "property-field", [], {"value": get(env, context, "property.txtValue"), "finished-editing": "finishedEditing", "save-property": "saveProperty", "class": "mixin__property-value-txt", "label": "object-property-value-txt"});
                  return fragment;
                }
              };
            }());
            var child1 = (function() {
              return {
                isHTMLBars: true,
                revision: "Ember@1.12.0",
                blockParams: 0,
                cachedFragment: null,
                hasRendered: false,
                build: function build(dom) {
                  var el0 = dom.createDocumentFragment();
                  var el1 = dom.createTextNode("          ");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createComment("");
                  dom.appendChild(el0, el1);
                  var el1 = dom.createTextNode("\n");
                  dom.appendChild(el0, el1);
                  return el0;
                },
                render: function render(context, env, contextualElement) {
                  var dom = env.dom;
                  var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
                  dom.detectNamespace(contextualElement);
                  var fragment;
                  if (env.useFragmentCache && dom.canClone) {
                    if (this.cachedFragment === null) {
                      fragment = this.build(dom);
                      if (this.hasRendered) {
                        this.cachedFragment = fragment;
                      } else {
                        this.hasRendered = true;
                      }
                    }
                    if (this.cachedFragment) {
                      fragment = dom.cloneNode(this.cachedFragment, true);
                    }
                  } else {
                    fragment = this.build(dom);
                  }
                  var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
                  inline(env, morph0, context, "date-property-field", [], {"value": get(env, context, "property.dateValue"), "format": "YYYY-MM-DD", "finished-editing": "finishedEditing", "save-property": "saveProperty", "class": "mixin__property-value-txt", "label": "object-property-value-date"});
                  return fragment;
                }
              };
            }());
            return {
              isHTMLBars: true,
              revision: "Ember@1.12.0",
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createComment("");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, get = hooks.get, block = hooks.block;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (env.useFragmentCache && dom.canClone) {
                  if (this.cachedFragment === null) {
                    fragment = this.build(dom);
                    if (this.hasRendered) {
                      this.cachedFragment = fragment;
                    } else {
                      this.hasRendered = true;
                    }
                  }
                  if (this.cachedFragment) {
                    fragment = dom.cloneNode(this.cachedFragment, true);
                  }
                } else {
                  fragment = this.build(dom);
                }
                var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
                dom.insertBoundary(fragment, null);
                dom.insertBoundary(fragment, 0);
                block(env, morph0, context, "unless", [get(env, context, "property.isDate")], {}, child0, child1);
                return fragment;
              }
            };
          }());
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 1,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("    ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("li");
              dom.setAttribute(el1,"data-label","object-property");
              var el2 = dom.createTextNode("\n");
              dom.appendChild(el1, el2);
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("      ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("span");
              dom.setAttribute(el2,"class","mixin__property-name");
              dom.setAttribute(el2,"data-label","object-property-name");
              var el3 = dom.createComment("");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("span");
              dom.setAttribute(el2,"class","mixin__property-value-separator");
              var el3 = dom.createTextNode(": ");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n");
              dom.appendChild(el1, el2);
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("      ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("span");
              dom.setAttribute(el2,"class","mixin__property-overridden-by");
              var el3 = dom.createTextNode("(Overridden by ");
              dom.appendChild(el2, el3);
              var el3 = dom.createComment("");
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode(")");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n      ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("button");
              dom.setAttribute(el2,"class","mixin__send-btn");
              dom.setAttribute(el2,"data-label","send-to-console-btn");
              var el3 = dom.createElement("img");
              dom.setAttribute(el3,"src","assets/images/send.png");
              dom.setAttribute(el3,"title","Send to console");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n    ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement, blockArguments) {
              var dom = env.dom;
              var hooks = env.hooks, set = hooks.set, element = hooks.element, get = hooks.get, block = hooks.block, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var element2 = dom.childAt(fragment, [1]);
              var element3 = dom.childAt(element2, [10]);
              var morph0 = dom.createMorphAt(element2,1,1);
              var morph1 = dom.createMorphAt(dom.childAt(element2, [3]),0,0);
              var morph2 = dom.createMorphAt(element2,6,6);
              var morph3 = dom.createMorphAt(dom.childAt(element2, [8]),1,1);
              set(env, context, "property", blockArguments[0]);
              element(env, element2, context, "bind-attr", [], {"class": "property.overridden:mixin__property_state_overridden :mixin__property"});
              block(env, morph0, context, "if", [get(env, context, "property.value.computed")], {}, child0, child1);
              content(env, morph1, context, "property.name");
              block(env, morph2, context, "unless", [get(env, context, "property.isEdit")], {}, child2, child3);
              content(env, morph3, context, "property.overridden");
              element(env, element3, context, "action", ["sendToConsole", get(env, context, "property.model")], {});
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("      ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("li");
              dom.setAttribute(el1,"class","mixin__property");
              var el2 = dom.createTextNode("No Properties");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("ul");
            dom.setAttribute(el1,"class","mixin__properties");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("  ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
            block(env, morph0, context, "each", [get(env, context, "mixin.properties")], {"itemController": "mixinProperty"}, child0, child1);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"data-label","object-detail");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, element = hooks.element, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element5 = dom.childAt(fragment, [0]);
          var morph0 = dom.createMorphAt(element5,1,1);
          var morph1 = dom.createMorphAt(element5,2,2);
          set(env, context, "mixin", blockArguments[0]);
          element(env, element5, context, "bind-attr", [], {"class": ":mixin mixin.type mixin.isExpanded:mixin_state_expanded mixin.properties.length:mixin_props_yes:mixin_props_no"});
          block(env, morph0, context, "if", [get(env, context, "mixin.properties.length")], {}, child0, child1);
          block(env, morph1, context, "if", [get(env, context, "mixin.isExpanded")], {}, child2, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(fragment,1,1,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "model.errors.length")], {}, child0, null);
        block(env, morph1, context, "each", [get(env, context, "model.mixins")], {"itemController": "mixinDetail"}, child1, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/mixin-stack', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("code");
            dom.setAttribute(el1,"class","object-trail");
            dom.setAttribute(el1,"data-label","object-trail");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
            content(env, morph0, context, "trail");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","split__panel__hd");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","toolbar");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"data-label","object-inspector-back");
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          dom.setNamespace("http://www.w3.org/2000/svg");
          var el4 = dom.createElement("svg");
          dom.setAttribute(el4,"width","9px");
          dom.setAttribute(el4,"height","9px");
          dom.setAttribute(el4,"viewBox","0 0 9 9");
          dom.setAttribute(el4,"version","1.1");
          dom.setAttribute(el4,"xmlns","http://www.w3.org/2000/svg");
          dom.setAttribute(el4,"xmlns:xlink","http://www.w3.org/1999/xlink");
          var el5 = dom.createTextNode("\n        ");
          dom.appendChild(el4, el5);
          var el5 = dom.createElement("g");
          dom.setAttribute(el5,"stroke","none");
          dom.setAttribute(el5,"stroke-width","1");
          dom.setAttribute(el5,"fill","none");
          dom.setAttribute(el5,"fill-rule","evenodd");
          var el6 = dom.createTextNode("\n          ");
          dom.appendChild(el5, el6);
          var el6 = dom.createElement("polygon");
          dom.setAttribute(el6,"class","svg-fill");
          dom.setAttribute(el6,"fill","#000000");
          dom.setAttribute(el6,"transform","translate(4.500000, 4.500000) rotate(-90.000000) translate(-4.500000, -4.500000) ");
          dom.setAttribute(el6,"points","4.5 0 9 9 0 9 ");
          dom.appendChild(el5, el6);
          var el6 = dom.createTextNode("\n        ");
          dom.appendChild(el5, el6);
          dom.appendChild(el4, el5);
          var el5 = dom.createTextNode("\n      ");
          dom.appendChild(el4, el5);
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n    ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n    ");
          dom.appendChild(el2, el3);
          dom.setNamespace(null);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","divider");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("code");
          dom.setAttribute(el3,"data-label","object-name");
          dom.setAttribute(el3,"class","toolbar__title");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"class","send-to-console");
          dom.setAttribute(el3,"data-label","send-object-to-console-btn");
          var el4 = dom.createTextNode("\n      ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("img");
          dom.setAttribute(el4,"src","assets/images/send.png");
          dom.setAttribute(el4,"title","Send object to console");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n    ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [0]);
          var element1 = dom.childAt(element0, [1]);
          var element2 = dom.childAt(element1, [1]);
          var element3 = dom.childAt(element1, [7]);
          var morph0 = dom.createMorphAt(dom.childAt(element1, [5]),0,0);
          var morph1 = dom.createMorphAt(element0,3,3);
          element(env, element2, context, "action", ["popStack"], {});
          element(env, element2, context, "bind-attr", [], {"class": ":toolbar__icon-button isNested:enabled:disabled"});
          content(env, morph0, context, "firstObject.name");
          element(env, element3, context, "action", ["sendObjectToConsole", get(env, context, "firstObject")], {});
          block(env, morph1, context, "if", [get(env, context, "trail")], {}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","split__panel__bd");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        var morph2 = dom.createMorphAt(dom.childAt(fragment, [4]),1,1);
        dom.insertBoundary(fragment, 0);
        inline(env, morph0, context, "sidebar-toggle", [], {"action": "toggleInspector", "side": "right", "isExpanded": true, "class": "toolbar__icon-button sidebar-toggle--far-left"});
        block(env, morph1, context, "if", [get(env, context, "length")], {}, child0, null);
        inline(env, morph2, context, "render", ["mixinDetails"], {});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/model-types-toolbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","toolbar");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","toolbar__checkbox");
        dom.setAttribute(el2,"data-label","filter-hide-empty-model-typess");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3,"for","options-hideEmptyModelTypes");
        var el4 = dom.createTextNode("Hide Empty Model Types");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 1]),1,1);
        inline(env, morph0, context, "input", [], {"type": "checkbox", "checked": get(env, context, "options.hideEmptyModelTypes"), "id": "options-hideEmptyModelTypes"});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/model-types', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("              ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("span");
              dom.setAttribute(el1,"data-label","model-type-name");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n              (");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("span");
              dom.setAttribute(el1,"data-label","model-type-count");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode(")\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
              var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
              content(env, morph0, context, "modelType.name");
              content(env, morph1, context, "modelType.count");
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"data-label","model-type");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
            set(env, context, "modelType", blockArguments[0]);
            block(env, morph0, context, "link-to", ["records", get(env, context, "modelType.name")], {}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","split__panel__bd");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","nav__title");
          var el3 = dom.createElement("h3");
          var el4 = dom.createTextNode("Model Types");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1, 3]),1,1);
          block(env, morph0, context, "each", [get(env, context, "sorted")], {}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","split");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","split__panel");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","split__panel__bd");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3, 1]),1,1);
        block(env, morph0, context, "draggable-column", [], {"width": get(env, context, "navWidth"), "classNames": "split__panel split__panel--sidebar-2 nav"}, child0, null);
        content(env, morph1, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/nav', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        View Tree\n        ");
          dom.appendChild(el0, el1);
          dom.setNamespace("http://www.w3.org/2000/svg");
          var el1 = dom.createElement("svg");
          dom.setAttribute(el1,"version","1.1");
          dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
          dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
          dom.setAttribute(el1,"x","0px");
          dom.setAttribute(el1,"y","0px");
          dom.setAttribute(el1,"width","19px");
          dom.setAttribute(el1,"height","19px");
          dom.setAttribute(el1,"viewBox","0 0 19 19");
          dom.setAttribute(el1,"enable-background","new 0 0 19 19");
          dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("path");
          dom.setAttribute(el2,"fill","#454545");
          dom.setAttribute(el2,"d","M0,0v19h19V0H0z M6,17h-4V5h4V17z M17,17H7V5h10v12H17z M17,4H2V2h15V1z");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        Routes\n        ");
          dom.appendChild(el0, el1);
          dom.setNamespace("http://www.w3.org/2000/svg");
          var el1 = dom.createElement("svg");
          dom.setAttribute(el1,"version","1.1");
          dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
          dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
          dom.setAttribute(el1,"x","0px");
          dom.setAttribute(el1,"y","0px");
          dom.setAttribute(el1,"width","19px");
          dom.setAttribute(el1,"height","19px");
          dom.setAttribute(el1,"viewBox","0 0 19 19");
          dom.setAttribute(el1,"enable-background","new 0 0 19 19");
          dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("polygon");
          dom.setAttribute(el2,"fill","#454545");
          dom.setAttribute(el2,"points","0.591,17.012 2.36,17.012 6.841,2.086 5.07,2.086");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("path");
          dom.setAttribute(el2,"fill","#454545");
          dom.setAttribute(el2,"d","M18.117,8.495l0.292-1.494h-2.242l0.874-3.507h-1.544l-0.874,3.507h-1.88l0.874-3.507h-1.536l-0.883,3.507 H8.668L8.375,8.495h2.449l-0.616,2.474H7.875l-0.292,1.495h2.252l-0.883,3.515h1.544l0.874-3.515h1.888l-0.883,3.515h1.544 l0.874-3.515h2.53l0.303-1.495h-2.459l0.625-2.474H18.117z M14.249,8.495l-0.617,2.474h-1.888l0.625-2.474H14.249z");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        Data\n        ");
          dom.appendChild(el0, el1);
          dom.setNamespace("http://www.w3.org/2000/svg");
          var el1 = dom.createElement("svg");
          dom.setAttribute(el1,"version","1.1");
          dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
          dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
          dom.setAttribute(el1,"x","0px");
          dom.setAttribute(el1,"y","0px");
          dom.setAttribute(el1,"width","19px");
          dom.setAttribute(el1,"height","19px");
          dom.setAttribute(el1,"viewBox","0 0 19 19");
          dom.setAttribute(el1,"enable-background","new 0 0 19 19");
          dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("path");
          dom.setAttribute(el2,"d","M9.5,0.001C3.907,0.001,0,1.507,0,3.663v11.675C0,17.494,3.907,19,9.5,19c5.594,0,9.5-1.506,9.5-3.662V3.663 C19,1.507,15.094,0.001,9.5,0.001z M9.5,5.669c-4.768,0-7.81-1.318-7.81-2.007c0-0.689,3.042-2.008,7.81-2.008 c4.769,0,7.81,1.318,7.81,2.008C17.31,4.352,14.269,5.669,9.5,5.669z M17.31,15.338c0,0.689-3.041,2.007-7.81,2.007 c-4.768,0-7.81-1.317-7.81-2.007V5.852C3.39,6.77,6.282,7.324,9.5,7.324c3.217,0,6.108-0.554,7.81-1.472V15.338z");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        Deprecations\n        ");
          dom.appendChild(el0, el1);
          dom.setNamespace("http://www.w3.org/2000/svg");
          var el1 = dom.createElement("svg");
          dom.setAttribute(el1,"version","1.1");
          dom.setAttribute(el1,"id","Layer_1");
          dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
          dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
          dom.setAttribute(el1,"x","0px");
          dom.setAttribute(el1,"y","0px");
          dom.setAttribute(el1,"width","20");
          dom.setAttribute(el1,"height","18");
          dom.setAttribute(el1,"viewBox","0 0 20.565 18.33");
          dom.setAttribute(el1,"enable-background","new 0 0 20.565 18.33");
          dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("g");
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("path");
          dom.setAttribute(el3,"d","M19.58,18.33H0.985c-0.351,0-0.674-0.187-0.851-0.489c-0.177-0.303-0.179-0.677-0.006-0.982L9.426,0.463\n            c0.35-0.617,1.363-0.617,1.713,0l9.297,16.396c0.173,0.305,0.17,0.679-0.006,0.982S19.931,18.33,19.58,18.33z M2.676,16.36h15.213\n            L10.283,2.946L2.676,16.36z");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n          ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("g");
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("path");
          dom.setAttribute(el4,"fill-rule","evenodd");
          dom.setAttribute(el4,"clip-rule","evenodd");
          dom.setAttribute(el4,"d","M11.265,8.038c-0.082,1.158-0.162,2.375-0.259,3.594\n              c-0.021,0.271-0.088,0.544-0.169,0.806c-0.079,0.257-0.266,0.358-0.553,0.358c-0.289,0-0.489-0.098-0.553-0.358\n              c-0.096-0.394-0.167-0.799-0.201-1.203c-0.088-1.068-0.159-2.138-0.22-3.208c-0.017-0.289-0.011-0.588,0.047-0.87\n              c0.084-0.409,0.486-0.673,0.933-0.67c0.439,0.003,0.812,0.27,0.924,0.667c0.024,0.08,0.045,0.163,0.049,0.245\n              C11.271,7.59,11.265,7.784,11.265,8.038z");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n            ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("path");
          dom.setAttribute(el4,"fill-rule","evenodd");
          dom.setAttribute(el4,"clip-rule","evenodd");
          dom.setAttribute(el4,"d","M11.285,14.534c0.004,0.554-0.436,1.004-0.991,1.015\n              c-0.552,0.01-1.015-0.45-1.013-1.008c0.001-0.552,0.449-1.004,1-1.007C10.829,13.531,11.281,13.983,11.285,14.534z");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n        ");
          dom.appendChild(el0, el1);
          dom.setNamespace(null);
          var el1 = dom.createElement("span");
          dom.setAttribute(el1,"class","pill pill_not-clickable");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [3]),0,0);
          content(env, morph0, context, "deprecationCount");
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      Info\n      ");
          dom.appendChild(el0, el1);
          dom.setNamespace("http://www.w3.org/2000/svg");
          var el1 = dom.createElement("svg");
          dom.setAttribute(el1,"width","19");
          dom.setAttribute(el1,"height","19");
          dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("rect");
          dom.setAttribute(el2,"id","svg_3");
          dom.setAttribute(el2,"height","6.815");
          dom.setAttribute(el2,"width","3.33");
          dom.setAttribute(el2,"fill","#454545");
          dom.setAttribute(el2,"y","7.8805");
          dom.setAttribute(el2,"x","7.737");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("circle");
          dom.setAttribute(el2,"id","svg_4");
          dom.setAttribute(el2,"r","1.753");
          dom.setAttribute(el2,"cy","5.3775");
          dom.setAttribute(el2,"cx","9.451");
          dom.setAttribute(el2,"fill","#454545");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("path");
          dom.setAttribute(el2,"id","svg_6");
          dom.setAttribute(el2,"d","m9.5,19c-5.238,0 -9.5,-4.262 -9.5,-9.5c0,-5.238 4.262,-9.5 9.5,-9.5s9.5,4.262 9.5,9.5c0,5.238 -4.262,9.5 -9.5,9.5zm0,-17.434c-4.375,0 -7.933,3.559 -7.933,7.933c0,4.374 3.559,7.932 7.933,7.932c4.374,0 7.933,-3.559 7.933,-7.932c0,-4.374 -3.559,-7.933 -7.933,-7.933z");
          dom.setAttribute(el2,"fill","#454545");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        Promises\n        ");
          dom.appendChild(el0, el1);
          dom.setNamespace("http://www.w3.org/2000/svg");
          var el1 = dom.createElement("svg");
          dom.setAttribute(el1,"version","1.1");
          dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
          dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
          dom.setAttribute(el1,"x","0px");
          dom.setAttribute(el1,"y","0px");
          dom.setAttribute(el1,"width","23px");
          dom.setAttribute(el1,"height","23px");
          dom.setAttribute(el1,"viewBox","0 0 23 23");
          dom.setAttribute(el1,"enable-background","new 0 0 23 23");
          dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("path");
          dom.setAttribute(el2,"d","M19,0 L19,19 L-0,19 L-0,0 z M2,2 L2,17 L17,17 L17,2.832 L6.807,12.912 L5.12,12.923 L5.12,2 z M7,2 L7.12,9.863 L15.953,2 z");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("path");
          dom.setAttribute(el2,"d","M6.066,13.643 C4.488,13.643 3.208,12.363 3.208,10.784 C3.208,9.206 4.488,7.926 6.066,7.926 C7.645,7.926 8.925,9.206 8.925,10.784 C8.925,12.363 7.645,13.643 6.066,13.643 z");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child6 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      Container\n\n      ");
          dom.appendChild(el0, el1);
          dom.setNamespace("http://www.w3.org/2000/svg");
          var el1 = dom.createElement("svg");
          dom.setAttribute(el1,"version","1.1");
          dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
          dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
          dom.setAttribute(el1,"x","0px");
          dom.setAttribute(el1,"y","0px");
          dom.setAttribute(el1,"width","19px");
          dom.setAttribute(el1,"height","19px");
          dom.setAttribute(el1,"viewBox","0 0 43 42.191");
          dom.setAttribute(el1,"enable-background","new 0 0 43 42.191");
          dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("g");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("path");
          dom.setAttribute(el3,"d","M20.038,42.092L18,40.691V15.687l1.07-1.437l22-6.585L43,9.102v23.138l-0.962,1.4L20.038,42.092z M21,16.804v21.704\n          l19-7.299V11.116L21,16.804z");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("path");
          dom.setAttribute(el3,"d","M19.647,42.191c-0.224,0-0.452-0.05-0.666-0.156L0.833,33.028L0,31.685V8.01l2.075-1.386l18.507,7.677\n          c0.765,0.317,1.128,1.195,0.811,1.961c-0.318,0.765-1.195,1.129-1.96,0.811L3,10.256v20.499l17.315,8.593\n          c0.742,0.368,1.045,1.269,0.677,2.011C20.73,41.886,20.199,42.191,19.647,42.191z");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("path");
          dom.setAttribute(el3,"d","M41.414,10.602c-0.193,0-0.391-0.037-0.58-0.116L23.047,3.027L2.096,9.444C1.303,9.688,0.465,9.24,0.223,8.449\n          C-0.02,7.657,0.425,6.818,1.217,6.575L22.687,0l1.02,0.051l18.288,7.667c0.764,0.32,1.124,1.2,0.804,1.964\n          C42.557,10.256,42,10.602,41.414,10.602z");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child7 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      Render Performance\n      ");
          dom.appendChild(el0, el1);
          dom.setNamespace("http://www.w3.org/2000/svg");
          var el1 = dom.createElement("svg");
          dom.setAttribute(el1,"version","1.1");
          dom.setAttribute(el1,"id","Layer_1");
          dom.setAttribute(el1,"xmlns","http://www.w3.org/2000/svg");
          dom.setAttribute(el1,"xmlns:xlink","http://www.w3.org/1999/xlink");
          dom.setAttribute(el1,"x","0px");
          dom.setAttribute(el1,"y","0px");
          dom.setAttribute(el1,"width","18.979px");
          dom.setAttribute(el1,"height","18.979px");
          dom.setAttribute(el1,"viewBox","0.021 -0.018 18.979 18.979");
          dom.setAttribute(el1,"enable-background","new 0.021 -0.018 18.979 18.979");
          dom.setAttributeNS(el1,"http://www.w3.org/XML/1998/namespace","xml:space","preserve");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("g");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("path");
          dom.setAttribute(el3,"d","M8.358,11.589c0.291,0.299,0.674,0.45,1.053,0.45c0.347,0,0.69-0.126,0.955-0.384c0.553-0.535,5.625-7.474,5.625-7.474\n          s-7.089,4.864-7.641,5.4C7.798,10.12,7.803,11.017,8.358,11.589z");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("g");
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("path");
          dom.setAttribute(el4,"d","M16.057,2.615c-1.702-1.627-4.005-2.633-6.546-2.633c-5.237,0-9.482,4.246-9.482,9.482c0,2.816,1.233,5.336,3.182,7.073\n            c-1.22-1.439-1.959-3.299-1.959-5.333c0-4.561,3.698-8.259,8.26-8.259c1.577,0,3.045,0.45,4.298,1.216\n            c0.561-0.386,1.067-0.734,1.472-1.011L16.057,2.615z");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("path");
          dom.setAttribute(el4,"d","M17.005,4.923c-0.26,0.354-0.582,0.794-0.936,1.275c1.062,1.39,1.7,3.121,1.7,5.005c0,2.037-0.741,3.898-1.963,5.338\n            c1.951-1.736,3.187-4.259,3.187-7.078c0-1.905-0.568-3.676-1.535-5.162L17.005,4.923z");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"class","nav nav--main");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","nav__title nav__title--middle");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createTextNode("Advanced");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [5]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element1, [5]),1,1);
        var morph3 = dom.createMorphAt(dom.childAt(element1, [7]),1,1);
        var morph4 = dom.createMorphAt(dom.childAt(element1, [9]),1,1);
        var morph5 = dom.createMorphAt(dom.childAt(element2, [1]),1,1);
        var morph6 = dom.createMorphAt(dom.childAt(element2, [3]),1,1);
        var morph7 = dom.createMorphAt(dom.childAt(element2, [5]),1,1);
        block(env, morph0, context, "link-to", ["view-tree"], {}, child0, null);
        block(env, morph1, context, "link-to", ["route-tree"], {}, child1, null);
        block(env, morph2, context, "link-to", ["data"], {}, child2, null);
        block(env, morph3, context, "link-to", ["deprecations"], {}, child3, null);
        block(env, morph4, context, "link-to", ["info"], {}, child4, null);
        block(env, morph5, context, "link-to", ["promises"], {}, child5, null);
        block(env, morph6, context, "link-to", ["container-types"], {}, child6, null);
        block(env, morph7, context, "link-to", ["render-tree"], {}, child7, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/page-refresh', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","notice");
        dom.setAttribute(el1,"data-label","page-refresh");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Reload the page to see promises created before you opened the inspector.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"data-label","page-refresh-btn");
        var el3 = dom.createTextNode("Reload");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 3]);
        element(env, element0, context, "action", ["refreshPage"], {});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/promise-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","send-trace-to-console");
          dom.setAttribute(el1,"title","Trace promise in console");
          dom.setAttribute(el1,"data-label","trace-promise-btn");
          var el2 = dom.createTextNode("\n          Trace\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element3 = dom.childAt(fragment, [1]);
          element(env, element3, context, "action", ["tracePromise", get(env, context, "model")], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("\n            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            dom.setAttribute(el1,"class","cell_clickable");
            dom.setAttribute(el1,"data-label","promise-object-value");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element1 = dom.childAt(fragment, [1]);
            var morph0 = dom.createMorphAt(element1,0,0);
            element(env, element1, context, "action", ["inspectObject", get(env, context, "settledValue.objectId")], {});
            content(env, morph0, context, "settledValue.inspect");
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            content(env, morph0, context, "settledValue.inspect");
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","send-trace-to-console");
            dom.setAttribute(el1,"data-label","send-to-console-btn");
            dom.setAttribute(el1,"title","Send stack trace to the console");
            var el2 = dom.createTextNode("\n            Stack trace\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1]);
            element(env, element0, context, "action", ["sendValueToConsole", get(env, context, "model")], {});
            return fragment;
          }
        };
      }());
      var child3 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            inline(env, morph0, context, "send-to-console", [], {"action": "sendValueToConsole", "param": get(env, context, "model")});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","list-tree__limited  list-tree__limited_helper_very-large");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","list-tree__right-helper");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element2 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element2,1,1);
          var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
          element(env, element2, context, "bind-attr", [], {"title": "settledValue.inspect"});
          block(env, morph0, context, "if", [get(env, context, "isValueInspectable")], {}, child0, child1);
          block(env, morph1, context, "if", [get(env, context, "isError")], {}, child2, child3);
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    --\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"data-label","promise-item");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","cell_type_main cell");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","list-tree__limited list-tree__limited_helper_large");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"data-label","promise-label");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","cell__arrow");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","list-tree__right-helper");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","cell cell_size_medium");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","pill pill_text_clear");
        dom.setAttribute(el3,"data-label","promise-state");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","cell cell_size_large");
        dom.setAttribute(el2,"data-label","promise-value");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","cell cell_size_medium cell_value_numeric");
        dom.setAttribute(el2,"data-label","promise-time");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, content = hooks.content, block = hooks.block, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element4 = dom.childAt(fragment, [0]);
        var element5 = dom.childAt(element4, [1]);
        var element6 = dom.childAt(element5, [1, 1]);
        var element7 = dom.childAt(element4, [3, 1]);
        var morph0 = dom.createMorphAt(element6,3,3);
        var morph1 = dom.createMorphAt(dom.childAt(element5, [3]),1,1);
        var morph2 = dom.createMorphAt(element7,0,0);
        var morph3 = dom.createMorphAt(dom.childAt(element4, [5]),1,1);
        var morph4 = dom.createMorphAt(dom.childAt(element4, [7]),0,0);
        element(env, element4, context, "bind-attr", [], {"style": "nodeStyle", "class": ":list-tree__item :row expandedClass"});
        element(env, element5, context, "action", ["toggleExpand", get(env, context, "model")], {});
        element(env, element5, context, "bind-attr", [], {"style": "labelStyle"});
        element(env, element6, context, "bind-attr", [], {"title": "label"});
        content(env, morph0, context, "label");
        block(env, morph1, context, "if", [get(env, context, "hasStack")], {}, child0, null);
        element(env, element7, context, "bind-attr", [], {"style": "style"});
        content(env, morph2, context, "state");
        block(env, morph3, context, "if", [get(env, context, "hasValue")], {}, child1, child2);
        inline(env, morph4, context, "ms-to-time", [get(env, context, "timeToSettle")], {});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/promise-tree-toolbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","divider");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"data-label","toolbar-page-refresh-btn");
          var el2 = dom.createTextNode("Reload");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [3]);
          element(env, element0, context, "action", ["refreshPage"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","toolbar");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","toolbar__search");
        dom.setAttribute(el2,"data-label","promise-search");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"data-label","filter");
        var el3 = dom.createTextNode("\n    All\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","divider");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"data-label","filter");
        var el3 = dom.createTextNode("Rejected");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"data-label","filter");
        var el3 = dom.createTextNode("Pending");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"data-label","filter");
        var el3 = dom.createTextNode("Fulfilled");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","divider");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","toolbar__checkbox");
        dom.setAttribute(el2,"data-label","with-stack");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3,"for","instrument-with-stack");
        var el4 = dom.createTextNode("Trace promises");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, get = hooks.get, element = hooks.element, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [5]);
        var element3 = dom.childAt(element1, [9]);
        var element4 = dom.childAt(element1, [11]);
        var element5 = dom.childAt(element1, [13]);
        var morph0 = dom.createMorphAt(element1,1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        var morph2 = dom.createMorphAt(dom.childAt(element1, [17]),1,1);
        var morph3 = dom.createMorphAt(element1,19,19);
        inline(env, morph0, context, "clear-button", [], {"action": "clear", "classNames": "toolbar__icon-button", "dataLabel": "clear-promises-btn"});
        inline(env, morph1, context, "input", [], {"value": get(env, context, "search"), "placeholder": "Search"});
        element(env, element2, context, "bind-attr", [], {"class": "noFilter:active :toolbar__radio"});
        element(env, element2, context, "action", ["setFilter", "all"], {});
        element(env, element3, context, "bind-attr", [], {"class": "isRejectedFilter:active :toolbar__radio"});
        element(env, element3, context, "action", ["setFilter", "rejected"], {});
        element(env, element4, context, "bind-attr", [], {"class": "isPendingFilter:active :toolbar__radio"});
        element(env, element4, context, "action", ["setFilter", "pending"], {});
        element(env, element5, context, "bind-attr", [], {"class": "isFulfilledFilter:active :toolbar__radio"});
        element(env, element5, context, "action", ["setFilter", "fulfilled"], {});
        inline(env, morph2, context, "action-checkbox", [], {"on-update": "updateInstrumentWithStack", "checked": get(env, context, "instrumentWithStack"), "id": "instrument-with-stack"});
        block(env, morph3, context, "unless", [get(env, context, "shouldRefresh")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/promise-tree', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          inline(env, morph0, context, "partial", ["page_refresh"], {});
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","list-view");
          dom.setAttribute(el1,"data-label","promise-tree");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","list-view__header row");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","cell cell_type_header");
          var el4 = dom.createTextNode("\n      Label\n    ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","cell cell_size_medium cell_type_header");
          var el4 = dom.createTextNode("\n      State\n    ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","cell cell_size_large cell_type_header");
          var el4 = dom.createTextNode("\n      Fulfillment / Rejection value\n    ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","cell cell_size_medium cell_value_numeric cell_type_header");
          var el4 = dom.createTextNode("\n      Time to settle\n    ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment(" Account for scrollbar width :'(  ");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","cell cell_type_header spacer");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","list-view__list-container");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 3]),1,1);
          inline(env, morph0, context, "view", ["promiseList"], {"content": get(env, context, "items")});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "if", [get(env, context, "shouldRefresh")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/promises/error', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("You are using a version of Ember < 1.3.");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","data-error-page-container");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        block(env, morph0, context, "not-detected", [], {"description": "Promises", "reasonsTitle": "This usually happens because:"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/record-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","cell cell_clickable");
            dom.setAttribute(el1,"data-label","record-column");
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n    ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1]);
            var morph0 = dom.createMorphAt(element0,1,1);
            element(env, element0, context, "bind-attr", [], {"style": "item.style"});
            content(env, morph0, context, "column.value");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          set(env, context, "item", blockArguments[0]);
          block(env, morph0, context, "each", [get(env, context, "item.columns")], {"keyword": "column"}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "record-item", [], {"model": get(env, context, "this"), "modelTypeColumns": get(env, context, "view.columns"), "inspect": "inspectModel"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/records-toolbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"data-label","filter");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, element = hooks.element, get = hooks.get, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(element0,1,1);
          set(env, context, "filter", blockArguments[0]);
          element(env, element0, context, "bind-attr", [], {"class": "filter.checked:active :toolbar__radio"});
          element(env, element0, context, "action", ["setFilter", get(env, context, "filter.name")], {});
          content(env, morph0, context, "filter.desc");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","toolbar");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","toolbar__search");
        dom.setAttribute(el2,"data-label","records-search");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"data-label","filter");
        var el3 = dom.createTextNode("\n    All\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","divider");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0]);
        var element2 = dom.childAt(element1, [3]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        var morph1 = dom.createMorphAt(element1,7,7);
        inline(env, morph0, context, "input", [], {"value": get(env, context, "search"), "placeholder": "Search"});
        element(env, element2, context, "bind-attr", [], {"class": "noFilterValue:active :toolbar__radio"});
        element(env, element2, context, "action", ["setFilter"], {});
        block(env, morph1, context, "each", [get(env, context, "filters")], {"itemController": "recordFilter"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/records', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cell cell_type_header");
          dom.setAttribute(el1,"data-label","column-title");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          set(env, context, "column", blockArguments[0]);
          content(env, morph0, context, "column.desc");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","list-view");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","list-view__header row");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Account for scrollbar width :'(  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header spacer");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","list-view__list-container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        block(env, morph0, context, "each", [get(env, context, "columns")], {}, child0, null);
        inline(env, morph1, context, "view", ["record-list"], {"content": get(env, context, "filtered"), "columns": get(env, context, "columns")});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/render-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 1,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement, blockArguments) {
            var dom = env.dom;
            var hooks = env.hooks, set = hooks.set, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            set(env, context, "child", blockArguments[0]);
            inline(env, morph0, context, "render", ["render_item", get(env, context, "child")], {});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "each", [get(env, context, "children")], {}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"data-label","render-profile-row");
        dom.setAttribute(el1,"class","list-tree__item-wrapper row-wrapper");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"data-label","render-profile-item");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell_type_main cell");
        dom.setAttribute(el3,"data-label","render-main-cell");
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","cell__arrow");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"data-label","render-profile-name");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","pill pill_not-clickable");
        dom.setAttribute(el5,"data-label","render-profile-duration");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_value_numeric");
        dom.setAttribute(el3,"data-label","render-profile-timestamp");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [1]);
        var morph0 = dom.createMorphAt(dom.childAt(element2, [3]),0,0);
        var morph1 = dom.createMorphAt(dom.childAt(element2, [5]),0,0);
        var morph2 = dom.createMorphAt(dom.childAt(element0, [3]),1,1);
        var morph3 = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, null);
        element(env, element0, context, "bind-attr", [], {"style": "nodeStyle", "class": ":list-tree__item :row expandedClass"});
        element(env, element1, context, "action", ["toggleExpand"], {});
        element(env, element1, context, "bind-attr", [], {"style": "nameStyle"});
        element(env, element2, context, "bind-attr", [], {"title": "name"});
        content(env, morph0, context, "name");
        inline(env, morph1, context, "ms-to-time", [get(env, context, "duration")], {});
        content(env, morph2, context, "readableTime");
        block(env, morph3, context, "if", [get(env, context, "isExpanded")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/render-tree-toolbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","divider");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"data-label","toolbar-page-refresh-btn");
          var el2 = dom.createTextNode("Reload");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [3]);
          element(env, element0, context, "action", ["refreshPage"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","toolbar");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","toolbar__search");
        dom.setAttribute(el2,"data-label","render-profiles-search");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","filter-bar__pills");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element1,1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        var morph2 = dom.createMorphAt(element1,7,7);
        inline(env, morph0, context, "clear-button", [], {"action": "clearProfiles", "classNames": "toolbar__icon-button"});
        inline(env, morph1, context, "input", [], {"value": get(env, context, "searchField"), "placeholder": "Search"});
        block(env, morph2, context, "unless", [get(env, context, "showEmpty")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/render-tree', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            revision: "Ember@1.12.0",
            blockParams: 1,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createComment("");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement, blockArguments) {
              var dom = env.dom;
              var hooks = env.hooks, set = hooks.set, get = hooks.get, inline = hooks.inline;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (env.useFragmentCache && dom.canClone) {
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
              } else {
                fragment = this.build(dom);
              }
              var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
              set(env, context, "item", blockArguments[0]);
              inline(env, morph0, context, "render", ["render-item", get(env, context, "item")], {});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
            dom.insertBoundary(fragment, null);
            dom.insertBoundary(fragment, 0);
            block(env, morph0, context, "each", [get(env, context, "filtered")], {}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","list-view");
          dom.setAttribute(el1,"data-label","render-tree");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","list-view__header row");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","cell cell_type_header");
          var el4 = dom.createTextNode("\n      Name\n    ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","cell cell_type_header cell_value_numeric");
          var el4 = dom.createTextNode("\n      Timestamp\n    ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment(" Account for scrollbar width :'(  ");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","cell cell_type_header spacer");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","ember-list-container");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 3]),1,1);
          block(env, morph0, context, "view", ["render-list"], {}, child0, null);
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","notice");
          dom.setAttribute(el1,"data-label","render-tree-empty");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createTextNode("No rendering metrics have been collected. Try reloading or navigating around your application.");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createElement("strong");
          var el4 = dom.createTextNode("Note:");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode(" Very fast rendering times (<1ms) are excluded.");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"data-label","toolbar-page-refresh-btn");
          var el3 = dom.createTextNode("Reload");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 5]);
          element(env, element0, context, "action", ["refreshPage"], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "unless", [get(env, context, "showEmpty")], {}, child0, child1);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/route-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","list-tree__limited cell_clickable");
            dom.setAttribute(el1,"data-label","route-controller");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","list-tree__right-helper");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, element = hooks.element, subexpr = hooks.subexpr, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element1 = dom.childAt(fragment, [1]);
            var element2 = dom.childAt(element1, [1]);
            var morph0 = dom.createMorphAt(element2,0,0);
            var attrMorph0 = dom.createAttrMorph(element2, 'title');
            var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
            element(env, element1, context, "action", ["inspectController", get(env, context, "value.controller")], {});
            attribute(env, attrMorph0, element2, "title", concat(env, [subexpr(env, context, "unbound", [get(env, context, "value.controller.className")], {})]));
            content(env, morph0, context, "value.controller.className");
            inline(env, morph1, context, "send-to-console", [], {"action": "sendControllerToConsole", "param": get(env, context, "value.controller.name")});
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"data-label","route-controller");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, subexpr = hooks.subexpr, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1, 1]);
            var morph0 = dom.createMorphAt(element0,0,0);
            var attrMorph0 = dom.createAttrMorph(element0, 'title');
            attribute(env, attrMorph0, element0, "title", concat(env, [subexpr(env, context, "unbound", [get(env, context, "value.controller.className")], {})]));
            content(env, morph0, context, "value.controller.className");
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cell_type_main cell");
          dom.setAttribute(el1,"data-label","route-name");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"data-label","view-name");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cell");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","list-tree__limited cell_clickable");
          dom.setAttribute(el2,"data-label","route-handler");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","list-tree__right-helper");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cell");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cell");
          dom.setAttribute(el1,"data-label","route-template");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cell cell_size_large");
          dom.setAttribute(el1,"data-label","route-url");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, element = hooks.element, get = hooks.get, subexpr = hooks.subexpr, concat = hooks.concat, attribute = hooks.attribute, content = hooks.content, inline = hooks.inline, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element3 = dom.childAt(fragment, [1, 1]);
          var element4 = dom.childAt(element3, [1]);
          var element5 = dom.childAt(fragment, [3]);
          var element6 = dom.childAt(element5, [1]);
          var element7 = dom.childAt(element6, [1]);
          var element8 = dom.childAt(fragment, [7, 1]);
          var element9 = dom.childAt(fragment, [9, 1]);
          var morph0 = dom.createMorphAt(element4,0,0);
          var attrMorph0 = dom.createAttrMorph(element4, 'title');
          var morph1 = dom.createMorphAt(element7,0,0);
          var attrMorph1 = dom.createAttrMorph(element7, 'title');
          var morph2 = dom.createMorphAt(dom.childAt(element5, [3]),1,1);
          var morph3 = dom.createMorphAt(dom.childAt(fragment, [5]),1,1);
          var morph4 = dom.createMorphAt(element8,0,0);
          var attrMorph2 = dom.createAttrMorph(element8, 'title');
          var morph5 = dom.createMorphAt(element9,0,0);
          var attrMorph3 = dom.createAttrMorph(element9, 'title');
          set(env, context, "item", blockArguments[0]);
          element(env, element3, context, "bind-attr", [], {"style": "item.labelStyle"});
          attribute(env, attrMorph0, element4, "title", concat(env, [subexpr(env, context, "unbound", [get(env, context, "value.name")], {})]));
          content(env, morph0, context, "value.name");
          element(env, element6, context, "action", ["inspectRoute", get(env, context, "value.routeHandler.name")], {});
          attribute(env, attrMorph1, element7, "title", concat(env, [subexpr(env, context, "unbound", [get(env, context, "value.routeHandler.className")], {})]));
          content(env, morph1, context, "value.routeHandler.className");
          inline(env, morph2, context, "send-to-console", [], {"action": "sendRouteHandlerToConsole", "param": get(env, context, "value.routeHandler.name")});
          block(env, morph3, context, "if", [get(env, context, "value.controller.exists")], {}, child0, child1);
          attribute(env, attrMorph2, element8, "title", concat(env, [subexpr(env, context, "unbound", [get(env, context, "value.template.name")], {})]));
          content(env, morph4, context, "value.template.name");
          attribute(env, attrMorph3, element9, "title", concat(env, [subexpr(env, context, "unbound", [get(env, context, "value.url")], {})]));
          content(env, morph5, context, "value.url");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "route-item", [], {"model": get(env, context, "this"), "currentRoute": get(env, context, "view.currentRoute")}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/route-tree-toolbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","toolbar");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","toolbar__checkbox");
        dom.setAttribute(el2,"data-label","filter-hide-routes");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3,"for","options-hideRoutes");
        var el4 = dom.createTextNode("Current Route only");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 1]),1,1);
        inline(env, morph0, context, "input", [], {"type": "checkbox", "checked": get(env, context, "options.hideRoutes"), "id": "options-hideRoutes"});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/route-tree', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","list-view");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","list-view__header row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header");
        var el4 = dom.createTextNode("\n      Route Name\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header");
        var el4 = dom.createTextNode("\n      Route\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header");
        var el4 = dom.createTextNode("\n      Controller\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header");
        var el4 = dom.createTextNode("\n      Template\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header cell_size_large");
        var el4 = dom.createTextNode("\n      URL\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Account for scrollbar width :'(  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header spacer");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","list-view__list-container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 3]),1,1);
        inline(env, morph0, context, "view", ["routeList"], {"content": get(env, context, "filtered"), "currentRoute": get(env, context, "currentRoute")});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/view-item', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"data-label","view-model-clickable");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","list-tree__right-helper");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, get = hooks.get, subexpr = hooks.subexpr, concat = hooks.concat, attribute = hooks.attribute, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element4 = dom.childAt(fragment, [1]);
            var element5 = dom.childAt(element4, [1]);
            var morph0 = dom.createMorphAt(element5,0,0);
            var attrMorph0 = dom.createAttrMorph(element5, 'title');
            var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
            element(env, element4, context, "bind-attr", [], {"class": ":list-tree__limited item.modelInspectable:cell_clickable"});
            element(env, element4, context, "action", ["inspectModel", get(env, context, "value.model.objectId")], {"target": get(env, context, "item")});
            attribute(env, attrMorph0, element5, "title", concat(env, [subexpr(env, context, "unbound", [get(env, context, "value.model.completeName")], {})]));
            inline(env, morph0, context, "unbound", [get(env, context, "value.model.name")], {});
            inline(env, morph1, context, "send-to-console", [], {"action": "sendModelToConsole", "param": get(env, context, "value")});
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      --\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      var child2 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","list-tree__right-helper");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, get = hooks.get, subexpr = hooks.subexpr, concat = hooks.concat, attribute = hooks.attribute, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element2 = dom.childAt(fragment, [1]);
            var element3 = dom.childAt(element2, [1]);
            var morph0 = dom.createMorphAt(element3,0,0);
            var attrMorph0 = dom.createAttrMorph(element3, 'title');
            var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
            element(env, element2, context, "bind-attr", [], {"class": ":list-tree__limited item.hasController:cell_clickable"});
            element(env, element2, context, "action", ["inspect", get(env, context, "value.controller.objectId")], {});
            attribute(env, attrMorph0, element3, "title", concat(env, [subexpr(env, context, "unbound", [get(env, context, "value.controller.completeName")], {})]));
            inline(env, morph0, context, "unbound", [get(env, context, "value.controller.name")], {});
            inline(env, morph1, context, "send-to-console", [], {"action": "sendObjectToConsole", "param": get(env, context, "value.controller.objectId")});
            return fragment;
          }
        };
      }());
      var child3 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","list-tree__right-helper");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, get = hooks.get, subexpr = hooks.subexpr, concat = hooks.concat, attribute = hooks.attribute, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var element0 = dom.childAt(fragment, [1]);
            var element1 = dom.childAt(element0, [1]);
            var morph0 = dom.createMorphAt(element1,0,0);
            var attrMorph0 = dom.createAttrMorph(element1, 'title');
            var morph1 = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
            element(env, element0, context, "bind-attr", [], {"class": ":list-tree__limited item.hasView:cell_clickable"});
            element(env, element0, context, "action", ["inspectView"], {"target": get(env, context, "item")});
            attribute(env, attrMorph0, element1, "title", concat(env, [subexpr(env, context, "unbound", [get(env, context, "value.completeViewClass")], {})]));
            inline(env, morph0, context, "unbound", [get(env, context, "value.viewClass")], {});
            inline(env, morph1, context, "send-to-console", [], {"action": "sendObjectToConsole", "param": get(env, context, "value.objectId")});
            return fragment;
          }
        };
      }());
      var child4 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      --\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cell_type_main cell");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"data-label","view-name");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"data-label","view-template");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cell");
          dom.setAttribute(el1,"data-label","view-model");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cell");
          dom.setAttribute(el1,"data-label","view-controller");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cell");
          dom.setAttribute(el1,"data-label","view-class");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","cell cell_size_small cell_value_numeric");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","pill pill_not-clickable pill_size_small");
          dom.setAttribute(el2,"data-label","view-duration");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, element = hooks.element, get = hooks.get, inline = hooks.inline, subexpr = hooks.subexpr, concat = hooks.concat, attribute = hooks.attribute, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element6 = dom.childAt(fragment, [1, 1]);
          var element7 = dom.childAt(element6, [1]);
          var element8 = dom.childAt(fragment, [3]);
          var element9 = dom.childAt(element8, [1]);
          var morph0 = dom.createMorphAt(element7,0,0);
          var morph1 = dom.createMorphAt(element9,0,0);
          var attrMorph0 = dom.createAttrMorph(element9, 'title');
          var morph2 = dom.createMorphAt(dom.childAt(fragment, [5]),1,1);
          var morph3 = dom.createMorphAt(dom.childAt(fragment, [7]),1,1);
          var morph4 = dom.createMorphAt(dom.childAt(fragment, [9]),1,1);
          var morph5 = dom.createMorphAt(dom.childAt(fragment, [11, 1]),0,0);
          set(env, context, "item", blockArguments[0]);
          element(env, element6, context, "bind-attr", [], {"style": "item.labelStyle"});
          element(env, element7, context, "bind-attr", [], {"title": "value.name"});
          inline(env, morph0, context, "unbound", [get(env, context, "value.name")], {});
          element(env, element8, context, "bind-attr", [], {"class": ":cell item.hasElement:cell_clickable"});
          element(env, element8, context, "action", ["inspectElement"], {"target": get(env, context, "item")});
          attribute(env, attrMorph0, element9, "title", concat(env, [subexpr(env, context, "unbound", [get(env, context, "value.template")], {})]));
          inline(env, morph1, context, "unbound", [get(env, context, "value.template")], {});
          block(env, morph2, context, "if", [get(env, context, "item.hasModel")], {}, child0, child1);
          block(env, morph3, context, "if", [get(env, context, "item.hasController")], {}, child2, null);
          block(env, morph4, context, "if", [get(env, context, "item.hasView")], {}, child3, child4);
          inline(env, morph5, context, "ms-to-time", [get(env, context, "value.duration")], {});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        block(env, morph0, context, "view-item", [], {"model": get(env, context, "this"), "inspect": "inspect", "pinnedObjectId": get(env, context, "view.pinnedObjectId"), "inspectElement": "inspectElement"}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/view-tree-toolbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","toolbar");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"data-label","inspect-views");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.setNamespace("http://www.w3.org/2000/svg");
        var el3 = dom.createElement("svg");
        dom.setAttribute(el3,"width","16px");
        dom.setAttribute(el3,"height","16px");
        dom.setAttribute(el3,"viewBox","0 0 16 16");
        dom.setAttribute(el3,"version","1.1");
        dom.setAttribute(el3,"xmlns","http://www.w3.org/2000/svg");
        dom.setAttribute(el3,"xmlns:xlink","http://www.w3.org/1999/xlink");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("g");
        dom.setAttribute(el4,"class","svg-stroke");
        dom.setAttribute(el4,"transform","translate(3.000000, 4.000000)");
        dom.setAttribute(el4,"stroke","#000000");
        dom.setAttribute(el4,"stroke-width","2");
        dom.setAttribute(el4,"fill","none");
        dom.setAttribute(el4,"fill-rule","evenodd");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("path");
        dom.setAttribute(el5,"d","M7.5,7.5 L10.5,10.5");
        dom.setAttribute(el5,"stroke-linecap","square");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("circle");
        dom.setAttribute(el5,"cx","4");
        dom.setAttribute(el5,"cy","4");
        dom.setAttribute(el5,"r","4");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        dom.setNamespace(null);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","divider");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","toolbar__checkbox");
        dom.setAttribute(el2,"data-label","filter-components");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3,"for","options-components");
        var el4 = dom.createTextNode("Components");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","toolbar__checkbox");
        dom.setAttribute(el2,"data-label","filter-all-views");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(" ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3,"for","options-allViews");
        var el4 = dom.createTextNode("All Views");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var morph0 = dom.createMorphAt(dom.childAt(element0, [5]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [7]),1,1);
        element(env, element1, context, "bind-attr", [], {"class": "inspectingViews:active :toolbar__icon-button"});
        element(env, element1, context, "action", ["toggleViewInspection"], {});
        inline(env, morph0, context, "input", [], {"type": "checkbox", "checked": get(env, context, "options.components"), "id": "options-components"});
        inline(env, morph1, context, "input", [], {"type": "checkbox", "checked": get(env, context, "options.allViews"), "id": "options-allViews"});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/templates/view-tree', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","list-view");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","list-view__header row");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header");
        var el4 = dom.createTextNode("\n      Name\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header");
        var el4 = dom.createTextNode("\n      Template\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header");
        var el4 = dom.createTextNode("\n      Model\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header");
        var el4 = dom.createTextNode("\n      Controller\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header");
        var el4 = dom.createTextNode("\n      View / Component\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_size_small cell_value_numeric cell_type_header");
        var el4 = dom.createTextNode("\n      Duration\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" Account for scrollbar width :'(  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","cell cell_type_header spacer");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","list-view__list-container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0, 3]),1,1);
        inline(env, morph0, context, "view", ["view-list"], {"content": get(env, context, "model"), "pinnedObjectId": get(env, context, "pinnedObjectId")});
        return fragment;
      }
    };
  }()));

});
define('ember-inspector/utils/check-current-route', ['exports'], function (exports) {

  'use strict';

  exports['default'] = function (currentRouteName, routeName) {
    var regName = undefined,
        match = undefined;

    if (routeName === 'application') {
      return true;
    }

    regName = routeName.replace('.', '\\.');
    match = currentRouteName.match(new RegExp('(^|\\.)' + regName + '(\\.|$)'));
    if (match && match[0].match(/^\.[^.]+$/)) {
      match = false;
    }
    return !!match;
  }

});
define('ember-inspector/utils/escape-reg-exp', ['exports'], function (exports) {

  'use strict';

  exports['default'] = function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }

});
define('ember-inspector/utils/search-match', ['exports', 'ember', 'ember-inspector/utils/escape-reg-exp'], function (exports, Ember, escapeRegExp) {

  'use strict';

  var isEmpty = Ember['default'].isEmpty;

  exports['default'] = function (text, searchQuery) {
    if (isEmpty(searchQuery)) {
      return true;
    }
    var regExp = new RegExp(escapeRegExp['default'](searchQuery.toLowerCase()));
    return !!text.toLowerCase().match(regExp);
  }

});
define('ember-inspector/views/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    classNames: ['app'],

    classNameBindings: ['inactive', 'controller.isDragging'],

    inactive: Ember['default'].computed.not('controller.active'),

    attributeBindings: ['tabindex'],
    tabindex: 1,

    height: Ember['default'].computed.alias('controller.height'),

    didInsertElement: function didInsertElement() {
      this._super();

      Ember['default'].$(window).on('resize.application-view-' + this.get('elementId'), (function () {
        Ember['default'].run.debounce(this, 'updateHeight', 200);
      }).bind(this));
      this.updateHeight();
    },

    updateHeight: function updateHeight() {
      // could be destroyed but with debounce pending
      if (this.$()) {
        this.set('height', this.$().height());
      }
    },

    willDestroyElement: function willDestroyElement() {
      Ember['default'].$(window).off('.application-view-' + this.get('elementId'));
    },

    focusIn: function focusIn() {
      if (!this.get('controller.active')) {
        this.set('controller.active', true);
      }
    },

    focusOut: function focusOut() {
      if (this.get('controller.active')) {
        this.set('controller.active', false);
      }
    }
  });

});
define('ember-inspector/views/container-type', ['exports', 'ember', 'ember-inspector/mixins/fake-table'], function (exports, Ember, FakeTableMixin) {

	'use strict';

	exports['default'] = Ember['default'].View.extend(FakeTableMixin['default']);

});
define('ember-inspector/views/instance-list', ['exports', 'ember-inspector/views/list', 'ember-inspector/views/list-item'], function (exports, ListView, ListItemView) {

  'use strict';

  exports['default'] = ListView['default'].extend({
    /**
     * @property itemViewClass
     * @type {Ember.View}
     */
    itemViewClass: ListItemView['default'].extend({
      /**
       * @property templateName
       * @type {String}
       * @default 'instance_item'
       */
      templateName: 'instance_item'
    })
  });

});
define('ember-inspector/views/list-item', ['exports', 'ember-list-view/list-item-view'], function (exports, ListItemView) {

  'use strict';

  exports['default'] = ListItemView['default'].extend({
    /**
     * @property classNames
     * @type {Array}
     */
    classNames: ["list-tree__item-wrapper", "row-wrapper"]
  });

});
define('ember-inspector/views/list-view', ['exports', 'ember-list-view'], function (exports, ListView) {

	'use strict';

	exports['default'] = ListView['default'];

});
define('ember-inspector/views/list', ['exports', 'ember', 'ember-list-view', 'ember-inspector/views/list-item'], function (exports, Ember, ListView, ListItemView) {

  'use strict';

  var computed = Ember['default'].computed;
  var alias = Ember['default'].computed.alias;

  /**
   * Base list view config
   *
   * @module Views
   * @extends ListView
   * @class List
   * @namespace Views
   */
  exports['default'] = ListView['default'].extend({
    /**
     * @property classNames
     * @type {Array}
     */
    classNames: ["list-tree"],

    /**
     * @property contentHeight
     * @type {Integer}
     */
    contentHeight: alias('controller.controllers.application.contentHeight'),

    /**
     * @property height
     * @type {Integer}
     */
    height: computed('contentHeight', function () {
      var headerHeight = 31;
      var contentHeight = this.get('contentHeight');

      // In testing list-view is created before `contentHeight` is set
      // which will trigger an exception
      if (!contentHeight) {
        return 1;
      }
      return contentHeight - headerHeight;
    }),

    /**
     * @property rowHeight
     * @type {Integer}
     * @default 30
     */
    rowHeight: 30,

    /**
     * @property itemViewClass
     * @type {Ember.View}
     */
    itemViewClass: ListItemView['default']
  });

});
define('ember-inspector/views/main-content', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
    height: Ember['default'].computed.alias('controller.contentHeight'),

    didInsertElement: function didInsertElement() {
      var _this = this;

      this._super();

      Ember['default'].$(window).on('resize.view-' + this.get('elementId'), function () {
        Ember['default'].run.debounce(_this, 'updateHeight', 200);
      });
      this.updateHeight();
    },

    updateHeight: function updateHeight() {
      // could be destroyed but with debounce pending
      if (this.$()) {
        this.set('height', this.$().height());
      }
    },

    willDestroyElement: function willDestroyElement() {
      Ember['default'].$(window).off('.view-' + this.get('elementId'));
    }
  });

});
define('ember-inspector/views/promise-list', ['exports', 'ember-inspector/views/list', 'ember-inspector/views/list-item'], function (exports, ListView, ListItemView) {

  'use strict';

  exports['default'] = ListView['default'].extend({
    /**
     * @property itemViewClass
     * @type {Ember.View}
     */
    itemViewClass: ListItemView['default'].extend({
      /**
       * @property templateName
       * @type {String}
       * @default 'promise_item'
       */
      templateName: 'promise_item'
    })
  });

});
define('ember-inspector/views/promise-tree', ['exports', 'ember', 'ember-inspector/mixins/fake-table'], function (exports, Ember, FakeTableMixin) {

	'use strict';

	exports['default'] = Ember['default'].View.extend(FakeTableMixin['default']);

});
define('ember-inspector/views/record-list', ['exports', 'ember', 'ember-inspector/views/list', 'ember-inspector/views/list-item'], function (exports, Ember, ListView, ListItemView) {

  'use strict';

  var readOnly = Ember['default'].computed.readOnly;

  /**
   * @module Views
   * @extends Views.List
   * @class RecordList
   * @namespace Views
   */
  exports['default'] = ListView['default'].extend({
    /**
     * @property itemViewClass
     * @type {Ember.View}
     */
    itemViewClass: ListItemView['default'].extend({
      /**
       * @property templateName
       * @type {String}
       * @default 'record_item'
       */
      templateName: 'record_item',

      /**
       * TODO: Need a better way to pass this
       *
       * @property columns
       * @type {Array}
       */
      columns: readOnly('parentView.columns')
    })
  });

});
define('ember-inspector/views/records', ['exports', 'ember', 'ember-inspector/mixins/fake-table'], function (exports, Ember, FakeTableMixin) {

	'use strict';

	exports['default'] = Ember['default'].View.extend(FakeTableMixin['default']);

});
define('ember-inspector/views/render-list', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var View = Ember['default'].View;
  var computed = Ember['default'].computed;
  var SafeString = Ember['default'].Handlebars.SafeString;

  exports['default'] = View.extend({
    attributeBindings: ['style'],

    classNames: ["list-tree", "list-tree_scrollable"],

    style: computed('height', function () {
      return new SafeString("height: " + this.get('height') + "px;");
    }),

    contentHeight: Ember['default'].computed.alias('controller.controllers.application.contentHeight'),

    filterHeight: 22,

    height: computed('contentHeight', function () {
      var filterHeight = this.get('filterHeight');
      var headerHeight = 30;
      var contentHeight = this.get('contentHeight');

      // In testing list-view is created before `contentHeight` is set
      // which will trigger an exception
      if (!contentHeight) {
        return 1;
      }
      return contentHeight - filterHeight - headerHeight;
    })
  });

});
define('ember-inspector/views/render-tree', ['exports', 'ember', 'ember-inspector/mixins/fake-table'], function (exports, Ember, FakeTableMixin) {

	'use strict';

	exports['default'] = Ember['default'].View.extend(FakeTableMixin['default']);

});
define('ember-inspector/views/route-list', ['exports', 'ember', 'ember-inspector/views/list', 'ember-inspector/views/list-item'], function (exports, Ember, ListView, ListItemView) {

  'use strict';

  var readOnly = Ember['default'].computed.readOnly;

  /**
   * @module Views
   * @extends Views.List
   * @class RouteList
   * @namespace Views
   */
  exports['default'] = ListView['default'].extend({
    /**
     * @property itemViewClass
     * @type {Ember.View}
     */
    itemViewClass: ListItemView['default'].extend({
      /**
       * @property templateName
       * @type {String}
       * @default 'route_item'
       */
      templateName: 'route_item',

      /**
       * TODO: Need a better way to pass this
       *
       * @property currentRoute
       * @type {String}
       */
      currentRoute: readOnly('parentView.currentRoute')
    })
  });

});
define('ember-inspector/views/route-tree', ['exports', 'ember', 'ember-inspector/mixins/fake-table'], function (exports, Ember, FakeTableMixin) {

	'use strict';

	exports['default'] = Ember['default'].View.extend(FakeTableMixin['default']);

});
define('ember-inspector/views/view-list', ['exports', 'ember', 'ember-inspector/views/list', 'ember-inspector/views/list-item'], function (exports, Ember, ListView, ListItemView) {

  'use strict';

  var readOnly = Ember['default'].computed.readOnly;

  /**
   * @module Views
   * @extends Views.List
   * @class ViewList
   * @namespace Views
   */
  exports['default'] = ListView['default'].extend({
    /**
     * @property itemViewClass
     * @type {Ember.View}
     */
    itemViewClass: ListItemView['default'].extend({
      /**
       * @property templateName
       * @type {String}
       * @default 'view_item'
       */
      templateName: 'view_item',

      /**
       * TODO: Need a better way to pass this
       *
       * @property pinnedObjectId
       * @type {Integer}
       */
      pinnedObjectId: readOnly('parentView.pinnedObjectId'),

      /**
       * @property node
       * @type {Ember.Controller}
       */
      node: readOnly('context'),

      /**
       * Needed for tests
       *
       * @property attributeBindings
       * @type {Array}
       * @default ['data-label:label']
       */
      attributeBindings: ['data-label:label'],

      /**
       * @property label
       * @type {String}
       * @default 'tree-node'
       */
      label: 'tree-node',

      /**
       * @method mouseEnter
       * @param {Object} e event object
       */
      mouseEnter: function mouseEnter(e) {
        this.get('controller').send('previewLayer', this.get('node'));
        e.stopPropagation();
      },

      /**
       * @method mouseLeave
       * @param {Object} e event object
       */
      mouseLeave: function mouseLeave(e) {
        this.get('controller').send('hidePreview', this.get('node'));
        e.stopPropagation();
      }
    })
  });

});
define('ember-inspector/views/view-tree', ['exports', 'ember', 'ember-inspector/mixins/fake-table'], function (exports, Ember, FakeTableMixin) {

	'use strict';

	exports['default'] = Ember['default'].View.extend(FakeTableMixin['default']);

});
define('ember-inspector/views/virtual-list', ['exports', 'ember-list-view/virtual-list-view'], function (exports, VirtualListView) {

	'use strict';

	exports['default'] = VirtualListView['default'];

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('ember-inspector/config/environment', ['ember'], function(Ember) {
  var prefix = 'ember-inspector';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("ember-inspector/tests/test-helper");
} else {
  require("ember-inspector/app")["default"].create({"name":"ember-inspector","version":"1.10.0.85be81a4"});
}

/* jshint ignore:end */

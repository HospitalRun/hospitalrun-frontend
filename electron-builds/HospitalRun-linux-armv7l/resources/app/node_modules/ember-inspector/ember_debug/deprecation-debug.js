import PortMixin from "ember-debug/mixins/port-mixin";
import SourceMap from "ember-debug/libs/source-map";
const Ember = window.Ember;
const { Object: EmberObject, computed, guidFor, run, RSVP, A } = Ember;
const { resolve, all } = RSVP;
const { oneWay } = computed;

export default EmberObject.extend(PortMixin, {
  portNamespace: 'deprecation',

  port: oneWay('namespace.port').readOnly(),

  adapter: oneWay('port.adapter').readOnly(),

  deprecations: computed(function() {
    return A();
  }),

  groupedDeprecations: computed(function() {
    return {};
  }),

  deprecationsToSend: computed(function() {
    return A();
  }),

  sourceMap: computed(function() {
    return SourceMap.create();
  }),

  emberCliConfig: oneWay('namespace.generalDebug.emberCliConfig').readOnly(),

  init() {
    this._super();
    this.replaceDeprecate();
  },

  /**
   * Checks if ember-cli and looks for source maps.
   */
  fetchSourceMap(stackStr) {
    if (this.get('emberCliConfig') && this.get('emberCliConfig.environment') === 'development') {
      return this.get('sourceMap').map(stackStr).then(mapped => {
        if (mapped && mapped.length > 0) {
          let source = mapped.find(
            item => item.source && !!item.source.match(new RegExp(this.get('emberCliConfig.modulePrefix'))));

          if (source) {
            source.found = true;
          } else {
            source = mapped.get('firstObject');
            source.found = false;
          }
          return source;
        }
      }, null, 'ember-inspector');
    } else {
      return resolve(null, 'ember-inspector');
    }

  },

  sendPending() {
    let deprecations = A();

    let promises = all(this.get('deprecationsToSend').map(deprecation => {
      let obj;
      let promise = resolve(undefined, 'ember-inspector');
      let grouped = this.get('groupedDeprecations');
      this.get('deprecations').pushObject(deprecation);
      const id = guidFor(deprecation.message);
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
      let found = obj.sources.findBy('stackStr', deprecation.stackStr);
      if (!found) {
        let stackStr = deprecation.stackStr;
        promise = this.fetchSourceMap(stackStr).then(map => {
          obj.sources.pushObject({ map, stackStr });
          if (map) {
            obj.hasSourceMap = true;
          }
        }, null, 'ember-inspector');
      }
      return promise.then(() => {
        delete obj.stackStr;
        deprecations.addObject(obj);
      }, null, 'ember-inspector');
    }));

    promises.then(() => {
      this.sendMessage('deprecationsAdded', { deprecations });
      this.get('deprecationsToSend').clear();
      this.sendCount();
    }, null, 'ember-inspector');
  },

  sendCount() {
    this.sendMessage('count', {
      count: this.get('deprecations.length') + this.get('deprecationsToSend.length')
    });
  },

  messages: {
    watch() {
      this._watching = true;
      let grouped = this.get('groupedDeprecations');
      let deprecations = [];
      for (let i in grouped) {
        if (!grouped.hasOwnProperty(i)) {
          continue;
        }
        deprecations.push(grouped[i]);
      }
      this.sendMessage('deprecationsAdded', {
        deprecations
      });
      this.sendPending();
    },

    sendStackTraces(message) {
      let deprecation = message.deprecation;
      deprecation.sources.forEach(source => {
        let stack = source.stackStr;
        stack = stack.split('\n');
        stack.unshift(`Ember Inspector (Deprecation Trace): ${deprecation.message || ''}`);
        this.get('adapter').log(stack.join('\n'));
      });
    },

    getCount() {
      this.sendCount();
    },

    clear() {
      run.cancel(this.debounce);
      this.get('deprecations').clear();
      this.set('groupedDeprecations', {});
      this.sendCount();
    },

    release() {
      this._watching = false;
    }
  },

  willDestroy() {
    Ember.deprecate = this.originalDeprecate;
    this.originalDeprecate = null;
    run.cancel(this.debounce);
    return this._super(...arguments);
  },

  replaceDeprecate() {
    let self = this;
    this.originalDeprecate = Ember.deprecate;

    Ember.deprecate = function(message, test, options) {
      /* global __fail__*/
      // Code taken from https://github.com/emberjs/ember.js/blob/master/packages/ember-debug/lib/main.js
      let noDeprecation;

      if (typeof test === 'function' && !(EmberObject.detect(test))) {
        // try/catch to support old Ember versions
        try { noDeprecation = test(); }
        catch (e) {
          noDeprecation = true;
        }
      } else {
        noDeprecation = test;
      }

      if (noDeprecation) { return; }

      let error;

      // When using new Error, we can't do the arguments check for Chrome. Alternatives are welcome
      try { __fail__.fail(); } catch (e) { error = e; }

      let stack;
      let stackStr = '';
      if (error.stack) {

        // var stack;
        if (error['arguments']) {
          // Chrome
          stack = error.stack.replace(/^\s+at\s+/gm, '').
          replace(/^([^\(]+?)([\n$])/gm, '{anonymous}($1)$2').
          replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}($1)').split('\n');
          stack.shift();
        } else {
          // Firefox
          stack = error.stack.replace(/(?:\n@:0)?\s+$/m, '').
          replace(/^\(/gm, '{anonymous}(').split('\n');
        }

        stackStr = `\n    ${stack.slice(2).join("\n    ")}`;
      }

      let url;
      if (arguments.length === 3 && options && typeof options === 'object') {
        url = options.url;
      }

      const deprecation = { message, stackStr, url };

      // For ember-debug testing we usually don't want
      // to catch deprecations
      if (!self.get('namespace').IGNORE_DEPRECATIONS) {
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
      }
    };
  }

});

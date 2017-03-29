/* eslint no-empty:0 */
import PortMixin from "ember-debug/mixins/port-mixin";
const Ember = window.Ember;
const { $, computed, Object: EmberObject, A } = Ember;
let { libraries } = Ember;
const { oneWay } = computed;

const GeneralDebug = EmberObject.extend(PortMixin, {
  namespace: null,

  port: oneWay('namespace.port').readOnly(),

  application: oneWay('namespace.application').readOnly(),

  promiseDebug: oneWay('namespace.promiseDebug').readOnly(),

  portNamespace: 'general',

  // Keep an eye on https://github.com/ember-cli/ember-cli/issues/3045
  emberCliConfig: computed(function() {
    let config;
    $('meta[name]').each(function() {
      const meta = $(this);
      let match = meta.attr('name').match(/environment$/);
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


  sendBooted() {
    this.sendMessage('applicationBooted', {
      booted: this.get('application.__inspector__booted')
    });
  },

  sendReset() {
    this.sendMessage('reset', {
      reset: true
    });
  },

  messages: {
    applicationBooted() {
      this.sendBooted();
    },
    getLibraries() {

      // Ember has changed where the array of libraries is located.
      // In older versions, `Ember.libraries` was the array itself,
      // but now it's found under _registry.
      if (libraries._registry) {
        libraries = libraries._registry;
      }

      this.sendMessage('libraries', { libraries: arrayize(libraries) });
    },
    refresh() {
      window.location.reload();
    }
  }
});

function arrayize(enumerable) {
  return A(enumerable).map(item => item);
}

export default GeneralDebug;

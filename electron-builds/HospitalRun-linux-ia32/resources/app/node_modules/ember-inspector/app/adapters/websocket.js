import Ember from "ember";
import BasicAdapter from "./basic";
const { computed } = Ember;

export default BasicAdapter.extend({
  init() {
    this._super();
    this._connect();
  },

  sendMessage(options) {
    options = options || {};
    this.get('socket').emit('emberInspectorMessage', options);
  },

  socket: computed(() => window.EMBER_INSPECTOR_CONFIG.remoteDebugSocket),

  _connect() {
    this.get('socket').on('emberInspectorMessage', message => {
      Ember.run(() => {
        this._messageReceived(message);
      });
    });
  },

  _disconnect() {
    this.get('socket').removeAllListeners("emberInspectorMessage");
  },

  willDestroy() {
    this._disconnect();
  }
});


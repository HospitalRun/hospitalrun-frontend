import BasicAdapter from "./basic";
const Ember = window.Ember;
const { $, computed, run, RSVP: { Promise } } = Ember;

export default BasicAdapter.extend({

  sendMessage(options) {
    options = options || {};
    this.get('socket').emit('emberInspectorMessage', options);
  },

  socket: computed(function() {
    return window.EMBER_INSPECTOR_CONFIG.remoteDebugSocket;
  }),

  _listen() {
    this.get('socket').on('emberInspectorMessage', message => {
      run(() => {
        this._messageReceived(message);
      });
    });
  },

  _disconnect() {
    this.get('socket').removeAllListeners("emberInspectorMessage");
  },

  connect() {
    return new Promise((resolve, reject) => {
      $(() => {
        if (this.isDestroyed) { reject(); }
        const EMBER_INSPECTOR_CONFIG = window.EMBER_INSPECTOR_CONFIG;
        if (typeof EMBER_INSPECTOR_CONFIG === 'object' && EMBER_INSPECTOR_CONFIG.remoteDebugSocket) {
          resolve();
        }
      });
    }).then(() => {
      this._listen();
    });
  },

  willDestroy() {
    this._disconnect();
  }
});


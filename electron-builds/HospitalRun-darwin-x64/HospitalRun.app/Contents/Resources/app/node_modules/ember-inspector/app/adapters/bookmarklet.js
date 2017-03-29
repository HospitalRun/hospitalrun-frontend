import BasicAdapter from "./basic";
import Ember from 'ember';
const { computed } = Ember;

export default BasicAdapter.extend({
  name: 'bookmarklet',

  /**
   * Called when the adapter is created.
   *
   * @method init
   */
  init() {
    this._connect();
    return this._super(...arguments);
  },

  inspectedWindow: computed(function() {
    return window.opener || window.parent;
  }),

  inspectedWindowURL: computed(function() {
    return loadPageVar('inspectedWindowURL');
  }),

  sendMessage(options) {
    options = options || {};
    this.get('inspectedWindow').postMessage(options, this.get('inspectedWindowURL'));
  },

  /**
   * Redirect to the correct inspector version.
   *
   * @method onVersionMismatch
   * @param {String} goToVersion
   */
  onVersionMismatch(goToVersion) {
    this.sendMessage({ name: 'version-mismatch', version: goToVersion });
    window.location.href = `../panes-${goToVersion.replace(/\./g, '-')}/index.html${window.location.search}`;
  },

  _connect() {
    window.addEventListener('message', e => {
      let message = e.data;
      if (e.origin !== this.get('inspectedWindowURL')) {
        return;
      }
      // close inspector if inspected window is unloading
      if (message && message.unloading) {
        window.close();
      }
      if (message.from === 'inspectedWindow') {
        this._messageReceived(message);
      }
    });
  }
});


function loadPageVar (sVar) {
  return decodeURI(window.location.search.replace(new RegExp(`^(?:.*[&\\?]${encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&")}(?:\\=([^&]*))?)?.*$`, "i"), "$1"));
}

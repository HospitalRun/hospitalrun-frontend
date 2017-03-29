import Ember from "ember";
import BasicAdapter from "./basic";

export default BasicAdapter.extend({
  name: 'firefox',

  /**
   * Called when the adapter is created.
   *
   * @method init
   */
  init() {
    this._connect();
    return this._super(...arguments);
  },

  sendMessage(options) {
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
  onVersionMismatch(version) {
    this.sendMessage({ type: `injectEmberDebug`, version });
    window.location.href = `../panes-${version.replace(/\./g, '-')}/index.html`;
  },

  _connect() {
    // NOTE: chrome adapter sends a appId message on connect (not needed on firefox)
    //this.sendMessage({ appId: "test" });
    this._onMessage = this._onMessage.bind(this);
    window.addEventListener("message", this._onMessage, false);
  },

  _onMessage(evt) {
    if (this.isDestroyed || this.isDestroying) {
      window.removeEventListener("message", this._onMessage, false);
      return;
    }

    const message = evt.data;
    // check if the event is originated by our privileged ember inspector code
    if (evt.isTrusted) {
      if (typeof message.type === 'string' && message.type === 'iframes') {
        this._sendIframes(message.urls);
      } else {
        // We clone the object so that Ember prototype extensions
        // are applied.
        this._messageReceived(Ember.$.extend(true, {}, message));
      }
    } else {
      console.log("EMBER INSPECTOR: ignored post message", evt);
    }
  },

  _sendIframes(urls) {
    urls.forEach(url => {
      this.sendMessage({ type: 'injectEmberDebug', frameURL: url });
    });
  },

  canOpenResource: true,

  openResource(file, line) {
    this.sendMessage({
      type: 'devtools:openSource',
      url: file,
      line
    });
  }

});

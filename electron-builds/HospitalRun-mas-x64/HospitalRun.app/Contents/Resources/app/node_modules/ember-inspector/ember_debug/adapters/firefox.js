/* eslint no-empty:0 */
import BasicAdapter from "./basic";
const Ember = window.Ember;
const { run } = Ember;

export default BasicAdapter.extend({
  init() {
    this._super();
    this._listen();
  },

  debug() {
    // WORKAROUND: temporarily workaround issues with firebug console object:
    // - https://github.com/tildeio/ember-extension/issues/94
    // - https://github.com/firebug/firebug/pull/109
    // - https://code.google.com/p/fbug/issues/detail?id=7045
    try {
      this._super(...arguments);
    } catch (e) { }
  },
  log() {
    // WORKAROUND: temporarily workaround issues with firebug console object:
    // - https://github.com/tildeio/ember-extension/issues/94
    // - https://github.com/firebug/firebug/pull/109
    // - https://code.google.com/p/fbug/issues/detail?id=7045
    try {
      this._super(...arguments);
    } catch (e) { }
  },

  sendMessage(options) {
    options = options || {};
    let event = document.createEvent("CustomEvent");
    event.initCustomEvent("ember-debug-send", true, true, options);
    document.documentElement.dispatchEvent(event);
  },

  inspectElement(elem) {
    this.sendMessage({
      type: 'view:devtools:inspectDOMElement',
      elementSelector: `#${elem.getAttribute('id')}`
    });
  },

  _listen() {

    window.addEventListener('ember-debug-receive', event => {
      let message = event.detail;
      run(() => {
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
        this._messageReceived(message);
      });
    });
  }

});

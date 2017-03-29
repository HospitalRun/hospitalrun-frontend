import BasicAdapter from "./basic";
const Ember = window.Ember;
const { computed, run, $: { extend } } = Ember;
const { isArray } = Array;
const { keys } = Object;

export default BasicAdapter.extend({
  connect() {
    const channel = this.get('_channel');
    return this._super(...arguments).then(() => {
      window.postMessage('debugger-client', '*', [channel.port2]);
      this._listen();
    }, null, 'ember-inspector');
  },

  sendMessage(options) {
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

  /**
   * Open the devtools "Elements" and select an element.
   *
   * NOTE:
   * This method was supposed to call `inspect` which is a Chrome specific function
   * that can either be called from the console or from code evaled using `inspectedWindow.eval`
   * (which is how this code is executed). See https://developer.chrome.com/extensions/devtools#evaluating-js.
   * However for some reason Chrome 52+ has started throwing an Error that `inspect`
   * is not a function when called from this code. The current workaround is to
   * message the Ember Ibspector asking it to execute `inspected.Window.eval('inspect(element)')`
   * for us.
   *
   * @param  {HTMLElement} elem The element to select
   */
  inspectElement(elem) {
    /* inspect(elem); */
    this.get('namespace.port').send('view:inspectDOMElement', {
      elementSelector: `#${elem.getAttribute('id')}`
    });
  },

  _channel: computed(function() {
    return new MessageChannel();
  }).readOnly(),

  _chromePort: computed(function() {
    return this.get('_channel.port1');
  }).readOnly(),

  _listen() {
    let chromePort = this.get('_chromePort');

    chromePort.addEventListener('message', event => {
      const message = event.data;
      run(() => {
        this._messageReceived(message);
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
    item.forEach((child, key) => {
      item[key] = deepCloneArrays(child);
    });
  } else if (item && typeof item === 'object') {
    keys(item).forEach(key => {
      item[key] = deepCloneArrays(item[key]);
    });
  }
  return item;
}

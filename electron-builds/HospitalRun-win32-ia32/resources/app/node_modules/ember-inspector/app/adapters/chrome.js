/* globals chrome */
import BasicAdapter from "./basic";
import Ember from 'ember';
import config from 'ember-inspector/config/environment';
const { computed } = Ember;

let emberDebug = null;

export default BasicAdapter.extend({
  /**
   * Called when the adapter is created.
   *
   * @method init
   */
  init() {
    this._connect();
    this._handleReload();
    this._injectDebugger();
    return this._super(...arguments);
  },

  name: 'chrome',

  sendMessage(options) {
    options = options || {};
    this.get('_chromePort').postMessage(options);
  },

  _chromePort: computed(function() {
    return chrome.extension.connect();
  }),

  _connect() {
    let chromePort = this.get('_chromePort');
    chromePort.postMessage({ appId: chrome.devtools.inspectedWindow.tabId });

    chromePort.onMessage.addListener(message => {
      if (typeof message.type === 'string' && message.type === 'iframes') {
        sendIframes(message.urls);
      }
      this._messageReceived(message);
    });
  },

  _handleReload() {
    let self = this;
    chrome.devtools.network.onNavigated.addListener(function() {
      self._injectDebugger();
      location.reload(true);
    });
  },

  _injectDebugger() {
    chrome.devtools.inspectedWindow.eval(loadEmberDebug());
    chrome.devtools.inspectedWindow.onResourceAdded.addListener(function(opts) {
      if (opts.type === 'document') {
        sendIframes([opts.url]);
      }
    });
  },

  willReload() {
    this._injectDebugger();
  },

  /**
   * Open the devtools "Elements" tab and select a specific DOM element.
   *
   * @method inspectDOMElement
   * @param  {String} selector jQuery selector
   */
  inspectDOMElement(selector) {
    chrome.devtools.inspectedWindow.eval(`inspect($('${selector}')[0])`);
  },

  /**
   * Redirect to the correct inspector version.
   *
   * @method onVersionMismatch
   * @param {String} goToVersion
   */
  onVersionMismatch(goToVersion) {
    window.location.href = `../panes-${goToVersion.replace(/\./g, '-')}/index.html`;
  },

  /**
    We handle the reload here so we can inject
    scripts as soon as possible into the new page.
  */
  reloadTab() {
    chrome.devtools.inspectedWindow.reload({
      injectedScript: loadEmberDebug()
    });
  },

  canOpenResource: true,

  openResource(file, line) {
    /*global chrome */
    // For some reason it opens the line after the one specified
    chrome.devtools.panels.openResource(file, line - 1);
  }

});

function sendIframes(urls) {
  urls.forEach(url => {
    chrome.devtools.inspectedWindow.eval(loadEmberDebug(), { frameURL: url });
  });
}

function loadEmberDebug() {
  let minimumVersion = config.emberVersionsSupported[0].replace(/\./g, '-');
  let xhr;
  if (!emberDebug) {
    xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL(`/panes-${minimumVersion}/ember_debug.js`), false);
    xhr.send();
    emberDebug = xhr.responseText;
  }
  return emberDebug;
}

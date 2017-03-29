/*global chrome*/

/**
 * Long lived background script running in the browser, works in tandem with the
 * client-script to coordinate messaging between EmberDebug, EmberInspector and the
 * ClientApp.  The background-script serves as a proxy between the EmberInspector
 * and the content-script.
 *
 * It is also responsible for showing the Tomster icon and tooltip in the url bar.
 *
 * See:
 *     https://developer.chrome.com/extensions/background_pages
 *     https://developer.chrome.com/extensions/messaging
 */
(function() {
  "use strict";

  var activeTabs = {},
      emberInspectorChromePorts = {};

  /**
   * Creates the tooltip string to show the version of libraries used in the ClientApp
   * @param  {Array} versions - array of library objects
   * @return {String} - string of library names and versions
   */
  function generateVersionsTooltip(versions) {
    return versions.map(function(lib) {
      return lib.name + " " + lib.version;
    }).join("\n");
  }

  /**
   * Creates the title for the pageAction for the current ClientApp
   * @param {Number} tabId - the current tab
   */
  function setActionTitle(tabId){
    chrome.pageAction.setTitle({
      tabId: tabId,
      title: generateVersionsTooltip(activeTabs[tabId])
    });
  }

  /**
   * Update the tab's pageAction: https://developer.chrome.com/extensions/pageAction
   * If the user has choosen to display it, the icon is shown and the title
   * is updated to display the ClientApp's information in the tooltip.
   * @param {Number} tabId - the current tab
   */
  function updateTabAction(tabId){
    chrome.storage.sync.get("options", function(data) {
      if (!data.options.showTomster) { return; }
      chrome.pageAction.show(tabId);
      setActionTitle(tabId);
    });
  }

  /**
   * Remove the curent tab's Tomster.
   * Typically used to clearout the icon after reload.
   * @param {Number} tabId - the current tab
   */
  function hideAction(tabId){
    delete activeTabs[tabId];
    chrome.pageAction.hide(tabId);
  }

  /**
   * Listen for a connection request from the EmberInspector.
   * When the EmberInspector connects to the extension a messageListener
   * is added for the specific EmberInspector instance, and saved into
   * an array, keyed by appId.
   *
   * @param {Port} emberInspectorChromePort
   */
  chrome.extension.onConnect.addListener(function(emberInspectorChromePort) {
    var appId;

    /**
     * Listen for messages from the EmberInspector.
     * The first message is used to save the port, all others are forwarded
     * to the content-script.
     * @param {Message} message
     */
    emberInspectorChromePort.onMessage.addListener(function(message) {
      // if the message contains the appId, this is the first
      // message and the appId is used to map the port for this app.
      if (message.appId) {
        appId = message.appId;

        emberInspectorChromePorts[appId] = emberInspectorChromePort;

        emberInspectorChromePort.onDisconnect.addListener(function() {
          delete emberInspectorChromePorts[appId];
        });
      } else if (message.from === 'devtools') {
        // all other messages from EmberInspector are forwarded to the content-script
        // https://developer.chrome.com/extensions/tabs#method-sendMessage
        chrome.tabs.sendMessage(appId, message);
      }
    });
  });

  /**
   * Listen for messages from the content-script.
   * A few events trigger specfic behavior, all others are forwarded to EmberInspector.
   * @param {Object} request
   * @param {MessageSender} sender
   */
  chrome.extension.onMessage.addListener(function(request, sender) {
    // only listen to messages from the content-script
    if (!sender.tab) {
      // noop
    } else if (request && request.type === 'emberVersion') {
      // set the version info and update title
      activeTabs[sender.tab.id] = request.versions;
      updateTabAction(sender.tab.id);
    } else if (request && request.type === 'resetEmberIcon') {
      // hide the Tomster icon
      hideAction(sender.tab.id);
    } else {
      // forward the message to EmberInspector
      var emberInspectorChromePort = emberInspectorChromePorts[sender.tab.id];
      if (emberInspectorChromePort) { emberInspectorChromePort.postMessage(request); }
    }
  });



  /**
   * Event listener for when the tab is updated, usually reloaded.
   * Check to see if a ClientApp exists for this tab, and reset the icon
   * to show the latest data.
   * @param {Number} tabId - the current tab
   */
  chrome.tabs.onUpdated.addListener(function(tabId) {
    if (activeTabs[tabId]) {
      updateTabAction(tabId);
    }
  });

}());

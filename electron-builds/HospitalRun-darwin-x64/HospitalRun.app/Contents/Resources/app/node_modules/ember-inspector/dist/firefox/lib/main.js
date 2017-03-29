const { registerDevTool, unregisterDevTool } = require("./devtools-utils");

const { devtoolTabDefinition } = require("./tomster-devtool-panel");

const tomsterTabs = require("./tomster-tabs");

startup();

function startup() {
  registerDevTool(devtoolTabDefinition);
}

function shutdown() {
  unregisterDevTool(devtoolTabDefinition);
}

/* optional tomster locationbar button */
const tomsterButton = require('./tomster-locationbar-button.js');

const simplePrefs = require("sdk/simple-prefs");

if (simplePrefs.prefs["tomsterLocationbarButtonToggle"]) {
  tomsterButton.enable();
}

simplePrefs.on("tomsterLocationbarButtonToggle", (prefName) => {
  let enabled = simplePrefs.prefs[prefName];
  enabled ? tomsterButton.enable() : tomsterButton.disable();
});

exports.onUnload = function() {
  shutdown();
  tomsterTabs.destroy();
  tomsterButton.disable();
};

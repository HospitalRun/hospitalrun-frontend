/*global chrome*/

/**
 * Run when devtools.html is automatically added to the Chrome devtools panels.
 * It creates a new pane using the panes/index.html which includes EmberInspector.
 */
var panelWindow, injectedPanel = false, injectedPage = false, panelVisible = false, savedStack = [];

chrome.devtools.panels.create("Ember", "images/ember-icon-final.png", "panes-2-7-0/index.html");

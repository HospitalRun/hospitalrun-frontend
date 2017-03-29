const { data, version } = require("sdk/self");

const { openEmberInspector } = require("./tomster-devtool-panel");

const tabs = require("./tomster-tabs");

const { UrlbarButton } = require("./urlbarbutton");

const { Panel } = require("sdk/panel");

const TOMSTER_BUTTON_ID = "ember-inspector-toolbarbutton";

let button, panel;

exports.enable = enable;
exports.disable = disable;

function enable() {
  panel = createPanel();

  button = UrlbarButton({
    id: TOMSTER_BUTTON_ID,
    image : data.url("{{PANE_ROOT}}/assets/images/icon19.png"),
    // TODO: Warning for a panel hooked to a locationbar button:
    // "Passing a DOM node to Panel.show() method is an unsupported feature
    //  that will be soon replaced. See:
    //  https://bugzilla.mozilla.org/show_bug.cgi?id=878877"
    panel: panel,
    tooltip : 'Ember Inspector',
  });

  tabs.on('open', hidePanel);

  ['activate', 'ready', 'emberVersion'].forEach( (event) => {
    tabs.on(event, refreshButton);
  });
}

function disable() {
  try {
    // unregister anchor widget from australis customizable ui jsm
    let { Cu } = require("chrome");
    Cu.import("resource://app/modules/CustomizableUI.jsm");
    CustomizableUI.removeWidgetFromArea(TOMSTER_BUTTON_ID);
    CustomizableUI.destroyWidget(TOMSTER_BUTTON_ID);
  } catch(e) {
    console.error(e);
  }

  tabs.removeListener('open', hidePanel);

  ['activate', 'ready', 'emberVersion'].forEach( (event) => {
    tabs.removeListener(event, refreshButton);
  });

  if (button) {
    button.remove();
    button = null;
    panel.destroy();
    panel = null;
  }
}

function hidePanel() {
  panel.hide();
}

function refreshButton(tab) {
  button.setVisibility(false, tab.url);
  let libs = tabs.getLibrariesByTabId(tab.id);
  if (libs) {
    button.setVisibility(true, libs.url);
    refreshPanel(tab.url, libs);
  }
}

function refreshPanel(url, libraries) {
  libraries.inspectorVersion = version;
  panel.port.emit("emberVersion", libraries);
}

function createPanel() {
  let panel = Panel({
    contentURL: data.url("toolbar-button-panel.html")
  });

  panel.on("show", () => {
    let tab = tabs.activeTab;
    refreshPanel(tab.url, tabs.getLibrariesByTabId(tab.id));
  });

  panel.port.on('panelResize', (width, height) => {
    panel.height = height + 40;
  });

  panel.port.on('openEmberInspector', () => {
    panel.hide();
    openEmberInspector();
  });

  return panel;
}

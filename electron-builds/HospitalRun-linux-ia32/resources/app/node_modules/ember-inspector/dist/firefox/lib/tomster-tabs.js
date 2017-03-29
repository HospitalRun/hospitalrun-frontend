const { Class } = require('sdk/core/heritage');

const { data } = require("sdk/self");

const { PageMod } = require("sdk/page-mod");
const { emit, on, off, once } = require("sdk/event/core");
const { EventTarget } = require("sdk/event/target");

const tabs = require("sdk/tabs");

const emberVersions = require('./ember-versions');
const previousVersions = emberVersions.previous;
const supportedVersions = emberVersions.supported;


// route open/active/ready events (needed by tomster-locationbar-button)
let emitTomsterTabsOpen = (tab) => emit(tomsterTabs, 'open', tab);
let emitTomsterTabsActivate = (tab) => emit(tomsterTabs, 'activate', tab);
let emitTomsterTabsReady = (tab) => emit(tomsterTabs, 'ready', tab);

tabs.on('open', emitTomsterTabsOpen);
tabs.on('activate', emitTomsterTabsActivate);
tabs.on('ready', emitTomsterTabsReady);

// track attached workers and ember libraries detected by tab.id
let workers = new Set();
let workersByTabId = new Map();
let libraries = new Map();

// simplified tabs tracker class
const Tabs = Class({
  extends: EventTarget,
  get activeTab() tabs.activeTab,
  attachExistentWorkersByTabId: function (tabId) {
    var selectedWorkers = workersByTabId.get(tabId);
    if (selectedWorkers) {
      selectedWorkers.forEach((w) => {
        emit(this, "emberAttach", { tabId: tabId, worker: w });
      });
    }
  },
  hasWorkersByTabId: function (tabId) {
    let selectedWorkers = workersByTabId.get(tabId);
    if (!!selectedWorkers && selectedWorkers.size) {
      return true;
    } else {
      return false;
    }
  },
  sendToWorkersByTabId: function (tabId, name, msg) {
    var selectedWorkers = workersByTabId.get(tabId);
    if (selectedWorkers) {
      selectedWorkers.forEach((w) => {
        try {
          w.port.emit(name, msg);
        } catch(e) {
          console.error("EXCEPTION", e);
        }
      });
    }
  },
  getLibrariesByTabId: function (tabId) {
    return libraries.get(tabId);
  },
  destroy: function () {
    // NOTE: prevents leaks ("can't access dead object" exceptions
    // from "sdk/tabs/tab-firefox:104" after disabling the addon
    [...workers].
          map((w) => w.tab).
          filter((tab) => !!tab).
          sort().
          filter((tab, i, a) => (i == a.indexOf(tab))).
          forEach((tab) => {
            tab.destroy();
          });
  }
});

// exports tab tracker instance
let tomsterTabs = Tabs();
module.exports = tomsterTabs;


let contentScriptOptions = {
  emberInPageScript: data.load("scripts/in-page-script.js")
};

previousVersions.concat([supportedVersions[0]]).forEach((version) => {
  let dashedVersion = version.replace(/\./g, '-');
  contentScriptOptions['emberDebugScript-' + dashedVersion] = data.load('panes-' + dashedVersion + '/ember_debug.js');
});

// create a page monitor to check ember versions and route
// ember debug messages when needed
let pageMod = PageMod({
  include: "*",
  include: ["*", "file://*"],
  attachTo: ["top", "frame", "existing"],
  contentScriptFile: data.url('content-script.js'),
  contentScriptOptions: contentScriptOptions,
  contentScriptWhen: "start",
  onAttach: (worker) => {
    console.debug("ON ATTACH WORKER", worker);
    workers.add(worker);
    let tabId = worker.tab.id;
    let workersSet = workersByTabId.get(tabId);
    if (!workersSet) {
      workersSet = new Set();
      workersByTabId.set(tabId, workersSet);
    }

    workersSet.add(worker);

    attachWorker(worker);
    worker.on('pagehide', () => {
      workersSet.delete(worker);
    });
    worker.on('pageshow', () => {
      workersSet.add(worker);
    });

    worker.once('detach', () => {
      console.debug("DETACH WORKER", worker);
      workersSet.delete(worker);
      workers.delete(worker);
      libraries.delete(tabId);
      emit(tomsterTabs, "emberDetach", { tabId: tabId, worker: worker });
      console.debug("NUMBER OF ATTACHED WORKERS", workers.size);
    });

    emit(tomsterTabs, "emberAttach", { tabId: tabId, worker: worker });
  }
});

function attachWorker(worker) {
  worker.port.on("emberVersion", routeEmberVersion);
  worker.port.on("emberDebug", routeEmberDebug);

  worker.once('detach', () => {
    console.debug("CLEANUP WORKER PORT LISTENERS", worker);
    worker.port.removeListener("emberVersion", routeEmberVersion);
    worker.port.removeListener("emberDebug", routeEmberDebug);
  });

  function routeEmberVersion(msg) {
    if (worker.tab) {
      let previousLibrary = libraries.get(worker.tab.id);

     // NOTE: filter iframe if we have already libraries from the parent window
      if ((worker.url !== worker.tab.url) && !!previousLibrary &&
          previousLibrary.versions.length > 0) {
        return;
      }

      msg.url = worker.tab.url;
      msg.realUrl = worker.url;
      console.debug("DETECTED EMBER VERSION", msg);
      libraries.set(worker.tab.id, msg);
      emit(tomsterTabs, "emberVersion", worker.tab);
    }
  }

  function routeEmberDebug(msg) {
    // filter workers without an associated tab
    if (!worker.tab) {
      return null;
    }

    emit(tomsterTabs, "emberDebug", { tabId: worker.tab.id,
                                      worker: worker,
                                      url: worker.url,
                                      data: msg });
  }
}

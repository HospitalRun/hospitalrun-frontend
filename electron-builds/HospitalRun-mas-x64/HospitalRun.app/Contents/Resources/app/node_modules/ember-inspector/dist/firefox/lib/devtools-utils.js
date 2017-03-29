var { Cu, Cc, Ci } = require("chrome");

const self = require("sdk/self");

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

function importDevTools(name) {
  // The path to this file was moved in Firefox 44 and later.
  // See https://bugzil.la/912121 and https://bugzil.la/1203159
  // for more details.
  let value;
  try {
    value = Cu.import("resource://devtools/client/framework/gDevTools.jsm",
                      {})[name];
  } catch (e) {
    value = Cu.import("resource:///modules/devtools/gDevTools.jsm", {})[name];
  }
  return value;
}

XPCOMUtils.defineLazyGetter(this, "gDevTools", () => {
  return importDevTools("gDevTools");
});
XPCOMUtils.defineLazyGetter(this, "gDevToolsBrowser", () => {
  return importDevTools("gDevToolsBrowser");
});

var Promise = require("sdk/core/promise.js");

const { getMostRecentBrowserWindow } = require("sdk/window/utils");

exports.registerDevTool = function (toolDef) {
  gDevTools.registerTool(toolDef);
};

exports.unregisterDevTool = function (toolDef) {
  gDevTools.unregisterTool(toolDef);
};

exports.openDevTool = function(toolId) {
  let activeBrowserWindow = getMostRecentBrowserWindow();
  let { gBrowser } = activeBrowserWindow;
  return gDevToolsBrowser.selectToolCommand(gBrowser, toolId);
};

exports.inspectDOMElement = function(target, selector, toolId) {
  return gDevTools.showToolbox(target, "inspector").then(toolbox => {
    let sel = toolbox.getCurrentPanel().selection;
    sel.setNode(sel.document.querySelector(selector), toolId);
  });
};

exports.openSource = function(target, url, line) {
   return gDevTools.showToolbox(target, "jsdebugger").then(toolbox => {
    let dbg = toolbox.getCurrentPanel().panelWin;

    return onSourcesLoaded(dbg).then(() => {
      let { DebuggerView } = dbg;
      let { Sources } = DebuggerView;
      let item = Sources.getItemForAttachment(a => a.source.url === url);
      if (item) {
        let options = { noDebug: true };
        let actor = item.attachment.source.actor;
        // Firefox >= 36
        return DebuggerView.setEditorLocation(actor, line, options).then(null, () => {
          // Firefox <= 35
          return DebuggerView.setEditorLocation(url, line, options);
        });
      } else {
        return Promise.reject("Couldn't find the specified source in the debugger.");
      }
    });
  });
};

function onSourcesLoaded(dbg) {
  let { resolve, promise } = Promise.defer();
  let { DebuggerView: { Sources } } = dbg;

  if (Sources.items.length > 0) {
    resolve();
  } else {
    resolve(dbg.once(dbg.EVENTS.SOURCES_ADDED));
  }
  return promise;
}

exports.evaluateFileOnTargetWindow = function(target, fileUrl) {
  let { resolve, reject, promise } = Promise.defer();

  let fileSource = self.data.load(fileUrl);

  // evaluate ember_debug source in the target tab
  // (and resolve/reject accordingly)
  consoleFor(target).
    then(({webconsoleClient, debuggerClient}) => {
      webconsoleClient.evaluateJS(fileSource, (res) => {
        if (res.error || res.exception) {
          reject(res.error, res.exception);
        } else {
          resolve(res);
        }
      }, { url: self.data.url(fileUrl) });
    }, () => reject("consoleFor rejected"));

  return promise;
};

function consoleFor(target) {
  if (!target.client) {
    return target.makeRemote().then(() => {
      consoleFor(target);
    }, (e) => {
      throw e;
    });
  }

  let { client, form: { consoleActor } } = target;

  let { resolve, reject, promise } = Promise.defer();

  client.attachConsole(consoleActor, [], (res, webconsoleClient) => {
    if (res.error) {
      reject(res.error);
    } else {
      resolve({
        webconsoleClient: webconsoleClient,
        debuggerClient: client
      });
    }
  });

  return promise;
};

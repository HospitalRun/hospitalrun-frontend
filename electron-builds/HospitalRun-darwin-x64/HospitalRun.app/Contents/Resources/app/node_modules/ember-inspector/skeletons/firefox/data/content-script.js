console.debug("LOADING CONTENT SCRIPT", window.location && window.location.href);

init();

function init() {
  window.addEventListener("message", onEmberVersion, true);
  document.addEventListener("ember-debug-send", onEmberDebugEvent, false);
  self.port.on("emberDevTool", onEmberInspectorMessage);
  self.port.on("injectEmberDebug", onInjectEmberDebug);

  // NOTE: needed to cleanup on legacy Firefox versions
  self.on("detach", onCleanupListeners);
  // NOTE: needed to cleanup on Firefox >= 29
  self.port.on("detach", onCleanupListeners);

  self.port.emit("resetEmberIcon", { type: "resetEmberIcon" });
  injectInPageScript();
  sendIframes();

  // let ember-debug know that content script has executed
  document.documentElement.dataset.emberExtension = 1;

  // Allow older versions of Ember (< 1.4) to detect the extension.
  if (document.body) {
    document.body.dataset.emberExtension = 1;
  }
}

function onCleanupListeners() {
  try {
    window.removeEventListener("message", onEmberVersion, true);
  } catch(e) {}
  try {
    document.removeEventListener("ember-debug-send", onEmberDebugEvent, false);
  } catch(e) {}
  try {
    self.port.removeListener("emberDevTool", onEmberInspectorMessage);
  } catch(e) {}
  try {
    self.port.removeListener("injectEmberDebug", onInjectEmberDebug);
  } catch(e) {}
}

function onEmberVersion(message) {
  var data = message.wrappedJSObject.data;
  if (data && data.type === "emberVersion") {
    self.port.emit("emberVersion", data);
  }
}

function onInjectEmberDebug(version) {
  document.defaultView.eval(self.options['emberDebugScript-' + version.replace(/\./g, '-')]);
}

function injectInPageScript() {
  if (window.document.readyState == "complete") {
    document.defaultView.eval(self.options.emberInPageScript);
  } else {
    setTimeout(injectInPageScript, 100);
  }
}

function sendIframes() {
  var iframes = document.getElementsByTagName('iframe');
  var urls = [];
  for (var i = 0, l = iframes.length; i < l; i ++) {
    urls.push(iframes[i].src);
  }

  // FIXME
  setTimeout(function() {
    self.port.emit("emberDebug", { type: 'iframes', urls: urls});
  }, 500);
}

function onEmberInspectorMessage(message) {
  //console.debug("content-script: ember debug receive", message);

  let event = document.createEvent("CustomEvent");

  // FIX: needed to fix permission denied exception on Firefox >= 30
  // - https://github.com/emberjs/ember-inspector/issues/147
  // - https://blog.mozilla.org/addons/2014/04/10/changes-to-unsafewindow-for-the-add-on-sdk/
  try {
    message = cloneInto(message, document.defaultView);
  } catch(e) {
    message = JSON.stringify(message);
  }

  event.initCustomEvent("ember-debug-receive", true, true, message);
  document.documentElement.dispatchEvent(event);
}

function onEmberDebugEvent(event) {
  //console.debug("content-script: ember debug send", event.detail);

  self.port.emit("emberDebug", event.detail);
}

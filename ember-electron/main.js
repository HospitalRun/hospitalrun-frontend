const { app, BrowserWindow, protocol } = require('electron');
const { dirname, join, resolve } = require('path');
const protocolServe = require('electron-protocol-serve');
const electronLocalshortcut = require('electron-localshortcut');

const autoUpdater = require('./auto-updater');
const emberAppLocation = 'serve://dist';
let mainWindow = null;

// Registering a protocol & schema to serve our Ember application
protocol.registerStandardSchemes(['serve'], { secure: true });
protocolServe({
  cwd: join(__dirname || resolve(dirname('')), '..', 'ember'),
  app,
  protocol
});

/*
crashReporter.start({
  productName: 'HospitalRun',
  companyName: 'HospitalRun',
  submitURL: 'https://webhooks.hospitalrun.io/crash',
  autoSubmit: true
});*/

function initialize() {
  let shouldQuit = makeSingleInstance();
  if (shouldQuit) {
    return app.quit();
  }

  function createWindow() {

    mainWindow = new BrowserWindow({
      width: 1080,
      minWidth: 680,
      height: 840,
      backgroundThrottling: false
    });

    electronLocalshortcut.register(mainWindow, 'Ctrl+D', () => {
      // mainWindow.openDevTools();
      mainWindow.webContents.openDevTools();
    });

    // Load the ember application using our custom protocol/scheme
    mainWindow.loadURL(emberAppLocation);

    // If a loading operation goes wrong, we'll send Electron back to
    // Ember App entry point
    mainWindow.webContents.on('did-fail-load', () => {
      mainWindow.loadURL(emberAppLocation);
    });

    mainWindow.webContents.on('crashed', () => {
      console.log('Your Ember app (or other code) in the main window has crashed.');
      console.log('This is a serious issue that needs to be handled and/or debugged.');
    });

    mainWindow.on('closed', () => {
      electronLocalshortcut.unregisterAll(mainWindow);
      mainWindow = null;
    });

    mainWindow.on('unresponsive', () => {
      console.log('Your Ember app (or other code) has made the window unresponsive.');
    });

    mainWindow.on('responsive', () => {
      console.log('The main window has become responsive again.');
    });
  }

  app.on('window-all-closed', () => {
    app.quit();
    electronLocalshortcut.unregisterAll(mainWindow);
  });

  app.on('ready', () => {
    createWindow();
    autoUpdater.initialize();
  });
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    autoUpdater.createShortcut(function() {
      app.quit();
    });
    break;
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(function() {
      app.quit();
    });
    break;
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit();
    break;
  default:
    initialize();
}

function makeSingleInstance() {
  if (process.mas) {
    return false;
  }

  return app.makeSingleInstance(function() {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });
}

// Handle an unhandled error in the main thread
//
// Note that 'uncaughtException' is a crude mechanism for exception handling intended to
// be used only as a last resort. The event should not be used as an equivalent to
// "On Error Resume Next". Unhandled exceptions inherently mean that an application is in
// an undefined state. Attempting to resume application code without properly recovering
// from the exception can cause additional unforeseen and unpredictable issues.
//
// Attempting to resume normally after an uncaught exception can be similar to pulling out
// of the power cord when upgrading a computer -- nine out of ten times nothing happens -
// but the 10th time, the system becomes corrupted.
//
// The correct use of 'uncaughtException' is to perform synchronous cleanup of allocated
// resources (e.g. file descriptors, handles, etc) before shutting down the process. It is
// not safe to resume normal operation after 'uncaughtException'.
process.on('uncaughtException', (err) => {
  console.log('An exception in the main thread was not handled.');
  console.log('This is a serious issue that needs to be handled and/or debugged.');
  console.log(`Exception: ${err}`);
});

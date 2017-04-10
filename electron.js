/* jshint node: true */
/* eslint-env node */
'use strict';

const { app, BrowserWindow }  = require('electron');
const autoUpdater = require('./auto-updater');

let mainWindow = null;

function initialize() {
  let shouldQuit = makeSingleInstance();
  if (shouldQuit) {
    return app.quit();
  }

  function createWindow() {
    let windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      backgroundThrottling: false
    };

    mainWindow = new BrowserWindow(windowOptions);

    delete mainWindow.module;

    if (process.env.EMBER_ENV === 'test') {
      mainWindow.loadURL(`file://${__dirname}/index.html`);
    } else {
      mainWindow.loadURL(`file://${__dirname}/dist/index.html`);
    }

    mainWindow.on('closed', function() {
      mainWindow = null;
    });

    mainWindow.on('unresponsive', () => {
      console.log('Your Ember app (or other code) has made the window unresponsive.');
    });

    mainWindow.on('responsive', () => {
      console.log('The main window has become responsive again.');
    });

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
  }

  app.on('ready', function() {
    createWindow();
    autoUpdater.initialize();
  });

  app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', function() {
    if (mainWindow === null) {
      createWindow();
    }
  });
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
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

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
    autoUpdater.createShortcut(function() { app.quit(); });
    break;
  case '--squirrel-uninstall':
    autoUpdater.removeShortcut(function() { app.quit(); });
    break;
  case '--squirrel-obsolete':
  case '--squirrel-updated':
    app.quit();
    break;
  default:
    initialize();
}

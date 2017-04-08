/* jshint node: true */
/* eslint-env node */
'use strict';

const electron = require('electron');
const path  = require('path');
const { app, BrowserWindow } = electron;
const dirname = __dirname || path.resolve(path.dirname());
const emberAppLocation  = `file://${dirname}/dist/index.html`;
const autoUpdater = require('./auto-updater');
const debug = /--debug/.test(process.argv[2]);

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
      height: 840
    };

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png');
    }

    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(emberAppLocation);

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools();
      mainWindow.maximize();
      require('devtron').install();
    }

    mainWindow.on('closed', function() {
      mainWindow = null;
    });

    // here

    // If a loading operation goes wrong, we'll send Electron back to
    // Ember App entry point
    mainWindow.webContents.on('did-fail-load', () => {
      mainWindow.loadURL(emberAppLocation);
    });

    mainWindow.webContents.on('crashed', () => {
      console.log('Your Ember app (or other code) in the main window has crashed.');
      console.log('This is a serious issue that needs to be handled and/or debugged.');
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

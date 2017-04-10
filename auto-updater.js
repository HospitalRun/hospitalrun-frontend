/* global exports, process, require */
/* env: "node" */
const electron = require('electron');
const ChildProcess = require('child_process');
const path = require('path');
const { app, Menu, autoUpdater } = electron;

let state = 'checking';

exports.initialize = function() {
  if (process.mas) { return; }

  autoUpdater.on('checking-for-update', function() {
    state = 'checking';
    exports.updateMenu();
  });

  autoUpdater.on('update-available', function() {
    state = 'checking';
    exports.updateMenu();
  });

  autoUpdater.on('update-downloaded', function() {
    state = 'installed';
    exports.updateMenu();
  });

  autoUpdater.on('update-not-available', function() {
    state = 'no-update';
    exports.updateMenu();
  });

  autoUpdater.on('error', function() {
    state = 'no-update';
    exports.updateMenu();
  });

  // autoUpdater.setFeedURL(`https://release.hospitalrun.io/updates?version=${app.getVersion()}`);
  let platform = 'macos';
  if (process.platform === 'win32') {
    platform = 'win32';
    if (process.env.PROCESSOR_ARCHITECTURE === 'AMD64') {
      platform = 'win32x64';
    }
  } else if (process.platform != 'darwin') {
    platform = process.platform;
  }
  autoUpdater.setFeedURL(`https://releases.hospitalrun.io/updates?version=${app.getVersion()}&platform=${platform}`);
  autoUpdater.checkForUpdates();
};

exports.updateMenu = function() {
  if (process.mas) { return; }

  let menu = Menu.getApplicationMenu();
  if (!menu) { return; }

  menu.items.forEach(function(item) {
    if (item.submenu) {
      item.submenu.items.forEach(function(item) {
        switch (item.key) {
          case 'checkForUpdate':
            item.visible = state === 'no-update';
            break;
          case 'checkingForUpdate':
            item.visible = state === 'checking';
            break;
          case 'restartToUpdate':
            item.visible = state === 'installed';
            break;
        }
      });
    }
  });
};

exports.createShortcut = function(callback) {
  spawnUpdate([
    '--createShortcut',
    path.basename(process.execPath),
    '--shortcut-locations',
    'StartMenu'
  ], callback);
};

exports.removeShortcut = function(callback) {
  spawnUpdate([
    '--removeShortcut',
    path.basename(process.execPath)
  ], callback);
};

function spawnUpdate(args, callback) {
  let updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  let stdout = '';
  let spawned = null;

  try {
    spawned = ChildProcess.spawn(updateExe, args);
  } catch(error) {
    if (error && error.stdout == null) { error.stdout = stdout; }
    process.nextTick(function() { callback(error); });
    return;
  }

  let error = null;

  spawned.stdout.on('data', function(data) { stdout += data; });

  spawned.on('error', function(processError) {
    if (!error) {
      error = processError;
    }
  });

  spawned.on('close', function(code, signal) {
    if (!error && code !== 0) {
      error = new Error(`Command failed: ${code} ${signal}`);
    }
    if (error && error.code == null) { error.code = code; }
    if (error && error.stdout == null) { error.stdout = stdout; }
    callback(error);
  });
}

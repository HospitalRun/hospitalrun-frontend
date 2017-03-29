// Based on https://github.com/electron/grunt-electron-installer
'use strict';

const { app } = require('electron');
const path    = require('path');
const spawn   = require('child_process').spawn;


const SQUIRREL_INSTALL   = 'squirrel-install';
const SQUIRREL_UPDATED   = 'squirrel-updated';
const SQUIRREL_UNINSTALL = 'squirrel-uninstall';
const SQUIRREL_OBSOLETE  = 'squirrel-obsolete';

const SQUIRREL_ACTIONS = [
  SQUIRREL_INSTALL, SQUIRREL_UPDATED, SQUIRREL_UNINSTALL, SQUIRREL_OBSOLETE
];


module.exports.getSquirrelInstallerAction = getSquirrelInstallerAction;
module.exports.processSquirrelInstaller   = processSquirrelInstaller;


function getSquirrelInstallerAction() {
  if (process.platform !== 'win32') {
    return false;
  }

  const handledArguments = SQUIRREL_ACTIONS.map(act => '--' + act);
  const actionIndex = handledArguments.indexOf(process.argv[1]);
  return actionIndex === -1 ? false : SQUIRREL_ACTIONS[actionIndex];
}

function processSquirrelInstaller(action) {
  const execPath = path.basename(process.execPath);

  switch (action) {
    case SQUIRREL_INSTALL:
    case SQUIRREL_UPDATED: {
      run([`--createShortcut=${execPath}`], app.quit);
      return true;
    }
    case SQUIRREL_UNINSTALL: {
      run([`--removeShortcut=${execPath}`], app.quit);
      return;
    }
    case SQUIRREL_OBSOLETE: {
      app.quit();
      return;
    }
    default: {
      return;
    }
  }
}

function run(args, done) {
  const updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  spawn(updateExe, args, { detached: true })
    .on('close', done);
}
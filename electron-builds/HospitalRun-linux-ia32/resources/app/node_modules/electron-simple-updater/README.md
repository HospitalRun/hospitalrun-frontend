![logo](https://raw.githubusercontent.com/megahertz/electron-simple-updater/master/logo.png)
# electron-simple-updater
[![Build Status](https://travis-ci.org/megahertz/electron-simple-updater.svg?branch=master)](https://travis-ci.org/megahertz/electron-simple-updater)
[![npm version](https://badge.fury.io/js/electron-simple-updater.svg)](https://badge.fury.io/js/electron-simple-updater)

## Description

This module allows to automatically update your application. You only
need to install this module and write two lines of code! To publish
your updates you just need a simple file hosting, it does not require
a dedicated server.

Support OS: 
 - Mac, ([Squirrel.Mac](https://github.com/Squirrel/Squirrel.Mac))
 - Windows ([Squirrel.Windows](https://github.com/Squirrel/Squirrel.Windows))
 - Linux (for [AppImage](http://appimage.org/) format)

## Differences between electron-simple-updater and built-in autoUpdater

* Actually, autoUpdater is used inside.
* Linux support.
* It handles Squirrel.Windows install/update command line arguments.
* It doesn't require a dedicated release server.
* You need only 2 lines of code to make it work.

## Installation

Install with [npm](https://npmjs.org/package/electron-simple-updater):

    npm install --save electron-simple-updater

## Usage

### Publish a new release
1. Build your release using electron-builder or another tool and upload it
to a file hosting.
2. Create a file updates.js which contains link to your new release and
upload it to a file hosting:
```json
{
  "linux-x64-prod": {
    "update": "https://github.com/megahertz/electron-simple-updater/releases/download/example-linux-x64-prod-v0.0.2/simple-updater-example-0.0.2-x86_64.AppImage",
    "version": "0.0.2",
    "platform": "linux",
    "readme": "Second version"
  },
  "win32-x64-prod": {
    "update": "https://github.com/megahertz/electron-simple-updater/releases/download/example-win32-x64-prod-v0.0.2",
    "version": "0.0.2",
    "platform": "win32",
    "readme": "Second version"
  },
  "darwin-x64-prod": {
    "update": "https://github.com/megahertz/electron-simple-updater/releases/download/example-darwin-x64-prod-v0.0.2/release.json",
    "version": "0.0.2",
    "platform": "darwin",
    "readme": "Second version"
  }
}
```
This file contains links to:
 1. An AppImage file for linux
 2. A folder with the RELEASES file for Squirrel.Windows
 3. A JSON file which contains meta information for Squirrel.Mac

### Insert a link to updates.json to your code
```js
// Just place this code at the entry point of your application:
const updater = require('electron-simple-updater');
updater.init('https://raw.githubusercontent.com/megahertz/electron-simple-updater/master/example/updates.json');
```
You can set this link in package.json:updater.url instead.

### That's it!
Now your application will check for updates on start and download it 
automatically if an update is available. After app is restarted a new
version will be loaded. But you can customize it to ask a user if he
would like to install updates. See [the example](example) for details.
    
## API

### Options
You can set options when calling init() method or in package.json:updater
section.

Name                | Default                 | Description
--------------------|-------------------------|------------
autoDownload        | true                    | Automatically download an update when it is found in updates.json
build               | {platform}-{arch}       | Build type, like 'linux-x64' or 'win32-ia32'
channel             | 'prod'                  | An application which is built for channel like 'beta' will receive updates only from this channel
checkUpdateOnStart  | true                    | Check for updates immediately when init() is called
disabled            | false                   | Disable update feature. This option is set to true automatically for applications built for Mac App Store or Windows Store
logger              | console                 | You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: { info(), warn() }. Set it to false if you would like to disable a logging feature 
version             | app.getVersion()        | Current app version. In most cases, you should not pass this options manually, it is read by electron from version at package.json
url*                | undefined               | The only required parameter. This is a URL to [updates.json](https://github.com/megahertz/electron-simple-updater/blob/master/example/updates.json) file
    
### Method
    
#### init(options)
Initialize a package. By default it finish the process if is run by
Squirrel.Windows installer.

#### setFeedURL(url) *deprecated*
Sets the url and initialize the electron-simple-updater. Instead of
built-in auto-updater init(), this method receives a URL to updates.json.   
    
#### getFeedURL() *deprecated*
Return the current updates.json URL.

#### checkForUpdates() 
Asks the server whether there is an update. url must be set before this
call. Instead of built-in auto-updater, this method does not start
downloading if autoDownload options is set to false.
    
#### downloadUpdate()
Start downloading update manually. You can use this method if
autoDownload option is set to false
    
#### quitAndInstall()
Restarts the app and installs the update after it has been downloaded.
It should only be called after update-downloaded has been emitted.

#### setOptions(name, value)
Set one or a few options. Pass an object as the name for multiple set.
   
### Properties (read only)
These properties are mapped to options 

 * **build** 
 * **channel**
 * **version**
 * **buildId** - this string contains a build, a channel and version
    
### Events
**meta** object of some events is a data from updates.json
   
#### error(err)
Emitted when there is an error while updating.

#### checking-for-update 
Emitted when start downloading update.json file.

#### update-available(meta)
Emitted when there is an available update.

#### update-not-available
Emitted when there is no available update.

#### update-downloading(meta)
Emitted when star downloading an update.

#### update-downloaded(meta)
Emitted when an update has been downloaded.

#### squirrel-win-installer(event)
Emitted when the app is run by Squirrel.Windows when installing. The
SimpleUpdater creates/removes shortcuts and finishes the process by
default.

 * **event.preventDefault** - set to true if you would like to
 customize this action
 * **event.squirrelAction** - squirrel-install, squirrel-updated,
 squirrel-uninstall, squirrel-obsolete
    
## Related
 - [electron-builder](https://github.com/electron-userland/electron-builder) -
 A complete solution to package and build an Electron app
 - [electron-simple-publisher](https://github.com/megahertz/electron-simple-publisher) -
 Simple way to publish releases for electron-simple-updater
    
    
## License

Licensed under MIT.

Logo was designed by [prolko](https://www.behance.net/prolko) base on the
original [electron](https://github.com/electron/electron) logo.

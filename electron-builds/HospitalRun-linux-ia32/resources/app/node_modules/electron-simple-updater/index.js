'use strict';

const { app, autoUpdater } = require('electron');
const events               = require('events');
const exec                 = require('child_process').exec;

const win32            = require('./lib/win32');
const linux            = require('./lib/linux');
const getUpdatesMeta   = require('./lib/get-updates-meta');
const normalizeOptions = require('./lib/normalize-options');

class SimpleUpdater extends events.EventEmitter {
  constructor() {
    super();

    // Just for better auto-complete
    this.options = {
      autoDownload:       true,
      build:              '',
      channel:            'prod',
      checkUpdateOnStart: true,
      disabled:           false,
      empty:              true, // Mark that it's not initialized
      logger:             console,
      version:            '',
      url:                ''
    };

    this.meta = {
      empty:     true, // Mark that it's not initialized
      version:   '',
      update:    ''
    };

    autoUpdater.on('update-downloaded', () => {
      const version = this.meta.version;
      this.options.logger.info(`New version ${version} has been downloaded`);
      /**
       * @event SimpleUpdater#update-downloaded
       * @param {object} meta Update metadata
       */
      this.emit('update-downloaded', this.meta);
    });

    this.on('error', (e) => {
      if (this.options.logger) {
        this.options.logger.warn(e);
      }
    });
    autoUpdater.on('error', e => this.emit('error', e));
  }

  /**
   * Initialize a package.
   * By default it finish the process if run by Squirrel.Windows installer
   *
   * @param {object|string} [options]
   * @param {bool}   [options.autoDownload=true] Automatically download an
   *   update when it is found in updates.json
   * @param {string} [options.build] Build type, like 'linux-x64' or 'win32-ia32'
   * @param {string} [options.channel=prod] An application which is built for
   *   channel like 'beta' will receive updates only from this channel
   * @param {bool}   [options.checkUpdateOnStart=true] Check for updates
   *   immediately when init() is called
   * @param {bool}   [options.disabled=false] Disable update feature.
   *   This option is set to true automatically for applications built for
   *   Mac AppStore or Windows Store
   * @param {object} [options.logger=console] You can pass electron-log,
   *   winston or another logger with the following interface:
   *   { info(){}, warn(){} }. Set it to false if you would like to disable
   *   a logging feature
   * @param {string} [options.version] Current app version. In most cases,
   *   you should not pass this options manually, it is read by electron
   *   from version at package.json
   * @param {string} [options.url] URL to a file updates.json
   *
   * @fires SimpleUpdater#error
   * @return {SimpleUpdater}
   */
  init(options) {
    if (!this.options.empty) {
      /**
       * @event SimpleUpdater#error
       * @param {object|string} error
       */
      this.emit(
        'error',
        'electron-simple updater has been initialized before'
      );
      return this;
    }

    // Return if we run not compiled application
    if (app.getName() === 'Electron') {
      this.options.disabled = true;
      return this;
    }

    this.options = normalizeOptions(options);

    const squirrelAction = win32.getSquirrelInstallerAction();
    if (squirrelAction) {
      const event = {
        squirrelAction,
        preventDefault: false
      };
      /**
       * @event SimpleUpdater#squirrel-win-installer
       * @param {string} action one of:
       *   squirrel-install
       *   squirrel-updated
       *   squirrel-uninstall
       *   squirrel-obsolete
       */
      this.emit('squirrel-win-installer', event);
      if (!event.preventDefault) {
        win32.processSquirrelInstaller(squirrelAction);
        process.exit();
      }
      return this;
    }

    if (this.options.checkUpdateOnStart) {
      this.checkForUpdates();
    }

    return this;
  }

  /**
   * Asks the server whether there is an update. url must be set before this call
   * @fires SimpleUpdater#error
   * @fires SimpleUpdater#checking-for-update
   * @fires SimpleUpdater#update-not-available
   * @return {SimpleUpdater}
   */
  checkForUpdates() {
    const opt = this.options;

    if (opt.disabled) {
      opt.logger.warn(`Update is disabled`);
      return this;
    }

    if (!opt.url) {
      this.emit('error', 'You must set url before calling checkForUpdates()');
      return this;
    }

    /**
     * @event SimpleUpdater#checking-for-update
     */
    this.emit('checking-for-update');

    //noinspection JSUnresolvedFunction
    getUpdatesMeta(opt.url, opt.build, opt.channel, opt.version)
      .then((updateMeta) => {
        if (updateMeta) {
          this.onFoundUpdate(updateMeta);
        } else {
          opt.logger.info(
            `Update for ${this.buildId} is not available`
          );
          /**
           * @event SimpleUpdater#update-not-available
           */
          this.emit('update-not-available');
        }
      })
      .catch(e => this.emit('error', e));

    return this;
  }

  /**
   * Start downloading update manually.
   * You can use this method if autoDownload option is set to false
   * @fires SimpleUpdater#update-downloading
   * @fires SimpleUpdater#update-downloaded
   * @fires SimpleUpdater#error
   * @return {SimpleUpdater}
   */
  downloadUpdate() {
    if (!this.meta.update) {
      const msg = 'There is no metadata for update. Run checkForUpdates first.';
      this.emit('error', msg);
      return this;
    }

    let feedUrl = autoUpdater.getFeedURL();
    /**
     * @event SimpleUpdater#update-downloading
     * @param {object} meta Update metadata
     */
    this.emit('update-downloading', this.meta);

    if (process.platform === 'linux') {
      feedUrl = this.meta.update;

      linux.downloadUpdate(feedUrl)
        .then((appImagePath) => {
          this.appImagePath = appImagePath;
          const version = this.meta.version;
          this.options.logger.info(`New version ${version} has been downloaded`);
          this.emit('update-downloaded', this.meta);
        })
        .catch(e => this.emit('error', e));
    } else {
      autoUpdater.checkForUpdates();
    }

    this.options.logger.info(`Downloading updates from ${feedUrl}`);

    return this;
  }

  /**
   * Restarts the app and installs the update after it has been downloaded.
   * It should only be called after update-downloaded has been emitted.
   * @return {void}
   */
  quitAndInstall() {
    if (this.appImagePath) {
      exec(this.appImagePath);
      app.quit();
    } else {
      return autoUpdater.quitAndInstall();
    }
  }

  /**
   * Set one or a few options
   * @param {string|object} name
   * @param {*} value
   * @return {SimpleUpdater}
   */
  setOptions(name, value = null) {
    if (typeof name === 'object') {
      Object.assign(this.options, name);
      return this;
    }
    this.options[name] = value;
    return this;
  }

  get build() {
    if (!this.checkIsInitialized()) return;
    return this.options.build;
  }

  /**
   * Return a build name with a channel and version
   * @return {string}
   */
  get buildId() {
    if (!this.checkIsInitialized()) return '';
    return `${this.build}-${this.channel}-v${this.version}`;
  }

  get channel() {
    if (!this.checkIsInitialized()) return;
    return this.options.channel;
  }

  get version() {
    if (!this.checkIsInitialized()) return;
    return this.options.version;
  }

  /**
   * Sets the url and initialize the auto updater.
   * Instead of built-in auto-updater, it's a URL to updates.json
   * @deprecated
   * @param {string} url
   */
  setFeedURL(url) {
    if (this.options.empty) {
      this.init(url);
    } else {
      this.options.url = url;
    }
  }

  /**
   * Return the current updates.json URL
   * @return {string}
   */
  getFeedURL() {
    if (!this.checkIsInitialized()) return '';
    return this.options.url;
  }

  /**
   * Called when updates metadata has been downloaded
   * @private
   * @fires SimpleUpdater#update-available
   * @param {object} meta
   */
  onFoundUpdate(meta) {
    this.meta = meta;
    const opt = this.options;

    opt.logger.info(`Found version ${meta.version} at ${meta.update}`);
    autoUpdater.setFeedURL(meta.update);
    /**
     * @event SimpleUpdater#update-available
     * @param {object} meta Update metadata
     */
    this.emit('update-available', meta);
    if (opt.autoDownload) {
      this.downloadUpdate();
    }
  }

  /**
   * @private
   * @fires SimpleUpdater#error
   * @return {boolean}
   */
  checkIsInitialized() {
    if (this.options.empty) {
      this.emit('error', 'electron-simple-updater is not initialized');
      return false;
    } else {
      return true;
    }
  }
}

module.exports = new SimpleUpdater();
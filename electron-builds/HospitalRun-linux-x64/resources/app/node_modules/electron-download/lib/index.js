'use strict'

const debug = require('debug')('electron-download')
const fs = require('fs-extra')
const rc = require('rc')
const nugget = require('nugget')
const os = require('os')
const path = require('path')
const pathExists = require('path-exists')
const semver = require('semver')
const sumchecker = require('sumchecker')

class ElectronDownloader {
  constructor (opts) {
    this.opts = opts

    this.npmrc = {}
    try {
      rc('npm', this.npmrc)
    } catch (error) {
      console.error(`Error reading npm configuration: ${error.message}`)
    }
  }

  get baseUrl () {
    return process.env.NPM_CONFIG_ELECTRON_MIRROR ||
      process.env.npm_config_electron_mirror ||
      process.env.ELECTRON_MIRROR ||
      this.opts.mirror ||
      'https://github.com/electron/electron/releases/download/v'
  }

  get middleUrl () {
    return process.env.ELECTRON_CUSTOM_DIR || this.opts.customDir || this.version
  }

  get urlSuffix () {
    return process.env.ELECTRON_CUSTOM_FILENAME || this.opts.customFilename || this.filename
  }

  get arch () {
    return this.opts.arch || os.arch()
  }

  get cache () {
    return this.opts.cache || path.join(os.homedir(), './.electron')
  }

  get cachedChecksum () {
    return path.join(this.cache, `${this.checksumFilename}-${this.version}`)
  }

  get cachedZip () {
    return path.join(this.cache, this.filename)
  }

  get checksumFilename () {
    return 'SHASUMS256.txt'
  }

  get checksumUrl () {
    return `${this.baseUrl}${this.middleUrl}/${this.checksumFilename}`
  }

  get filename () {
    const type = `${this.platform}-${this.arch}`
    const suffix = `v${this.version}-${type}`

    if (this.chromedriver) {
      return `chromedriver-v2.21-${type}.zip`
    } else if (this.mksnapshot) {
      return `mksnapshot-${suffix}.zip`
    } else if (this.ffmpeg) {
      return `ffmpeg-${suffix}.zip`
    } else if (this.symbols) {
      return `electron-${suffix}-symbols.zip`
    } else if (this.dsym) {
      return `electron-${suffix}-dsym.zip`
    } else {
      return `electron-${suffix}.zip`
    }
  }

  get platform () {
    return this.opts.platform || os.platform()
  }

  get proxy () {
    let proxy
    if (this.npmrc && this.npmrc.proxy) proxy = this.npmrc.proxy
    if (this.npmrc && this.npmrc['https-proxy']) proxy = this.npmrc['https-proxy']

    return proxy
  }

  get quiet () {
    return this.opts.quiet || process.stdout.rows < 1
  }

  get strictSSL () {
    let strictSSL = true
    if (this.opts.strictSSL === false || this.npmrc['strict-ssl'] === false) {
      strictSSL = false
    }

    return strictSSL
  }

  get force () {
    return this.opts.force || false
  }

  get symbols () {
    return this.opts.symbols || false
  }

  get dsym () {
    return this.opts.dsym || false
  }

  get chromedriver () {
    return this.opts.chromedriver || false
  }

  get mksnapshot () {
    return this.opts.mksnapshot || false
  }

  get ffmpeg () {
    return this.opts.ffmpeg || false
  }

  get url () {
    return `${this.baseUrl}${this.middleUrl}/${this.urlSuffix}`
  }

  get verifyChecksumNeeded () {
    return semver.gte(this.version, '1.3.2')
  }

  get version () {
    return this.opts.version
  }

  checkForCachedChecksum (cb) {
    pathExists(this.cachedChecksum).then(exists => {
      if (exists && !this.force) {
        this.verifyChecksum(cb)
      } else if (this.tmpdir) {
        this.downloadChecksum(cb)
      } else {
        this.createTempDir(cb, (callback) => {
          this.downloadChecksum(callback)
        })
      }
    })
  }

  checkForCachedZip (cb) {
    pathExists(this.cachedZip).then(exists => {
      if (exists && !this.force) {
        debug('zip exists', this.cachedZip)
        this.checkIfZipNeedsVerifying(cb)
      } else {
        this.ensureCacheDir(cb)
      }
    })
  }

  checkIfZipNeedsVerifying (cb) {
    if (this.verifyChecksumNeeded) {
      debug('Verifying zip with checksum')
      return this.checkForCachedChecksum(cb)
    }
    return cb(null, this.cachedZip)
  }

  createCacheDir (cb) {
    fs.mkdirs(this.cache, (err) => {
      if (err) {
        if (err.code !== 'EACCES') return cb(err)
        // try local folder if homedir is off limits (e.g. some linuxes return '/' as homedir)
        let localCache = path.resolve('./.electron')
        return fs.mkdirs(localCache, function (err) {
          if (err) return cb(err)
          cb(null, localCache)
        })
      }
      cb(null, this.cache)
    })
  }

  createTempDir (cb, onSuccess) {
    this.tmpdir = path.join(os.tmpdir(), `electron-tmp-download-${process.pid}-${Date.now()}`)
    fs.mkdirs(this.tmpdir, (err) => {
      if (err) return cb(err)
      onSuccess(cb)
    })
  }

  downloadChecksum (cb) {
    this.downloadFile(this.checksumUrl, this.checksumFilename, this.cachedChecksum, cb, this.verifyChecksum.bind(this))
  }

  downloadFile (url, filename, cacheFilename, cb, onSuccess) {
    debug('downloading', url, 'to', this.tmpdir)
    let nuggetOpts = {
      target: filename,
      dir: this.tmpdir,
      resume: true,
      quiet: this.quiet,
      strictSSL: this.strictSSL,
      proxy: this.proxy
    }
    nugget(url, nuggetOpts, (errors) => {
      if (errors) {
        // nugget returns an array of errors but we only need 1st because we only have 1 url
        return this.handleDownloadError(cb, errors[0])
      }

      this.moveFileToCache(filename, cacheFilename, cb, onSuccess)
    })
  }

  downloadIfNotCached (cb) {
    if (!this.version) return cb(new Error('must specify version'))
    debug('info', {cache: this.cache, filename: this.filename, url: this.url})
    this.checkForCachedZip(cb)
  }

  downloadZip (cb) {
    this.downloadFile(this.url, this.filename, this.cachedZip, cb, this.checkIfZipNeedsVerifying.bind(this))
  }

  ensureCacheDir (cb) {
    debug('creating cache/tmp dirs')
    this.createCacheDir((err, actualCache) => {
      if (err) return cb(err)
      this.opts.cache = actualCache // in case cache dir changed
      this.createTempDir(cb, this.downloadZip.bind(this))
    })
  }

  handleDownloadError (cb, error) {
    if (error.message.indexOf('404') === -1) return cb(error)
    if (this.symbols) {
      error.message = `Failed to find Electron symbols v${this.version} for ${this.platform}-${this.arch} at ${this.url}`
    } else {
      error.message = `Failed to find Electron v${this.version} for ${this.platform}-${this.arch} at ${this.url}`
    }

    return cb(error)
  }

  moveFileToCache (filename, target, cb, onSuccess) {
    debug('moving', filename, 'from', this.tmpdir, 'to', target)
    fs.unlink(target, (err) => {
      if (err != null && err.code !== 'ENOENT') return cb(err)
      fs.move(path.join(this.tmpdir, filename), target, (err) => {
        if (err) return cb(err)
        onSuccess(cb)
      })
    })
  }

  verifyChecksum (cb) {
    let options = {}
    if (semver.lt(this.version, '1.3.5')) {
      options.defaultTextEncoding = 'binary'
    }
    let checker = new sumchecker.ChecksumValidator('sha256', this.cachedChecksum, options)
    checker.validate(this.cache, this.filename).then(() => {
      cb(null, this.cachedZip)
    }, (err) => {
      fs.unlink(this.cachedZip, (fsErr) => {
        if (fsErr) return cb(fsErr)
        cb(err)
      })
    })
  }
}

module.exports = function download (opts, cb) {
  let downloader = new ElectronDownloader(opts)
  downloader.downloadIfNotCached(cb)
}

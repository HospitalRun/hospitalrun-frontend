import Ember from 'ember';
export default Ember.Service.extend({
  config: Ember.inject.service(),

  filer: null, // Injected via initializer
  fileSystemSize: (1024 * 1024 * 1024 * 8), // 8GB max size for local filesystem;chrome only,

  _onError: function(e) {
    console.log(`Filer filesystem error: ${e}`);
  },

  _downloadFiles: function() {
    this.store.find('photo').then(function(photos) {
      photos.forEach(function(photo) {
        this.downloadIfNeeded(photo);
      }.bind(this));
    }.bind(this));
  },

  /**
   * Downloads the file from the server and saves it to the local filesystem.
   * @param {Object} fileRecord Record to use to download the file.
   */
  _downloadFileFromServer: function(fileRecord) {
    let fileName = Ember.get(fileRecord, 'fileName');
    let pouchDbId = Ember.get(fileRecord, 'id');
    let url = Ember.get(fileRecord, 'url');
    let xhr = new XMLHttpRequest();
    if (!Ember.isEmpty(url)) {
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function() {
        let file = new Blob([xhr.response]);
        this.addFile(file, fileName, pouchDbId);
      }.bind(this);
      xhr.send();
    }
  },

  setup: function() {
    let size = this.get('fileSystemSize');
    let filer = new Filer();
    filer.init({ persistent: true, size: size }, function() {
      try {
        this.set('filer', filer);
      } catch (ignored) {
        // Exception may happen during testing an can be ignored.
      }
    }.bind(this));
  },

  /**
   * Add the specified file to the local filesystem
   * @param {File} file the file to save.
   * @param {String} path the file path to save the file to.
   * @param {String} pouchDbId database id that the file is associated with.
   * The pouch DB ids are prefixed with the type of record (eg patient record is
   * prefixed by 'patient_'.
   * @returns {Promise} returns a Promise that resolves once the file is saved.
   */
  addFile: function(file, path, pouchDbId) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let currentDate = new Date();
      let filer = this.get('filer');
      let fileName = file.name || currentDate.getTime();
      let newFileName = path + fileName;
      let config = this.get('config');
      if (path.indexOf('.') > -1) {
        newFileName = path;
        // If a full file path was provided, figure out the path and file name.
        let pathParts = path.split('/');
        fileName = pathParts.pop();
        path = pathParts.join('/');
        path += '/';
      }

      if (newFileName.indexOf('.') === -1) {
        if (file.type) {
          let typeParts = file.type.split('/');
          newFileName += `.${typeParts.pop()}`;
        } else {
          // Default to png extension
          newFileName += '.png';
        }
      }

      this.fileExists(newFileName).then(function(exists) {
        if (exists) {
          // Make sure a unique name is used.
          newFileName = path + currentDate.getTime() + fileName;
        }
        if (Ember.isEmpty(filer)) {
          reject('Local filesystem unavailable, please use Google Chrome browser');
        }
        if (Ember.isEmpty(fileName) && !Ember.isEmpty(file.type)) {
          let typeParts = file.type.split('/');
          if (typeParts.length > 1) {
            newFileName += `.${typeParts[1]}`;
          }
        }
        filer.mkdir(path, false, function() {
          filer.write(newFileName, { data: file, type: file.type }, function(fileEntry) {
            config.saveFileLink(newFileName, pouchDbId);
            resolve(fileEntry);
          }, function(e) {
            reject(e);
          });
        }, function(e) {
          reject(e);
        });
      }.bind(this));
    }.bind(this));
  },

  /**
   * Delete the specified file
   * @param {String} filePath path of file to delete.
   * @param {String} pouchId database id that the file is associated with.
   * The pouch DB ids are prefixed with the type of record (eg patient record is
   * prefixed by 'patient_'.
   * @returns {Promise} returns a Promise that resolves once the file is deleted.
   */
  deleteFile: function(filePath, pouchDbId) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let filer = this.get('filer');
      let config = this.get('config');
      try {
        filer.rm(filePath, function() {
          config.removeFileLink(pouchDbId);
          resolve();
        }, reject);
      } catch(ex) {
        reject(ex);
      }
    }.bind(this));
  },

  downloadIfNeeded: function(fileRecord) {
    let fileName = Ember.get(fileRecord, 'fileName');
    this.fileExists(fileName).then(function(exists) {
      if (!exists) {
        this._downloadFileFromServer(fileRecord);
      }
    }.bind(this));
  },

  /**
   * Determine if specified file exists
   * @param {String} the path of the file to determine if it exists.
   * @returns {Promise} returns a Promise that resolves with a boolean indicating
   * if the file exists.
   */
  fileExists: function(filePath) {
    return new Ember.RSVP.Promise(function(resolve) {
      let filer = this.get('filer');
      filer.fs.root.getFile(filePath, {}, function() {
        resolve(true);
      }, function() {
        // if ls errs, file doesn't exist.
        resolve(false);
      });
    }.bind(this));
  },

  /**
   * Convert specified file to a data url
   * @param {File} file to convert
   * @returns {Promise} returns a Promise that resolves with the data url
   * for the file.
   */
  fileToDataURL: function(file) {
    return new Ember.RSVP.Promise(function(resolve) {
      let reader = new FileReader();
      reader.onloadend = function(e) {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  },

  /**
   * Read the specified file into a string
   * @param {File} file to read
   * @returns {Promise} returns a Promise that resolves with the data url
   * for the file.
   */
  fileToString: function(file) {
    return new Ember.RSVP.Promise(function(resolve) {
      let reader = new FileReader();
      reader.onloadend = function(e) {
        resolve(e.target.result);
      };
      reader.readAsText(file);
    });
  },

  /**
   * Property to determine if file system API is available.
   */
  isFileSystemEnabled: function() {
    let filer = this.get('filer');
    return !(Ember.isEmpty(filer));
  }.property('filer'),

  /**
   * Get filesystem url from specified path.
   * @param {String} the path of the file to get the url for.
   * @returns {Promise} returns a Promise that resolves with the file system
   * url or null if the file doesn't exist.
   */
  pathToFileSystemURL: function(path) {
    return new Ember.RSVP.Promise(function(resolve) {
      let filer = this.get('filer');
      filer.fs.root.getFile(path, {}, function(fileEntry) {
        resolve(fileEntry.toURL());
      }, function() {
        // if ls errs, just return empty, file doesn't exist.
        resolve();
      });
    }.bind(this));
  }
});

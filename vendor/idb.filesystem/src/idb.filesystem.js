/** 
 * Copyright 2013 - Eric Bidelman
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 
 * @fileoverview
 * A polyfill implementation of the HTML5 Filesystem API which sits on top of
 * IndexedDB as storage layer. Files and folders are stored as FileEntry and
 * FolderEntry objects in a single object store. IDBKeyRanges are used to query
 * into a folder. A single object store is sufficient because we can utilize the
 * properties of ASCII. Namely, ASCII / is followed by ASCII 0. Thus,
 * "/one/two/" comes before "/one/two/ANYTHING" comes before "/one/two/0".
 *
 * @author Eric Bidelman (ebidel@gmail.com)
 * @version: 0.0.5
 */

'use strict';

(function(exports) {

// Bomb out if the Filesystem API is available natively.
if (exports.requestFileSystem || exports.webkitRequestFileSystem) {
  return;
}

// Bomb out if no indexedDB available
var indexedDB = exports.indexedDB || exports.mozIndexedDB ||
                exports.msIndexedDB;
if (!indexedDB)
{
  return;
}

exports.TEMPORARY = 0;
exports.PERSISTENT = 1;

// Prevent errors in browsers that don't support FileError.
// TODO: FF 13+ supports DOM4 Events (DOMError). Use them instead?
if (exports.FileError === undefined) {
  window.FileError = function() {};
  FileError.prototype.prototype = Error.prototype;
}

FileError.INVALID_MODIFICATION_ERR = 9;
FileError.NOT_FOUND_ERR  = 1;

function MyFileError(obj) {
  var code_ = obj.code;
  var name_ = obj.name;

    // Required for FF 11.
  Object.defineProperty(this, 'code', {
    set: function(code) {
      code_ = code;
    },
    get: function() {
      return code_;
    }
  });

  Object.defineProperty(this, 'name', {
    set: function(name) {
      name_ = name;
    },
    get: function() {
      return name_;
    }
  });
}
MyFileError.prototype = FileError.prototype;
MyFileError.prototype.toString = Error.prototype.toString;

var INVALID_MODIFICATION_ERR = new MyFileError({
      code: FileError.INVALID_MODIFICATION_ERR,
      name: 'INVALID_MODIFICATION_ERR'});
var NOT_IMPLEMENTED_ERR = new MyFileError({code: 1000,
                                           name: 'Not implemented'});
var NOT_FOUND_ERR = new MyFileError({code: FileError.NOT_FOUND_ERR,
                                     name: 'Not found'});

var fs_ = null;

// Browsers other than Chrome don't implement persistent vs. temporary storage.
// but default to temporary anyway.
var storageType_ = 'temporary';
var idb_ = {};
idb_.db = null;
var FILE_STORE_ = 'entries';

var DIR_SEPARATOR = '/';
var DIR_OPEN_BOUND = String.fromCharCode(DIR_SEPARATOR.charCodeAt(0) + 1);

// When saving an entry, the fullPath should always lead with a slash and never
// end with one (e.g. a directory). Also, resolve '.' and '..' to an absolute
// one. This method ensures path is legit!
function resolveToFullPath_(cwdFullPath, path) {
  var fullPath = path;

  var relativePath = path[0] != DIR_SEPARATOR;
  if (relativePath) {
    fullPath = cwdFullPath;
    if (cwdFullPath != DIR_SEPARATOR) {
      fullPath += DIR_SEPARATOR + path;
    } else {
      fullPath += path;
    }
  }

  // Adjust '..'s by removing parent directories when '..' flows in path.
  var parts = fullPath.split(DIR_SEPARATOR);
  for (var i = 0; i < parts.length; ++i) {
    var part = parts[i];
    if (part == '..') {
      parts[i - 1] = '';
      parts[i] = '';
    }
  }
  fullPath = parts.filter(function(el) {
    return el;
  }).join(DIR_SEPARATOR);

  // Add back in leading slash.
  if (fullPath[0] != DIR_SEPARATOR) {
    fullPath = DIR_SEPARATOR + fullPath;
  } 

  // Replace './' by current dir. ('./one/./two' -> one/two)
  fullPath = fullPath.replace(/\.\//g, DIR_SEPARATOR);

  // Replace '//' with '/'.
  fullPath = fullPath.replace(/\/\//g, DIR_SEPARATOR);

  // Replace '/.' with '/'.
  fullPath = fullPath.replace(/\/\./g, DIR_SEPARATOR);

  // Remove '/' if it appears on the end.
  if (fullPath[fullPath.length - 1] == DIR_SEPARATOR &&
      fullPath != DIR_SEPARATOR) {
    fullPath = fullPath.substring(0, fullPath.length - 1);
  }  

  return fullPath;
}

// // Path can be relative or absolute. If relative, it's taken from the cwd_.
// // If a filesystem URL is passed it, it is simple returned
// function pathToFsURL_(path) {
//   path = resolveToFullPath_(cwdFullPath, path);
//   path = fs_.root.toURL() + path.substring(1);
//   return path;
// };

/**
 * Interface to wrap the native File interface.
 *
 * This interface is necessary for creating zero-length (empty) files,
 * something the Filesystem API allows you to do. Unfortunately, File's
 * constructor cannot be called directly, making it impossible to instantiate
 * an empty File in JS.
 *
 * @param {Object} opts Initial values.
 * @constructor
 */
function MyFile(opts) {
  var blob_ = null;

  this.size = opts.size || 0;
  this.name = opts.name || '';
  this.type = opts.type || '';
  this.lastModifiedDate = opts.lastModifiedDate || null;
  //this.slice = Blob.prototype.slice; // Doesn't work with structured clones.

  // Need some black magic to correct the object's size/name/type based on the
  // blob that is saved.
  Object.defineProperty(this, 'blob_', {
    enumerable: true,
    get: function() {
      return blob_;
    },
    set: function (val) {
      blob_ = val;
      this.size = blob_.size;
      this.name = blob_.name;
      this.type = blob_.type;
      this.lastModifiedDate = blob_.lastModifiedDate;
    }.bind(this)
  });
}
MyFile.prototype.constructor = MyFile; 
//MyFile.prototype.slice = Blob.prototype.slice;

/**
 * Interface to writing a Blob/File.
 *
 * Modeled from:
 * dev.w3.org/2009/dap/file-system/file-writer.html#the-filewriter-interface
 *
 * @param {FileEntry} fileEntry The FileEntry associated with this writer.
 * @constructor
 */
function FileWriter(fileEntry) {
  if (!fileEntry) {
    throw Error('Expected fileEntry argument to write.');
  }

  var position_ = 0;
  var blob_ = fileEntry.file_ ? fileEntry.file_.blob_ : null;

  Object.defineProperty(this, 'position', {
    get: function() {
      return position_;
    }
  });

  Object.defineProperty(this, 'length', {
    get: function() {
      return blob_ ? blob_.size : 0;
    }
  });

  this.seek = function(offset) {
    position_ = offset;

    if (position_ > this.length) {
      position_ = this.length;
    }
    if (position_ < 0) {
      position_ += this.length;
    }
    if (position_ < 0) {
      position_ = 0;
    }
  };

  this.truncate = function(size) {
    if (blob_) {
      if (size < this.length) {
        blob_ = blob_.slice(0, size);
      } else {
        blob_ = new Blob([blob_, new Uint8Array(size - this.length)],
                         {type: blob_.type});
      }
    } else {
      blob_ = new Blob([]);
    }

    position_ = 0; // truncate from beginning of file.

    this.write(blob_); // calls onwritestart and onwriteend.
  };

  this.write = function(data) {
    if (!data) {
      throw Error('Expected blob argument to write.');
    }

    // Call onwritestart if it was defined.
    if (this.onwritestart) {
      this.onwritestart();
    }

    // TODO: not handling onprogress, onwrite, onabort. Throw an error if
    // they're defined.

    if (!blob_) {
      blob_ = new Blob([data], {type: data.type});
    } else {
      // Calc the head and tail fragments
      var head = blob_.slice(0, position_);
      var tail = blob_.slice(position_ + data.size);

      // Calc the padding
      var padding = position_ - head.size;
      if (padding < 0) {
        padding = 0;
      }

      // Do the "write". In fact, a full overwrite of the Blob.
      // TODO: figure out if data.type should overwrite the exist blob's type.
      blob_ = new Blob([head, new Uint8Array(padding), data, tail],
                       {type: blob_.type});
    }

    // Set the blob we're writing on this file entry so we can recall it later.
    fileEntry.file_.blob_ = blob_;
    //fileEntry.file_.blob_.lastModifiedDate = data.lastModifiedDate || null;
    fileEntry.file_.lastModifiedDate = data.lastModifiedDate || null;

    idb_.put(fileEntry, function(entry) {
      // Add size of data written to writer.position.
      position_ += data.size;

      if (this.onwriteend) {
        this.onwriteend();
      }
    }.bind(this), this.onerror);
  };
}


/**
 * Interface for listing a directory's contents (files and folders).
 *
 * Modeled from:
 * dev.w3.org/2009/dap/file-system/pub/FileSystem/#idl-def-DirectoryReader
 *
 * @constructor
 */
function DirectoryReader(dirEntry) {
  var dirEntry_ = dirEntry;
  var used_ = false;

  this.readEntries = function(successCallback, opt_errorCallback) {
    if (!successCallback) {
      throw Error('Expected successCallback argument.');
    }

    // This is necessary to mimic the way DirectoryReader.readEntries() should
    // normally behavior.  According to spec, readEntries() needs to be called
    // until the length of result array is 0. To handle someone implementing
    // a recursive call to readEntries(), get everything from indexedDB on the
    // first shot. Then (DirectoryReader has been used), return an empty
    // result array.
    if (!used_) {
      idb_.getAllEntries(dirEntry_.fullPath, function(entries) {
        used_= true;
        successCallback(entries);
      }, opt_errorCallback);
    } else {
      successCallback([]);
    }
  };
};

/**
 * Interface supplies information about the state of a file or directory. 
 *
 * Modeled from:
 * dev.w3.org/2009/dap/file-system/file-dir-sys.html#idl-def-Metadata
 *
 * @constructor
 */
function Metadata(modificationTime, size) {
  this.modificationTime_ = modificationTime || null;
  this.size_ = size || 0;
}

Metadata.prototype = {
  get modificationTime() {
    return this.modificationTime_;
  },
  get size() {
    return this.size_;
  }
}

/**
 * Interface representing entries in a filesystem, each of which may be a File
 * or DirectoryEntry.
 *
 * Modeled from:
 * dev.w3.org/2009/dap/file-system/pub/FileSystem/#idl-def-Entry
 *
 * @constructor
 */
function Entry() {}

Entry.prototype = {
  name: null,
  fullPath: null,
  filesystem: null,
  copyTo: function() {
    throw NOT_IMPLEMENTED_ERR;
  },
  getMetadata: function(successCallback, opt_errorCallback) {
    if (!successCallback) {
      throw Error('Expected successCallback argument.');
    }

    try {
      if (this.isFile) {
        successCallback(
            new Metadata(this.file_.lastModifiedDate, this.file_.size));
      } else {
        opt_errorCallback(new MyFileError({code: 1001,
            name: 'getMetadata() not implemented for DirectoryEntry'}));
      }
    } catch(e) {
      opt_errorCallback && opt_errorCallback(e);
    }
  },
  getParent: function() {
    throw NOT_IMPLEMENTED_ERR;
  },
  moveTo: function() {
    throw NOT_IMPLEMENTED_ERR;
  },
  remove: function(successCallback, opt_errorCallback) {
    if (!successCallback) {
      throw Error('Expected successCallback argument.');
    }
    // TODO: This doesn't protect against directories that have content in it.
    // Should throw an error instead if the dirEntry is not empty.
    idb_['delete'](this.fullPath, function() {
      successCallback();
    }, opt_errorCallback);
  },
  toURL: function() {
    var origin = location.protocol + '//' + location.host;
    return 'filesystem:' + origin + DIR_SEPARATOR + storageType_.toLowerCase() +
           this.fullPath;
  },
};

/**
 * Interface representing a file in the filesystem.
 *
 * Modeled from:
 * dev.w3.org/2009/dap/file-system/pub/FileSystem/#the-fileentry-interface
 *
 * @param {FileEntry} opt_fileEntry Optional FileEntry to initialize this 
 *     object from.
 * @constructor
 * @extends {Entry}
 */
function FileEntry(opt_fileEntry) {
  this.file_ = null;

  Object.defineProperty(this, 'isFile', {
    enumerable: true,
    get: function() {
      return true;
    }
  });
  Object.defineProperty(this, 'isDirectory', {
    enumerable: true,
    get: function() {
      return false;
    }
  });

  // Create this entry from properties from an existing FileEntry.
  if (opt_fileEntry) {
    this.file_ = opt_fileEntry.file_;
    this.name = opt_fileEntry.name;
    this.fullPath = opt_fileEntry.fullPath;
    this.filesystem = opt_fileEntry.filesystem;
  }
}
FileEntry.prototype = new Entry();
FileEntry.prototype.constructor = FileEntry;
FileEntry.prototype.createWriter = function(callback) {
  // TODO: figure out if there's a way to dispatch onwrite event as we're writing
  // data to IDB. Right now, we're only calling onwritend/onerror
  // FileEntry.write().
  callback(new FileWriter(this));
};
FileEntry.prototype.file = function(successCallback, opt_errorCallback) {
  if (!successCallback) {
    throw Error('Expected successCallback argument.');
  }

  if (this.file_ == null) {
    if (opt_errorCallback) {
      opt_errorCallback(NOT_FOUND_ERR);
    } else {
      throw NOT_FOUND_ERR;
    }
    return;
  }

  // If we're returning a zero-length (empty) file, return the fake file obj.
  // Otherwise, return the native File object that we've stashed.
  var file = this.file_.blob_ == null ? this.file_ : this.file_.blob_;
  file.lastModifiedDate = this.file_.lastModifiedDate;

  // Add Blob.slice() to this wrapped object. Currently won't work :(
  /*if (!val.slice) {
    val.slice = Blob.prototype.slice; // Hack to add back in .slice().
  }*/
  successCallback(file);
};

/**
 * Interface representing a directory in the filesystem.
 *
 * Modeled from:
 * dev.w3.org/2009/dap/file-system/pub/FileSystem/#the-directoryentry-interface
 *
 * @param {DirectoryEntry} opt_folderEntry Optional DirectoryEntry to
 *     initialize this object from.
 * @constructor
 * @extends {Entry}
 */
function DirectoryEntry(opt_folderEntry) {
  Object.defineProperty(this, 'isFile', {
    enumerable: true,
    get: function() {
      return false;
    }
  });
  Object.defineProperty(this, 'isDirectory', {
    enumerable: true,
    get: function() {
      return true;
    }
  });

  // Create this entry from properties from an existing DirectoryEntry.
  if (opt_folderEntry) {
    this.name = opt_folderEntry.name;
    this.fullPath = opt_folderEntry.fullPath;
    this.filesystem = opt_folderEntry.filesystem;
  }
}
DirectoryEntry.prototype = new Entry();
DirectoryEntry.prototype.constructor = DirectoryEntry; 
DirectoryEntry.prototype.createReader = function() {
  return new DirectoryReader(this);
};
DirectoryEntry.prototype.getDirectory = function(path, options, successCallback,
                                                 opt_errorCallback) {

  // Create an absolute path if we were handed a relative one.
  path = resolveToFullPath_(this.fullPath, path);

  idb_.get(path, function(folderEntry) {
    if (!options) {
      options = {};
    }

    if (options.create === true && options.exclusive === true && folderEntry) {
      // If create and exclusive are both true, and the path already exists,
      // getDirectory must fail.
      if (opt_errorCallback) {
        opt_errorCallback(INVALID_MODIFICATION_ERR);
        return;
      }
    } else if (options.create === true && !folderEntry) {
      // If create is true, the path doesn't exist, and no other error occurs,
      // getDirectory must create it as a zero-length file and return a corresponding
      // DirectoryEntry.
      var dirEntry = new DirectoryEntry();
      dirEntry.name = path.split(DIR_SEPARATOR).pop(); // Just need filename.
      dirEntry.fullPath = path;
      dirEntry.filesystem = fs_;
  
      idb_.put(dirEntry, successCallback, opt_errorCallback);
    } else if (options.create === true && folderEntry) {

      if (folderEntry.isDirectory) {
        // IDB won't save methods, so we need re-create the DirectoryEntry.
        successCallback(new DirectoryEntry(folderEntry));
      } else {
        if (opt_errorCallback) {
          opt_errorCallback(INVALID_MODIFICATION_ERR);
          return;
        }
      }
    } else if ((!options.create || options.create === false) && !folderEntry) {
      // Handle root special. It should always exist.
      if (path == DIR_SEPARATOR) {
        folderEntry = new DirectoryEntry();
        folderEntry.name = '';
        folderEntry.fullPath = DIR_SEPARATOR;
        folderEntry.filesystem = fs_;
        successCallback(folderEntry);
        return;
      }

      // If create is not true and the path doesn't exist, getDirectory must fail.
      if (opt_errorCallback) {
        opt_errorCallback(NOT_FOUND_ERR);
        return;
      }
    } else if ((!options.create || options.create === false) && folderEntry &&
               folderEntry.isFile) {
      // If create is not true and the path exists, but is a file, getDirectory
      // must fail.
      if (opt_errorCallback) {
        opt_errorCallback(INVALID_MODIFICATION_ERR);
        return;
      }
    } else {
      // Otherwise, if no other error occurs, getDirectory must return a
      // DirectoryEntry corresponding to path.

      // IDB won't' save methods, so we need re-create DirectoryEntry.
      successCallback(new DirectoryEntry(folderEntry));
    } 
  }, opt_errorCallback);
};

DirectoryEntry.prototype.getFile = function(path, options, successCallback,
                                            opt_errorCallback) {

  // Create an absolute path if we were handed a relative one.
  path = resolveToFullPath_(this.fullPath, path);

  idb_.get(path, function(fileEntry) {
    if (!options) {
      options = {};
    }

    if (options.create === true && options.exclusive === true && fileEntry) {
      // If create and exclusive are both true, and the path already exists,
      // getFile must fail.

      if (opt_errorCallback) {
        opt_errorCallback(INVALID_MODIFICATION_ERR);
        return;
      }
    } else if (options.create === true && !fileEntry) {
      // If create is true, the path doesn't exist, and no other error occurs,
      // getFile must create it as a zero-length file and return a corresponding
      // FileEntry.
      var fileEntry = new FileEntry();
      fileEntry.name = path.split(DIR_SEPARATOR).pop(); // Just need filename.
      fileEntry.fullPath = path;
      fileEntry.filesystem = fs_;
      fileEntry.file_ = new MyFile({size: 0, name: fileEntry.name,
                                    lastModifiedDate: new Date()});

      idb_.put(fileEntry, successCallback, opt_errorCallback);

    } else if (options.create === true && fileEntry) {
      if (fileEntry.isFile) {
        // IDB won't save methods, so we need re-create the FileEntry.
        successCallback(new FileEntry(fileEntry));
      } else {
        if (opt_errorCallback) {
          opt_errorCallback(INVALID_MODIFICATION_ERR);
          return;
        }
      }
    } else if ((!options.create || options.create === false) && !fileEntry) {
      // If create is not true and the path doesn't exist, getFile must fail.
      if (opt_errorCallback) {
        opt_errorCallback(NOT_FOUND_ERR);
        return;
      }
    } else if ((!options.create || options.create === false) && fileEntry &&
               fileEntry.isDirectory) {
      // If create is not true and the path exists, but is a directory, getFile
      // must fail.
      if (opt_errorCallback) {
        opt_errorCallback(INVALID_MODIFICATION_ERR);
        return;
      }
    } else {
      // Otherwise, if no other error occurs, getFile must return a FileEntry
      // corresponding to path.

      // IDB won't' save methods, so we need re-create the FileEntry.
      successCallback(new FileEntry(fileEntry));
    } 
  }, opt_errorCallback);
};

DirectoryEntry.prototype.removeRecursively = function(successCallback,
                                                      opt_errorCallback) {
  if (!successCallback) {
    throw Error('Expected successCallback argument.');
  }

  this.remove(successCallback, opt_errorCallback);
};

/**
 * Interface representing a filesystem.
 *
 * Modeled from:
 * dev.w3.org/2009/dap/file-system/pub/FileSystem/#idl-def-LocalFileSystem
 *
 * @param {number} type Kind of storage to use, either TEMPORARY or PERSISTENT.
 * @param {number} size Storage space (bytes) the application expects to need.
 * @constructor
 */
function DOMFileSystem(type, size) {
  storageType_ = type == exports.TEMPORARY ? 'Temporary' : 'Persistent';
  this.name = (location.protocol + location.host).replace(/:/g, '_') +
              ':' + storageType_;
  this.root = new DirectoryEntry();
  this.root.fullPath = DIR_SEPARATOR;
  this.root.filesystem = this;
  this.root.name = '';
}

function requestFileSystem(type, size, successCallback, opt_errorCallback) {
  if (type != exports.TEMPORARY && type != exports.PERSISTENT) {
    if (opt_errorCallback) {
      opt_errorCallback(INVALID_MODIFICATION_ERR);
      return;
    }
  }

  fs_ = new DOMFileSystem(type, size);
  idb_.open(fs_.name, function(e) {
    successCallback(fs_);
  }, opt_errorCallback);
}

function resolveLocalFileSystemURL(url, callback, opt_errorCallback) {
  if (opt_errorCallback) {
    opt_errorCallback(NOT_IMPLEMENTED_ERR);
    return;
  }
}

// Core logic to handle IDB operations =========================================

idb_.open = function(dbName, successCallback, opt_errorCallback) {
  var self = this;

  // TODO: FF 12.0a1 isn't liking a db name with : in it.
  var request = indexedDB.open(dbName.replace(':', '_')/*, 1 /*version*/);

  request.onerror = opt_errorCallback || onError;

  request.onupgradeneeded = function(e) {
    // First open was called or higher db version was used.

   // console.log('onupgradeneeded: oldVersion:' + e.oldVersion,
   //           'newVersion:' + e.newVersion);
    
    self.db = e.target.result;
    self.db.onerror = onError;

    if (!self.db.objectStoreNames.contains(FILE_STORE_)) {
      var store = self.db.createObjectStore(FILE_STORE_/*,{keyPath: 'id', autoIncrement: true}*/);
    }
  };

  request.onsuccess = function(e) {
    self.db = e.target.result;
    self.db.onerror = onError;
    successCallback(e);
  };
 
  request.onblocked = opt_errorCallback || onError;
};

idb_.close = function() {
  this.db.close();
  this.db = null;
};

// TODO: figure out if we should ever call this method. The filesystem API
// doesn't allow you to delete a filesystem once it is 'created'. Users should
// use the public remove/removeRecursively API instead.
idb_.drop = function(successCallback, opt_errorCallback) {
  if (!this.db) {
    return;
  }

  var dbName = this.db.name;

  var request = indexedDB.deleteDatabase(dbName);
  request.onsuccess = function(e) {
    successCallback(e);
  };
  request.onerror = opt_errorCallback || onError;

  idb_.close();
};

idb_.get = function(fullPath, successCallback, opt_errorCallback) {
  if (!this.db) {
    return;
  }

  var tx = this.db.transaction([FILE_STORE_], 'readonly');

  //var request = tx.objectStore(FILE_STORE_).get(fullPath);
  var range = IDBKeyRange.bound(fullPath, fullPath + DIR_OPEN_BOUND,
                                false, true);
  var request = tx.objectStore(FILE_STORE_).get(range);

  tx.onabort = opt_errorCallback || onError;
  tx.oncomplete = function(e) {
    successCallback(request.result);
  };
};

idb_.getAllEntries = function(fullPath, successCallback, opt_errorCallback) {
  if (!this.db) {
    return;
  }

  var results = [];

  //var range = IDBKeyRange.lowerBound(fullPath, true);
  //var range = IDBKeyRange.upperBound(fullPath, true);

  // Treat the root entry special. Querying it returns all entries because
  // they match '/'.
  var range = null;
  if (fullPath != DIR_SEPARATOR) {
    //console.log(fullPath + '/', fullPath + DIR_OPEN_BOUND)
    range = IDBKeyRange.bound(
        fullPath + DIR_SEPARATOR, fullPath + DIR_OPEN_BOUND, false, true);
  }

  var tx = this.db.transaction([FILE_STORE_], 'readonly');
  tx.onabort = opt_errorCallback || onError;
  tx.oncomplete = function(e) {
    // TODO: figure out how to do be range queries instead of filtering result
    // in memory :(
    results = results.filter(function(val) {
      var valPartsLen = val.fullPath.split(DIR_SEPARATOR).length;
      var fullPathPartsLen = fullPath.split(DIR_SEPARATOR).length;
      
      if (fullPath == DIR_SEPARATOR && valPartsLen < fullPathPartsLen + 1) {
        // Hack to filter out entries in the root folder. This is inefficient
        // because reading the entires of fs.root (e.g. '/') returns ALL
        // results in the database, then filters out the entries not in '/'.
        return val;
      } else if (fullPath != DIR_SEPARATOR &&
                 valPartsLen == fullPathPartsLen + 1) {
        // If this a subfolder and entry is a direct child, include it in
        // the results. Otherwise, it's not an entry of this folder.
        return val;
      }
    });

    successCallback(results);
  };

  var request = tx.objectStore(FILE_STORE_).openCursor(range);

  request.onsuccess = function(e) {
    var cursor = e.target.result;
    if (cursor) {
      var val = cursor.value;

      results.push(val.isFile ? new FileEntry(val) : new DirectoryEntry(val));
      cursor['continue']();
    }
  };
};

idb_['delete'] = function(fullPath, successCallback, opt_errorCallback) {
  if (!this.db) {
    return;
  }

  var tx = this.db.transaction([FILE_STORE_], 'readwrite');
  tx.oncomplete = successCallback;
  tx.onabort = opt_errorCallback || onError;

  //var request = tx.objectStore(FILE_STORE_).delete(fullPath);
  var range = IDBKeyRange.bound(
      fullPath, fullPath + DIR_OPEN_BOUND, false, true);
  var request = tx.objectStore(FILE_STORE_)['delete'](range);
};

idb_.put = function(entry, successCallback, opt_errorCallback) {
  if (!this.db) {
    return;
  }

  var tx = this.db.transaction([FILE_STORE_], 'readwrite');
  tx.onabort = opt_errorCallback || onError;
  tx.oncomplete = function(e) {
    // TODO: Error is thrown if we pass the request event back instead.
    successCallback(entry);
  };

  var request = tx.objectStore(FILE_STORE_).put(entry, entry.fullPath);
};

// Global error handler. Errors bubble from request, to transaction, to db.
function onError(e) {
  switch (e.target.errorCode) {
    case 12:
      console.log('Error - Attempt to open db with a lower version than the ' +
                  'current one.');
      break;
    default:
      console.log('errorCode: ' + e.target.errorCode);
  }

  console.log(e, e.code, e.message);
}

// Clean up.
// TODO: decide if this is the best place for this. 
exports.addEventListener('beforeunload', function(e) {
  idb_.db.close();
}, false);

//exports.idb = idb_;
exports.requestFileSystem = requestFileSystem;
exports.resolveLocalFileSystemURL = resolveLocalFileSystemURL;

// Export more stuff (to window) for unit tests to do their thing.
if (exports === window && exports.RUNNING_TESTS) {
  exports['Entry'] = Entry;
  exports['FileEntry'] = FileEntry;
  exports['DirectoryEntry'] = DirectoryEntry;
  exports['resolveToFullPath_'] = resolveToFullPath_;
  exports['Metadata'] = Metadata;
}

})(self); // Don't use window because we want to run in workers.

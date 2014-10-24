function onError(e) {
  ok(false, 'unexpected error ' + e.name);
  start();
};

module('window methods', {
  setup: function() {
    if (document.location.protocol == 'file:') {
      ok(false, 'These tests need to be run from a web server over http://.');
    }
  },
  teardown: function() {

  }
});

/*test("check constructors can't be seen by global scope", 7, function() {
  // Shouldn't be able to call constructors on these interfaces:
  ok(window.FileEntry === undefined, 'window.FileEntry not defined');
  ok(window.DiretoryEntry === undefined, 'window.DiretoryEntry not defined');
  ok(window.Entry === undefined, 'window.Entry not defined');
  ok(window.DirectoryReader === undefined, 'window.DirectoryReader not defined');
  ok(window.FileWriter === undefined, 'window.FileWriter not defined');
  ok(window.DOMFileSystem === undefined, 'window.DOMFileSystem not defined');
  ok(window.idb === undefined, 'idb was exposed to global scope');
});*/

module('helpers', {
  setup: function() {

  },
  teardown: function() {

  }
});

test('resolveToFullPath_', 23, function() {
  equal(resolveToFullPath_('/', '/'), '/');
  equal(resolveToFullPath_('/', '/asdf/'), '/asdf');
  equal(resolveToFullPath_('/asdf', '/asdf'), '/asdf');
  equal(resolveToFullPath_('/asdf/asdf', '/asdf/asdf/..'), '/asdf');
  equal(resolveToFullPath_('/asdf/asdf', '/asdf/asdf/../'), '/asdf');
  equal(resolveToFullPath_('/asdf/asdf', '..'), '/asdf');
  equal(resolveToFullPath_('/asdf/asdf', '../'), '/asdf');
  equal(resolveToFullPath_('/asdf/asdf', '/asdf/asdf/..'), '/asdf');
  equal(resolveToFullPath_('/', 'asdf'), '/asdf');
  equal(resolveToFullPath_('/', 'asdf/'), '/asdf');
  equal(resolveToFullPath_('/asdf', 'asdf'), '/asdf/asdf');
  equal(resolveToFullPath_('/', './asdf'), '/asdf');
  equal(resolveToFullPath_('/asdf', './one/./'), '/asdf/one');
  equal(resolveToFullPath_('/asdf', './one/./two'), '/asdf/one/two');
  equal(resolveToFullPath_('/', '.'), '/');
  equal(resolveToFullPath_('/asdf', '.'), '/asdf');
  equal(resolveToFullPath_('/', './'), '/');
  equal(resolveToFullPath_('/', '../'), '/');
  equal(resolveToFullPath_('/', '..'), '/');
  equal(resolveToFullPath_('/asdf', '../'), '/');

  equal(resolveToFullPath_('/', 'test.mp3'), '/test.mp3');
  equal(resolveToFullPath_('/asdf', 'test.mp3'), '/asdf/test.mp3');
  equal(resolveToFullPath_('/asdf/one', './test.mp3'), '/asdf/one/test.mp3');
});

test('requestFileSystem', 10, function() {
  ok(window.requestFileSystem, 'window.requestFileSystem defined');
  equal(window.TEMPORARY, 0);
  equal(window.PERSISTENT, 1);

  stop();
  window.requestFileSystem(TEMPORARY, 1024*1024, function(fs) {
    equal(fs.name, 'http_' + location.host.replace(':', '_') + ':Temporary');
    ok(fs === fs.root.filesystem, 'fs.root.filesystem === fs');
    equal(fs.root.fullPath, '/', 'full path is /');
    equal(fs.root.isFile, false, 'root is not a FileEntry');
    equal(fs.root.isDirectory, true, 'root is a DirectoryEntry');
    equal(fs.root.name, '');
    start();
  }, onError);

  stop();
  window.requestFileSystem(3000, 1024*1024, function(fs) {
    ok(false, 'incorrect storage type accepted');
  }, function(e) {
    equal(e.name, 'INVALID_MODIFICATION_ERR', 'incorrect storage type used');
    start();
  });
});

test('resolveLocalFileSystemURL', 2, function() {
  ok(window.resolveLocalFileSystemURL, 'window.resolveLocalFileSystemURL defined');

  stop();
  window.resolveLocalFileSystemURL('/', function(entry) {
    ok(false);
  }, function() {
    ok(true, 'window.resolveLocalFileSystemURL() correctly threw not implemented error');
    start();
  });
});

module('Metadata', {
  setup: function() {
    var self = this;
    stop();
    window.requestFileSystem(TEMPORARY, 1024*1024, function(fs) {
      self.fs = fs;
      start();
    }, onError);
  },
  teardown: function() {

  }
});


test('getMetadata()', 7, function() {
  var fs = this.fs;
  var entry = fs.root;
  var FILE_NAME = 'idb_test_file_getmetadata' + Date.now();
  var BLOB_DATA = '123';
  var MIMETYPE = 'text/plain';
  var LAST_MODIFIED_DATE = new Date(Date.now());

  var blob = new Blob([BLOB_DATA], {type: MIMETYPE});
  blob.lastModifiedDate = LAST_MODIFIED_DATE;

  stop();
  entry.getFile(FILE_NAME, {create: true}, function(fileEntry) {
    fileEntry.getMetadata(function(metadata) {
      ok(metadata instanceof Metadata, 'arg is instanceof of Metadata');
      ok(metadata.modificationTime instanceof Date, 'modificationTime is a Date');
      equal(metadata.size, 0, 'empty file size is 0');

      fileEntry.remove(function() {
        start();
      });
    }, onError);
  }, function(e) {
    ok(true, "getMetadata returned error");
    start();
  });


  stop();
  var FILE_NAME2 = FILE_NAME + '_2';
  entry.getFile(FILE_NAME2, {create: true}, function(fileEntry) {
    fileEntry.createWriter(function(writer) {

      writer.onwriteend = function() {
        fileEntry.file(function(file) {
          fileEntry.getMetadata(function(metadata) {
            equal(metadata.modificationTime, blob.lastModifiedDate,
                  'modificationTime correct');
            equal(metadata.size, blob.size, '.size is same as blob');

            equal(file.type, MIMETYPE, 'file.type correctly set');
            equal(file.lastModifiedDate, blob.lastModifiedDate,
                  'returned file.lastModifiedDate is correct');

            fileEntry.remove(function() {
              start();
            });
          }, onError);
        });
      };

      writer.write(blob);
    });
  }, onError);
});

module('Entry', {
  setup: function() {
    var self = this;
    stop();
    window.requestFileSystem(TEMPORARY, 1024*1024, function(fs) {
      self.fs = fs;
      start();
    }, onError);
  },
  teardown: function() {

  }
});

test('verify properties/methods exist', 9, function() {
  var fs = this.fs;

  ok(fs.root.hasOwnProperty('name'), 'Entry.name defined');
  ok(fs.root.hasOwnProperty('fullPath'), 'Entry.fullPath defined');
  ok(fs.root.hasOwnProperty('filesystem'), 'Entry.filesystem defined');
  ok(typeof fs.root.getParent == 'function', 'Entry.getParent() defined');
  ok(typeof fs.root.getMetadata == 'function', 'Entry.getMetadata() defined');
  ok(typeof fs.root.copyTo == 'function', 'Entry.copyTo() defined');
  ok(typeof fs.root.moveTo == 'function', 'Entry.moveTo() defined');
  ok(typeof fs.root.remove == 'function', 'Entry.remove() defined');
  ok(typeof fs.root.toURL == 'function', 'Entry.toURL() defined');
});

test('toURL()', 1, function() {
  var origin = location.protocol + '//' + location.host;
  equal(this.fs.root.toURL(), 'filesystem:' + origin + '/temporary/', '');
});

module('DirectoryEntry', {
  setup: function() {
    var self = this;
    stop();
    window.requestFileSystem(TEMPORARY, 1024*1024, function(fs) {
      self.fs = fs;
      start();
    }, onError);
  },
  teardown: function() {

  }
});

test('verify properties/methods exist', 8, function() {
  var fs = this.fs;

  ok(fs.root instanceof Entry, 'DirectoryEntry inherits from Entry');
  ok(fs.root.__proto__ === DirectoryEntry.prototype, 'fs.root is a DirectoryEntry');
  ok(typeof fs.root.getFile == 'function', 'DirectoryEntry.getFile() defined');
  ok(typeof fs.root.getDirectory == 'function', 'DirectoryEntry.getDirectory() defined');
  ok(typeof fs.root.createReader == 'function', 'DirectoryEntry.createReader() defined');
  ok(typeof fs.root.removeRecursively == 'function', 'DirectoryEntry.removeRecursively() defined');
  equal(fs.root.isFile, false, 'DirectoryEntry.isFile == false');
  equal(fs.root.isDirectory, true, 'DirectoryEntry.isDirectory == true');
});

test('read directory', 2, function() {
  var fs = this.fs;
  var entry = fs.root;

  try {
    entry.createReader().readEntries();
  } catch(e) {
    ok(true, 'createReader needs to be passed a success callback.');
  }

  stop();
  entry.createReader().readEntries(function(entries) {
    ok(entries.slice, 'returned entries is an array') // Verify we got an Array.
    start();
  }, onError);
});

test('getFile()', 5, function() {
  var fs = this.fs;
  var entry = fs.root;
  var FILE_NAME = 'idb_test_file_name' + Date.now();

  stop();
  entry.getFile(FILE_NAME, {create: false}, function(fileEntry) {
    ok(false, 'file existed');
    start();
  }, function(e) {
    ok(true, "{create: false} and file didn't exist");
    start();
  });

  var FILE_NAME2 = FILE_NAME + '_2';
  stop();
  entry.getFile(FILE_NAME2, {create: true}, function(fileEntry) {
    entry.getFile(fileEntry.fullPath, {create: false}, function(fileEntry2) {
      ok(true, fileEntry2.name + ' existed after creating it.');
      fileEntry2.remove(function() {
        start();
      });
    }, onError);
  }, onError);

  var FILE_NAME3 = FILE_NAME + '_3';
  stop();
  entry.getFile(FILE_NAME3, {create: true}, function(fileEntry) {
    entry.getFile(fileEntry.fullPath, {create: true, exclusive: true}, function(fileEntry2) {
      ok(false, 'exclusive was set, file exists, and no error was thrown');
      start();
    }, function(e) {
      ok(true, 'exclusive was set, file exists, and error was thrown');
      fileEntry.remove(function() {
        start();
      });
    });
  }, onError);

  stop();
  var FILE_NAME4 = FILE_NAME + '_4';
  entry.getFile(FILE_NAME4, {}, function(fileEntry) {
    ok(false, 'file existed');
    start();
  }, function(e) {
    ok(true, "{} returned error when file didn't exist");
    start();
  });

  stop();
  var FILE_NAME5 = FILE_NAME + '_5';
  entry.getDirectory(FILE_NAME5, {create: true}, function(folderEntry) {
    entry.getFile(FILE_NAME5, {create: true}, function(fileEntry) {
      ok(false, 'tried to create folder with same path as an existing file');
      start();
    }, function(e) {
      ok(true, 'tried to create folder with same path as an existing file');
      folderEntry.remove(function() {
        start();
      });
    });
  }, onError);
});

test('add/remove file in directory', 4, function() {
  var fs = this.fs;
  var entry = fs.root;
  var FILE_NAME = 'idb_test_file_name' + Date.now();

  stop();
  entry.getFile(FILE_NAME, {create: true}, function(fileEntry) {
    ok(fileEntry.__proto__ === FileEntry.prototype, 'created file is a FileEntry');
    equal(fileEntry.isFile, true, '.isFile == true');
    equal(fileEntry.fullPath, '/' + FILE_NAME, "fullPath is correct");
    equal(fileEntry.name, FILE_NAME, "filename matches one set");
    fileEntry.remove(function() {
      start();
    });
  }, onError);
});

test('getDirectory()', 9, function() {
  var fs = this.fs;
  var entry = fs.root;
  var FOLDER_NAME = 'idb_test_folder_name' + Date.now();
  var FILE_NAME = 'idb_test_file_name' + Date.now();

  stop();
  entry.getDirectory(FOLDER_NAME, {create: false}, function(folderEntry) {
    ok(false, 'folder existed');
    start();
  }, function(e) {
    ok(true, "{create: false} and folder didn't exist");
    start();
  });

  var FOLDER_NAME2 = FOLDER_NAME + '_2';
  stop();
  entry.getDirectory(FOLDER_NAME2, {create: true}, function(folderEntry) {
    ok(folderEntry.__proto__ === DirectoryEntry.prototype, 'created entry is a DirectoryEntry');
    equal(folderEntry.isDirectory, true, '.isDirectory == true');
    equal(folderEntry.fullPath, '/' + FOLDER_NAME2, "fullPath is correct");
    equal(folderEntry.name, FOLDER_NAME2, "folder name matches one that was set");
    folderEntry.remove(function() {
      start();
    });
  }, onError);

  var FOLDER_NAME3 = FOLDER_NAME + '_3';
  stop();
  entry.getDirectory(FOLDER_NAME3, {create: true}, function(folderEntry) {
    entry.getDirectory(folderEntry.fullPath, {create: true, exclusive: true}, function(folderEntry2) {
      ok(false, 'exclusive was set, folder exists, and no error was thrown');
      start();
    }, function(e) {
      ok(true, 'exclusive was set, folder exists, and error was thrown');
      folderEntry.remove(function() {
        start();
      });
    });
  }, onError);

  stop();
  var FOLDER_NAME4 = FOLDER_NAME + '_4';
  entry.getDirectory(FOLDER_NAME4, {}, function(folderEntry) {
    ok(false, 'folder existed');
    start();
  }, function(e) {
    ok(true, "{} returned error when folder didn't exist");
    start();
  });

  stop();
  entry.getFile(FILE_NAME, {create: true}, function(fileEntry) {
    entry.getDirectory(FILE_NAME, {create: true}, function(folderEntry) {
      ok(false, 'tried to create folder with same path as an existing file');
      start();
    }, function(e) {
      ok(true, 'tried to create folder with same path as an existing file');
      fileEntry.remove(function() {
        start();
      });
    });
  }, onError);

  stop();
  var FOLDER_NAME5 = FOLDER_NAME + '_5';
  entry.getDirectory(FOLDER_NAME5, {create: true}, function(folderEntry) {
    folderEntry.getDirectory(FOLDER_NAME5, {create: true}, function(folderEntry2) {
      equal(folderEntry2.fullPath, '/' + FOLDER_NAME5 + '/' + FOLDER_NAME5,
            'Subfolder created successfully');
      folderEntry.removeRecursively(function() {
        start();
      });
    }, onError);
  }, onError);

  // TODO: test dirEntry.removeRecursively()
});


module('FileEntry', {
  setup: function() {
    var self = this;
    stop();
    window.requestFileSystem(TEMPORARY, 1024*1024, function(fs) {
      self.fs = fs;
      start();
    }, onError);
  },
  teardown: function() {

  }
});

test('verify properties/methods exist', 6, function() {
  var fs = this.fs;

  var fileEntry = new FileEntry();

  ok(fileEntry instanceof Entry, 'FileEntry inherits from Entry');
  ok(fileEntry.__proto__ === FileEntry.prototype, 'fileEntry is a FileEntry');
  ok(typeof fileEntry.createWriter == 'function', 'FileEntry.createWriter() defined');
  ok(typeof fileEntry.file == 'function', 'FileEntry.file() defined');
  equal(fileEntry.isFile, true, 'FileEntry.isFile == false');
  equal(fileEntry.isDirectory, false, 'FileEntry.isDirectory == true');
});

test('file()', 4, function() {
  var fs = this.fs;
  var entry = fs.root;
  var FILE_NAME = 'idb_test_file_name' + Date.now();

  try {
    var fileEntry = new FileEntry();
    fileEntry.file();
  } catch(e) {
    ok(true, 'success callback required.');
  }

  try {
    var fileEntry = new FileEntry();
    fileEntry.file(function(file) {
      ok(false);
    });
  } catch(e) {
    ok(true, 'FileEntry.file() threw NOT_FOUND_ERROR');
  }

  stop();
  entry.getFile(FILE_NAME, {create: true}, function(fileEntry) {
    fileEntry.file(function(file) {
      equal(file.size, 0, 'empty file.size == 0');
      equal(file.type, '', "empty file has type==''");
      fileEntry.remove(function() {
        start();
      });
    }, function(e) {
      ok(false, 'NOT_FOUND_ERROR');
      start();
    });
  }, onError);
});

module('FileWriter', {
  setup: function() {
    var self = this;
    stop();
    window.requestFileSystem(TEMPORARY, 1024*1024, function(fs) {
      self.fs = fs;
      start();
    }, onError);
  },
  teardown: function() {

  }
});

test('write()', 18, function() {
  var fs = this.fs;
  var entry = fs.root;
  var FILE_NAME = 'idb_test_file_name_writer' + Date.now();
  var BLOB_DATA = '123';
  var MIMETYPE = 'text/plain';

  // FileWriter shouldn't be an accessible constructor.
  ok(window.FileWriter === undefined, 'window.FileWriter is undefined');

  var fileEntry = new FileEntry();
  stop();
  fileEntry.createWriter(function(writer) {
    equal(writer.position, 0, 'writer.position is 0');
    equal(writer.length, 0, 'writer.length is 0');
    start();
  });

  var fileEntry2 = new FileEntry();
  stop();
  fileEntry2.createWriter(function(writer) {
    try {
      writer.write();
      start();
    } catch(e) {
      ok(true, 'Exception thrown for missing blob argument.');
      start();
    }
  });

  stop();
  entry.getFile(FILE_NAME, {create: true}, function(fileEntry) {
    fileEntry.createWriter(function(writer) {

      writer.onwritestart = function() {
        ok(true, 'onwritestart fired');
        ok(this === writer, 'this is writer object');
        equal(this.position, 0, '.position is 0');
        equal(this.length, 0, '.length is 0');
      };

      writer.onwriteend = function() {
        ok(true, 'onwriteend fired');
        equal(this.position, BLOB_DATA.length, '.position is correct after write');
        equal(this.length, BLOB_DATA.length, '.length is correct after write');

        fileEntry.file(function(file) {
          equal(file.type, MIMETYPE, 'file.type correctly set');
          equal(file.size, writer.length, 'file.size == writer.length');
          fileEntry.remove(function() {
            start();
          });
        });
      };

      fileEntry.file(function(file) {
        equal(file.type, '', 'file.type initially blank');
        equal(file.size, 0, 'file.size initially 0');
        equal(file.name, FILE_NAME, 'filename == ' + FILE_NAME);

        // Run the writes after this async function does its thing.
        var blob = new Blob([BLOB_DATA], {type: MIMETYPE});
        writer.write(blob);
      });
    });
  }, onError);

  // Test reusing a FileWriter.
  stop();
  var FILE_NAME2 = FILE_NAME + '_2';
  entry.getFile(FILE_NAME2, {create: true}, function(fileEntry) {
    fileEntry.createWriter(function(writer) {

      writer.onwriteend = function() {
        writer.onwriteend = function() {
          fileEntry.file(function(file) {
            equal(file.size, 2 * BLOB_DATA.length, 'file.size is correct');
            equal(writer.length, 2 * BLOB_DATA.length, 'file.size == writer.length');
            fileEntry.remove(function() {
              start();
            });
          });
        };

        // Append more data.
        var blob = new Blob([BLOB_DATA]);
        writer.write(blob);
      };

      var blob = new Blob([BLOB_DATA], {type: MIMETYPE});
      writer.write(blob);
    });
  }, onError);

});

test('truncate()', 5, function() {
  var fs = this.fs;
  var entry = fs.root;
  var FILE_NAME = 'idb_test_file_name_truncate' + Date.now();
  var BLOB_DATA = '123';
  var MIMETYPE = 'text/plain';
  var SIZE = 1;

  stop();
  entry.getFile(FILE_NAME, {create: true}, function(fileEntry) {
    fileEntry.createWriter(function(writer) {

      writer.onwritestart = function() {
        ok(true, 'onwritestart fired on truncate()');
      }

      writer.onwriteend = function() {
        writer.onwritestart = null;
        writer.onwriteend = function() {
          fileEntry.file(function(file) {
            equal(writer.length, SIZE, 'writer.length == SIZE after truncate()');
            equal(file.size, SIZE, 'file.size is correct after truncate()');
            fileEntry.remove(function() {
              start();
            });
          });
        };
        writer.truncate(SIZE);
      };

      var blob = new Blob([BLOB_DATA], {type: MIMETYPE});
      writer.write(blob);
    });
  }, onError);

  stop();
  var FILE_NAME2 = FILE_NAME + '_2';
  SIZE = BLOB_DATA.length * 2;
  entry.getFile(FILE_NAME2, {create: true}, function(fileEntry) {
    fileEntry.createWriter(function(writer) {

      writer.onwriteend = function() {
        writer.onwriteend = function() {
          fileEntry.file(function(file) {
            equal(writer.length, SIZE, 'writer.length == SIZE after truncate() padding');
            equal(file.size, SIZE, 'file.size is correct after truncate() padding');
            fileEntry.remove(function() {
              start();
            });
          });
        };
        writer.truncate(SIZE);
      };

      var blob = new Blob([BLOB_DATA], {type: MIMETYPE});
      writer.write(blob);
    });
  }, onError);

});

test('seek()', 4, function() {
  var fs = this.fs;
  var entry = fs.root;
  var FILE_NAME = 'idb_test_file_name_seek' + Date.now();
  var BLOB_DATA = '123';
  var MIMETYPE = 'text/plain';

  stop();
  entry.getFile(FILE_NAME, {create: true}, function(fileEntry) {
    fileEntry.createWriter(function(writer) {

      writer.onwriteend = function() {
        writer.onwriteend = function() {
          fileEntry.file(function(file) {
            equal(writer.length, BLOB_DATA.length, 'Length did not increase after seek(0).');
            equal(file.size, BLOB_DATA.length, 'file.size did not increase after seek(0) .');
            fileEntry.remove(function() {
              start();
            });
          });
        };
        writer.seek(0);
        writer.write(blob);
      };

      var blob = new Blob([BLOB_DATA], {type: MIMETYPE});
      writer.write(blob);
    });
  }, onError);

  stop();
  var FILE_NAME2 = FILE_NAME + '_2';
  entry.getFile(FILE_NAME2, {create: true}, function(fileEntry) {
    fileEntry.createWriter(function(writer) {

      writer.onwriteend = function() {
        writer.onwriteend = function() {
          fileEntry.file(function(file) {
            equal(writer.length, BLOB_DATA.length * 2 - 1, 'length correct after seek(-1).');
            equal(file.size, BLOB_DATA.length * 2 - 1, 'file.size correct after seek(-1) .');
            fileEntry.remove(function() {
              start();
            });
          });
        };
        writer.seek(-1);
        writer.write(blob);
      };

      var blob = new Blob([BLOB_DATA], {type: MIMETYPE});
      writer.write(blob);
    });
  }, onError);
});

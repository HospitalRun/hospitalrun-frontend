/*test("module without setup/teardown (default)", function() {
  expect(1);
  ok(true);
});

test("expect in test", 3, function() {
  ok(true);
  ok(true);
  ok(true);
});*/

var RUN_MANUAL_TEST = !!!window.phantom;

function onError(e) {
  ok(false, 'unexpected error ' + e.name);
  start();
};


module('init()', {
  setup: function() {
    if (document.location.protocol == 'file:') {
      ok(false, 'These tests need to be run from a web server over http://.');
    }

    this.filer = new Filer();
  },
  teardown: function() {

  }
});


/*asyncTest('browser not supported', 1, function() {
  this.filer = new Filer();

  raises(function() {
    var temp = window.requestFileSystem;
    window.requestFileSystem = null; // pretend we're a browser without support.
    this.filer.init({}, function(fs) {});
    window.requestFileSystem = temp;
  }, 'BROWSER_NOT_SUPPORTED thrown');

  start();

});*/

test('default arguments', 6, function() {
  var filer = this.filer;

  equal(filer.isOpen, false, 'filesystem not open');

  stop();
  filer.init({}, function(fs) {
    equal(Filer.DEFAULT_FS_SIZE, filer.size,
           'default size used == ' + Filer.DEFAULT_FS_SIZE);
    equal(self.TEMPORARY, filer.type, 'TEMPORARY storage used by default');
    equal(filer.isOpen, true, 'filesystem opened');

    var filer2 = new Filer(filer.fs);
    ok(filer2.fs === filer.fs,
       'filesystem initialized with existing DOMFileSystem object');
    start();
  }, onError);

  stop();
  filer.init(null, function(fs) {
    ok('null used as first arg to init()');
    start();
  }, onError);
});

test('set size', 2, function() {
  var filer = new Filer();

  stop();
  filer.init({persistent: false, size: Filer.DEFAULT_FS_SIZE * 5}, function(fs) {
    equal(Filer.DEFAULT_FS_SIZE * 5, filer.size,
           'size set to ' + Filer.DEFAULT_FS_SIZE * 5);
    start();
  }, onError);

  if (RUN_MANUAL_TEST) {
    var filer2 = new Filer();
    stop();
    filer2.init({persistent: true, size: Filer.DEFAULT_FS_SIZE * 2}, function(fs) {
      equal(Filer.DEFAULT_FS_SIZE * 2, filer2.size,
             'persistent size set to ' + Filer.DEFAULT_FS_SIZE * 2);
      start();
    }, onError);
  } else {
    ok(true); // So number of tests run matches number expected.
  }

});

test('storage type', 4, function() {
  var filer = this.filer;

  stop();
  filer.init({}, function(fs) {
    equal(Filer.DEFAULT_FS_SIZE, filer.size,
           'default size used == ' + Filer.DEFAULT_FS_SIZE);
    equal(self.TEMPORARY, filer.type,
           'TEMPORARY storage used by default');
    start();
  }, onError);

  stop();
  var filer2 = new Filer();
  filer2.init({persistent: false}, function(fs) {
    equal(self.TEMPORARY, filer2.type,
           'TEMPORARY storage used');
    start();
  }, onError);

  if (RUN_MANUAL_TEST) {
    var filer3 = new Filer();
    stop();
    filer3.init({persistent: true}, function(fs) {
      equal(self.PERSISTENT, filer3.type,
             'PERSISTENT storage used');
      start();
    }, onError);
  } else {
    ok(true); // So number of tests run matches number expected.
  }

});


module('helpers', {
  setup: function() {
    this.filer = new Filer();
    stop();
    this.filer.init({}, function(fs) {
      start();
    }, onError);
  },
  teardown: function() {

  }
});

test('pathToFilesystemURL()', 8, function() {
  var filer = this.filer;
  var fsURL = 'filesystem:' + document.location.origin + '/temporary/';
  var path = 'test/me';

  equal(filer.pathToFilesystemURL('/'), fsURL, 'root as arg');
  equal(filer.pathToFilesystemURL(fsURL), fsURL, 'filesystem URL as arg');
  equal(filer.pathToFilesystemURL(fsURL + path), fsURL + path, 'filesystem URL as arg2');
  equal(filer.pathToFilesystemURL('/' + path), fsURL + path, 'abs path as arg');
  equal(filer.pathToFilesystemURL('./'), fsURL + './', './ as arg');
  equal(filer.pathToFilesystemURL('./' + path), fsURL + './' + path, './ as arg');
  //equal(filer.pathToFilesystemURL('..'), fsURL + '../', '.. as arg');
  equal(filer.pathToFilesystemURL('../'), fsURL + '/../', '../ as arg');
  equal(filer.pathToFilesystemURL('../' + path), fsURL + '../' + path, '../ as arg');
  //equal(filer.pathToFilesystemURL(path), fsURL + path, 'relative path as arg');
});


module('methods', {
  setup: function() {
    this.filer = new Filer();
    this.FOLDER_NAME = 'filer_test_case_folder';
    this.FILE_NAME = 'filer_test_case.filer_test_case';
    stop();
    this.filer.init({}, function(fs) {
      start();
    }, onError);
  },
  teardown: function() {
    /*stop();
    this.filer.rm(this.FOLDER_NAME, function() {
      //start();
    }, onError);*/
  }
});

test('mkdir()', 7, function() {
  var filer = this.filer;
  var folderName = this.FOLDER_NAME + Date.now();

  ok(filer.isOpen, 'FS opened');

  stop();
  filer.mkdir(folderName, false, function(entry) {
    ok(entry.isDirectory, 'created folder is a DirectoryEntry');
    equal(entry.name, folderName, 'created folder is named "' + folderName + '"');
    start();
  }, onError);

  stop();
  filer.mkdir(folderName, null, function(entry) {
    ok(true);
    start();
  }, function(e) {
    ok(false, "Default exclusive parameter is not false");
    start();
  });

  stop();
  filer.mkdir(folderName, true, function(entry) {
    ok(false);
    start();
  }, function(e) {
    ok(true, "Attempted to create a folder that already exists");
    start();
  });

  stop();
  var folderName2 = folderName + '2';
  var fullPath = [folderName2, folderName2, folderName2 + '_end'].join('/');
  filer.mkdir(fullPath, false, function(entry) {
    equal(entry.name, folderName2 + '_end', 'last created folder is named "' + folderName2 + '_end"');
    equal(entry.fullPath, '/' + fullPath, "Subfolders created properly");
    filer.rm(folderName2, function() {
      start();
    }, onError);
  }, onError);

  /*// Try to create a folder without first calling init().
  var filer2 = new Filer();
  try {
    stop();
    filer2.mkdir(folderName, false, function(entry) {}, onError);
  } catch (e) {
    ok(true, 'Attempt to use this method before calling init()');
    start();
  }*/

  // Stall clean up for a bit so all tests have run.
  setTimeout(function() {
    stop();
    filer.rm(folderName, function() {
      start();
    }, onError);
  }, 500);

});

test('ls()', 7, function() {
  var filer = this.filer;

  ok(filer.isOpen, 'FS opened');
  ok(self.TEMPORARY == filer.type, 'TEMPORARY storage used');

  stop();
  filer.ls('.', function(entries) {
    ok(entries.slice, 'returned entries is an array') // Verify we got an Array.
    filer.ls('/', function(entries2) {
      equal(entries.length, entries2.length, 'Num root entries matches');
      start();
    }, onError);
  }, onError);

  stop();
  filer.ls('/myfolderthatdoesntexist' + Date.now(), function(entries) {
    ok(false);
    start();
  }, function(e) {
    ok(true, "Path doesn't exist");
    start();
  });

  stop();
  filer.ls(filer.fs.root, function(entries) {
    ok(true, 'DirEntry as argument');
    start();
  }, function(e) {
    ok(false);
    start();
  });

  stop();
  filer.ls(filer.fs.root.toURL(), function(entries) {
    ok(true, 'filesystem URL as argument');
    start();
  }, function(e) {
    ok(false);
    start();
  });

  /* //Try to create a folder without first calling init().
  var filer2 = new Filer();
  try {
    stop();
    filer2.ls('.', function(entries) {
      start();
    }, onError);
  } catch (e) {
    ok(true, 'Attempted to use this method before calling init()');
    start();
  }*/

});

test('cd()', 6, function() {
  var filer = this.filer;
  var folderName = this.FOLDER_NAME + Date.now();

  stop();
  filer.cd('.', function(dirEntry) {
    ok(dirEntry.isDirectory, 'cd folder is a DirectoryEntry');
    start();
  }, onError);

  stop();
  filer.mkdir(folderName, false, function(dirEntry) {
    filer.cd(folderName, function(dirEntry2) {
      ok(true, 'cd with path name as an argument.');
      start();
    }, onError);
  });

  stop();
  filer.mkdir(folderName, false, function(dirEntry) {
    var fsURL = filer.pathToFilesystemURL(dirEntry.fullPath);
    filer.cd(fsURL, function(dirEntry2) {
      ok(true, 'cd with path arg as a filesystem URL.');
      start();
    }, onError);
  });

  stop();
  filer.mkdir(folderName, false, function(dirEntry) {
    filer.cd('/' + folderName, function(dirEntry2) {
      ok(true, 'cd with abspath name as an argument.');
      start();
    }, onError);
  });

  stop();
  filer.mkdir(folderName, false, function(dirEntry) {
    filer.cd(dirEntry, function(dirEntry2) {
      ok(true, 'cd with DirectoryEntry as an argument.');
      filer.ls('.', function(entries) {
        equal(entries.length, 0, 'Empty directory');
        start();
      }, onError);
    }, onError);
  });

  // Stall clean up for a bit so all tests have run.
  setTimeout(function() {
    stop();
    filer.rm(folderName, function() {
      start();
    }, onError);
  }, 500);

  // TODO: test optional callback args to cd().
});

test('create()', 4, function() {
  var filer = this.filer;
  var fileName = this.FILE_NAME + Date.now();

  stop();
  filer.create(fileName, false, function(entry) {
    ok(entry.isFile, 'created folder is a FileEntry');
    equal(entry.name, fileName, 'created file named "' + fileName + '"');
    start();
  }, onError);

  stop();
  filer.create(fileName, true, function(entry) {
    ok(false);
    start();
  }, function(e) {
    ok(true, "Attempted to create a file that already exists");
    start();
  });

  stop();
  filer.create(fileName, null, function(entry) {
    ok(false);
    start();
  }, function(e) {
    ok(true, "Optional exclusive argument didn't default to true.");
    start();
  });

  // Stall clean up for a bit so all tests have run.
  setTimeout(function() {
    stop();
    filer.rm(fileName, function() {
      start();
    }, onError);
  }, 500);
});

test('rm()', 6, function() {
  var filer = this.filer;
  var fileName = this.FILE_NAME + Date.now();
  var folderName = this.FOLDER_NAME + Date.now();

  stop();
  filer.create(fileName, false, function(entry) {
    filer.rm(fileName, function() {
      ok(true, fileName + ' removed file by path.')
      start();
    }, onError);
  }, onError);

  stop();
  var fileName2 = fileName + '2';
  filer.create(fileName2, false, function(entry) {
    filer.rm(entry, function() {
      ok(true, fileName2 + ' removed file by entry.')
      start();
    }, onError);
  }, onError);

  stop();
  var fileName3 = fileName + '3';
  filer.create(fileName3, false, function(entry) {
    var fsURL = filer.pathToFilesystemURL(entry.fullPath);
    filer.rm(fsURL, function() {
      ok(true, fileName3 + ' removed file by filesystem URL.')
      start();
    }, onError);
  }, onError);

  stop();
  filer.mkdir(folderName, false, function(entry) {
    filer.rm(folderName, function() {
      ok(true, folderName + ' removed dir by path.')
      start();
    }, onError);
  }, onError);

  stop();
  var folderName2 = folderName + '2';
  filer.mkdir(folderName2, false, function(entry) {
    filer.rm(entry, function() {
      ok(true, folderName2 + ' removed dir by entry.')
      start();
    }, onError);
  }, onError);

  stop();
  var folderName3 = folderName + '3';
  filer.mkdir(folderName3, false, function(entry) {
    var fsURL = filer.pathToFilesystemURL(entry.fullPath);
    filer.rm(fsURL, function() {
      ok(true, folderName3 + ' removed dir by filesystem URL.');
      start();
    }, onError);
  }, onError);
});

test('cp()', 20, function() {
  var filer = this.filer;
  var fileName = this.FILE_NAME + '_cp()';
  var folderName = this.FOLDER_NAME + '_cp()';

  stop();
  filer.mkdir(folderName, false, function(dirEntry) {
    filer.cp(dirEntry, filer.fs.root, null, function(entry) {
      ok(false, 'Attempt to copy file in same folder without renaming it.');
      start();
    }, function(e) {
      ok(true, 'Error thrown for copying directory in same folder without renaming it.');
      filer.rm(folderName, function() {
        start();
      }, onError);
    })
  }, onError);

  stop();
  filer.create(fileName, false, function(fileEntry) {
    filer.cp(fileEntry, filer.fs.root, null, function(entry) {
      ok(false, 'Attempt to copy file in same folder without renaming it.');
      start();
    }, function(e) {
      ok(true, 'Error thrown for copying file in same folder without renaming it.');
      filer.rm(fileName, function() {
        start();
      }, onError);
    })
  }, onError);

  stop();
  var folderName2 = this.FOLDER_NAME + '_cp()2';
  var dupName2 = folderName2 + '_dup';
  filer.mkdir(folderName2, false, function(dirEntry) {
    filer.cp(dirEntry, filer.fs.root, dupName2, function(entry) {
      ok(entry.isDirectory, 'Copied entry is a DirectoryEntry');
      ok(true, 'Copied folder in same dir. Args were Entry objects.');
      equal(entry.name, dupName2, 'Moved entry name correct');
      filer.rm(folderName2, function() {
        filer.rm(dupName2, function() {
          start();
        }, onError);
      }, onError);
    }, onError)
  }, onError);

  stop();
  var fileName2 = fileName + '_cp()2';
  var dupfileName2 = fileName2 + '_dup2';
  filer.create(fileName2, false, function(fileEntry) {
    filer.cp(fileEntry, filer.fs.root, dupfileName2, function(entry) {
      ok(entry.isFile, 'Copied entry is a DirectoryEntry');
      ok(true, 'Copied file in same dir. Args were Entry objects.');
      equal(entry.name, dupfileName2, 'Moved entry name correct');
      filer.rm(fileName2, function() {
        filer.rm(dupfileName2, function() {
          start();
        }, onError);
      }, onError);
    }, onError)
  }, onError);

  stop();
  var folderName3 = this.FOLDER_NAME + '_cp()3';
  var srcName = folderName3 + '_src3';
  filer.mkdir(folderName3, false, function(destEntry) {
    filer.mkdir(srcName, false, function(srcEntry) {
      filer.cp(srcEntry, destEntry, null, function(entry) {
        ok(entry.isDirectory, 'Copied entry is a DirectoryEntry');
        equal(entry.name, srcName, 'Copied folder into another dir. src and dest were DirectoryEntry.');
        equal(entry.fullPath, '/' + folderName3 + '/' + srcName,
              'Moved folder into another dir. fullPath is correct');
        filer.rm(folderName3, function() {
          filer.rm(srcName, function() {
            start();
          }, onError);
        }, onError);
      }, onError);
    }, onError)
  }, onError);

  stop();
  var fileName3 = fileName + '_cp()3';
  var srcFileName3 = fileName3 + '_src3';
  filer.mkdir(fileName3, false, function(destEntry) {
    filer.create(srcFileName3, false, function(srcEntry) {
      filer.cp(srcEntry, destEntry, null, function(entry) {
        ok(entry.isFile, 'Copied entry is a FileEntry');
        equal(entry.name, srcFileName3, 'Copied file into another dir. Args were Entry objects.');
        equal(entry.fullPath, '/' + fileName3 + '/' + srcFileName3,
               'Moved file into another dir. fullPath is correct');
        filer.rm(fileName3, function() {
          filer.rm(srcFileName3, function() {
            start();
          }, onError);
        }, onError);
      }, onError);
    }, onError)
  }, onError);

  stop();
  var folderName4 = this.FOLDER_NAME + '_cp()4';
  var srcName4 = folderName4 + '_src4';
  filer.mkdir(folderName4, false, function(destEntry) {
    filer.mkdir(srcName4, false, function(srcEntry) {
      filer.cp(srcEntry.toURL(), destEntry.toURL(), null, function(entry) {
        ok(entry.isDirectory, 'Copied entry is a DirectoryEntry');
        equal(entry.name, srcName4, 'Copied folder into another dir. src and dest were filesystem URLs.');
        equal(entry.fullPath, '/' + folderName4 + '/' + srcName4,
               'Moved folder into another dir. fullPath is correct');
        filer.rm(folderName4, function() {
          filer.rm(srcName4, function() {
            start();
          }, onError);
        }, onError);
      }, onError);
    }, onError)
  }, onError);

  stop();
  var folderName5 = this.FOLDER_NAME + '_cp()5';
  var srcName5 = this.FILE_NAME + '_src5';
  filer.mkdir(folderName5, false, function(destEntry) {
    filer.create(srcName5, false, function(srcEntry) {
      filer.cp(srcEntry.fullPath, destEntry.fullPath, null, function(entry) {
        ok(entry.isFile, 'Copied entry is a FileEntry');
        equal(entry.name, srcName5, 'Copied file into another dir. src and dest were paths.');
        equal(entry.fullPath, '/' + folderName5 + '/' + srcName5,
               'Moved file into another dir. fullPath is correct');
        filer.rm(folderName5, function() {
          filer.rm(srcName5, function() {
            start();
          }, onError);
        }, onError);
      }, onError);
    }, onError)
  }, onError);

});

test('mv()', 10, function() {
  var filer = this.filer;
  var fileName = this.FILE_NAME + '_mv';
  var folderName = this.FOLDER_NAME + '_mv';

  stop();
  var renamedFileName = fileName + '_renamed';
  filer.create(fileName, false, function(entry) {
    filer.mv(entry, filer.fs.root, renamedFileName, function(entry2) {
      ok(entry2.isFile, 'Moved file is a FileEntry');
      equal(entry2.name, renamedFileName, 'FileEntry as arg');
      filer.rm(entry2, function() {
        start();
      }, onError);
    }, onError);
  }, onError);

  stop();
  var fileName2 = fileName + '2';
  var renamedFileName2 = renamedFileName + '2';
  filer.create(fileName2, false, function(entry) {
    filer.mv(entry.name, '.', renamedFileName2, function(entry2) {
      ok(entry2.isFile, 'Moved file is a FileEntry');
      equal(entry2.name, renamedFileName2, 'path as arg');
      filer.rm(entry2, function() {
        start();
      }, onError);
    }, onError);
  }, onError);

  stop();
  var renamedFolder = folderName + '_renamed';
  filer.mkdir(folderName, false, function(entry) {
    filer.mv(entry, filer.fs.root, renamedFolder, function(entry2) {
      ok(entry2.isDirectory, 'Moved folder is a DirectoryEntry');
      equal(entry2.name, renamedFolder, 'DirectoryEntry as arg');
      filer.rm(entry2, function() {
        start();
      }, onError);
    }, onError);
  }, onError);

  stop();
  var folderName2 = folderName + '2';
  var renamedFolder2 = renamedFolder + '2';
  filer.mkdir(folderName2, false, function(entry) {
    filer.mv(entry.fullPath, filer.fs.root.fullPath, renamedFolder2, function(entry2) {
      ok(entry2.isDirectory, 'Moved folder is a DirectoryEntry');
      equal(entry2.name, renamedFolder2, 'path as arg');
      filer.rm(entry2, function() {
        start();
      }, onError);
    }, onError);
  }, onError);

  stop();
  var fileName3 = fileName + '3';
  var renamedFileName3 = renamedFileName + '3';
  filer.create(fileName3, false, function(entry) {
    filer.mv(entry.toURL(), filer.fs.root.toURL(), renamedFileName3, function(entry2) {
      ok(entry2.isFile, 'Moved file is a FileEntry');
      equal(entry2.name, renamedFileName3, 'filesystem URL as arg');
      filer.rm(entry2, function() {
        start();
      }, onError);
    }, onError);
  }, onError);

});


test('open()', 3, function() {
  var filer = this.filer;
  var fileName = this.FILE_NAME + '_open';

  stop();
  filer.create(fileName, false, function(entry) {
    filer.open(entry, function(file) {
      ok(file.__proto__ == File.prototype, 'FileEntry as arg. Result is a File');
      start();
    }, onError);
  }, onError);

  stop();
  filer.create(fileName, false, function(entry) {
    filer.open(entry.fullPath, function(file) {
      ok(file.__proto__ == File.prototype, 'path as arg. Result is a File');
      start();
    }, onError);
  }, onError);

  stop();
  filer.create(fileName, false, function(entry) {
    filer.open(entry.toURL(), function(file) {
      ok(file.__proto__ == File.prototype, 'filesystem: URL as arg. Result is a File');
      start();
    }, onError);
  }, onError);

   // Stall clean up for a bit so all tests have run.
   setTimeout(function() {
     stop();
     filer.rm(fileName, function() {
       start();
     }, onError);
   }, 500);

});

test('write()', 11, function() {
  var filer = this.filer;
  var fileName = this.FILE_NAME + '_write';
  var data = '1234567890';

  stop();
  filer.create(fileName, false, function(entry) {
    var blob = new Blob([data]);
    filer.write(entry, {data: blob}, function(fileEntry, fileWriter) {
      ok(true, 'data as Blob accepted')
      ok(fileEntry.isFile, 'Written file is a FileEntry');
      filer.open(fileEntry, function(file) {
        equal(file.size, data.length, 'size of data written is correct');
        filer.rm(fileEntry, function() {
          start();
        }, onError);
      }, onError);
    }, onError);
  }, onError);

  stop();
  var fileName2 = fileName + '2';
  filer.create(fileName2, false, function(entry) {
    filer.write(entry, {data: data}, function(fileEntry, fileWriter) {
      ok(true, 'data as string accepted')
      ok(fileEntry.isFile, 'Written file is a FileEntry');
      filer.open(fileEntry, function(file) {
        equal(file.size, data.length, 'size of data written is correct');
        filer.rm(fileEntry, function() {
          start();
        }, onError);
      }, onError);
    }, onError);
  }, onError);

  stop();
  var fileName3 = fileName + '3';
  var uint8 = new Uint8Array(data.split(''));
  filer.create(fileName3, false, function(entry) {
    filer.write(entry, {data: uint8.buffer}, function(fileEntry, fileWriter) {
      ok(true, 'data as ArrayBuffer accepted')
      ok(fileEntry.isFile, 'Written file is a FileEntry');
      filer.open(fileEntry, function(file) {
        equal(file.size, uint8.length, 'size of data written is correct');
        filer.rm(fileEntry, function() {
          start();
        }, onError);
      }, onError);
    }, onError);
  }, onError);

  stop();
  var fileName4 = fileName + '4';
  filer.create(fileName4, false, function(entry) {
    filer.write(entry, {data: data}, function(fileEntry, fileWriter) {
      filer.write(entry, {data: data, append: true}, function(fileEntry2, fileWriter) {
        filer.open(fileEntry2, function(file) {
          equal(file.size, data.length * 2, 'append size of data written is correct');
          filer.rm(fileEntry2, function() {
            start();
          }, onError);
        }, onError);
      }, onError);
    }, onError);
  }, onError);

  stop();
  var fileName5 = fileName + '5';
  filer.create(fileName5, false, function(entry) {
    filer.write(entry, {data: data + data}, function(fileEntry, fileWriter) {
      filer.write(entry, {data: data}, function(fileEntry2, fileWriter) {
        filer.open(fileEntry2, function(file) {
          equal(file.size, data.length, 'overwrite existing file with shorter content');
          filer.rm(fileEntry2, function() {
            start();
          }, onError);
        }, onError);
      }, onError);
    }, onError);
  }, onError);

});


module('Utils', {
  setup: function() {

  },
  teardown: function() {

  }
});

test('getFileExtension()', 5, function() {
  equal(Util.getFileExtension('test'), '', 'no ex');
  equal(Util.getFileExtension('test.txt'), '.txt', 'single char');
  equal(Util.getFileExtension('test.cc'), '.cc', 'double char');
  equal(Util.getFileExtension('test.tar.gz'), '.gz', 'double extension');
  equal(Util.getFileExtension('something/test.mp3'), '.mp3', 'path');
});

test('strToDataURL()', 3, function() {
  var content = 'body { background: green; }';
  var mimetype = 'text/css';
  var expected = 'data:text/css,body { background: green; }';
  var expectedBin = 'data:text/css;base64,Ym9keSB7IGJhY2tncm91bmQ6IGdyZWVuOyB9';
  equal(Util.strToDataURL(content, mimetype), expectedBin, 'plaintext, no arg specified');
  equal(Util.strToDataURL(content, mimetype, false), expected, 'plaintext, opt arg specified');
  equal(Util.strToDataURL(content, mimetype, true), expectedBin, 'binary, opt arg');
});

test('fileToArrayBuffer()', 2, function() {
  var data = '0123456780';
  var blob = new Blob([data]);
  stop();
  Util.fileToArrayBuffer(blob, function(arrayBuffer) {
    ok(arrayBuffer.__proto__ == ArrayBuffer.prototype, 'Result is an ArrayBuffer');
    equal(arrayBuffer.byteLength, data.length, 'Size matches');
    start();
  }, onError);
});

test('dataURLToBlob()', 5, function() {
  var dataURL = 'data:text/html;base64,VGhpcyBpcyBhIHRlc3QK';
  var blob = Util.dataURLToBlob(dataURL);
  ok(blob.__proto__ == Blob.prototype, 'Result is a Blob');
  equal(blob.size, window.atob('VGhpcyBpcyBhIHRlc3QK').length, 'blob.size');
  equal(blob.type, 'text/html', 'blob.type');

  var dataURL2 = 'data:text/html,<p>Hi there</p>';
  var blob = Util.dataURLToBlob(dataURL2);
  equal(blob.size, '<p>Hi there</p>'.length, 'blob.size');
  equal(blob.type, 'text/html', 'blob.type');
});

test('arrayBufferToBlob()', 2, function() {
  var len = 10;
  var ab = new ArrayBuffer(len);
  var blob = Util.arrayBufferToBlob(ab);
  ok(blob.__proto__ == Blob.prototype, 'Result is a Blob');
  equal(ab.byteLength, len, 'Size matches');
});

test('arrayBufferToBinaryString()', 2, function() {
  var len = 10;
  var ab = new ArrayBuffer(len);
  stop();
  Util.arrayBufferToBinaryString(ab, function(binStr) {
    ok(binStr.__proto__ == String.prototype, 'Result is a String');
    equal(binStr.length, len, 'Size matches');
    start();
  }, onError);
});


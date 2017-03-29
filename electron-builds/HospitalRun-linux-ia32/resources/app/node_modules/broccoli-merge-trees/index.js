var fs = require('fs')
var rimraf = require('rimraf');
var Plugin = require('broccoli-plugin')
var symlinkOrCopySync = require('symlink-or-copy').sync
var loggerGen = require('heimdalljs-logger');
var FSTree = require('fs-tree-diff');
var Entry = require('./entry');

var heimdall = require('heimdalljs');
var canSymlink = require('can-symlink')();
var defaultIsEqual = FSTree.defaultIsEqual;

function ApplyPatchesSchema() {
  this.mkdir = 0;
  this.rmdir = 0;
  this.unlink = 0;
  this.change = 0;
  this.create = 0;
  this.other = 0;
  this.processed = 0;
  this.linked = 0;
}

function unlinkOrRmrfSync(path) {
  if (canSymlink) {
    fs.unlinkSync(path);
  } else {
    rimraf.sync(path);
  }
}

module.exports = BroccoliMergeTrees
BroccoliMergeTrees.prototype = Object.create(Plugin.prototype)
BroccoliMergeTrees.prototype.constructor = BroccoliMergeTrees
function BroccoliMergeTrees(inputNodes, options) {
  if (!(this instanceof BroccoliMergeTrees)) return new BroccoliMergeTrees(inputNodes, options)
  options = options || {}
  var name = 'broccoli-merge-trees:' + (options.annotation || '')
  if (!Array.isArray(inputNodes)) {
    throw new TypeError(name + ': Expected array, got: [' + inputNodes +']')
  }
  Plugin.call(this, inputNodes, {
    persistentOutput: true,
    needsCache: false,
    annotation: options.annotation
  })

  this._logger = loggerGen(name);

  this.options = options
  this._buildCount = 0;
  this._currentTree = FSTree.fromPaths([]);
}

BroccoliMergeTrees.prototype.debug = function(message, args) {
  this._logger.info(message, args);
}

function isLinkStateEqual(entryA, entryB) {
  // We don't symlink files, only directories
  if (!(entryA.isDirectory() && entryB.isDirectory())) {
    return true;
  }

  // We only symlink on systems that support it
  if (!canSymlink) {
    return true;
  }

  // This can change between rebuilds if a dir goes from existing in multiple
  // input sources to exactly one input source, or vice versa
  return entryA.linkDir === entryB.linkDir;
}

function isEqual(entryA, entryB) {
  return defaultIsEqual(entryA, entryB) && isLinkStateEqual(entryA, entryB);
}

BroccoliMergeTrees.prototype.build = function() {
  this._logger.debug('deriving patches');
  var instrumentation = heimdall.start('derivePatches');

  var fileInfos = this._mergeRelativePath('');
  var entries = fileInfos.map(function(fileInfo) {
    return fileInfo.entry;
  });

  var newTree = FSTree.fromEntries(entries);
  var patches = this._currentTree.calculatePatch(newTree, isEqual);

  instrumentation.stats.patches = patches.length;
  instrumentation.stats.entries = entries.length;

  instrumentation.stop();

  this._currentTree = newTree;

  instrumentation = heimdall.start('applyPatches', ApplyPatchesSchema);

  try {
    this._logger.debug('applying patches');
    this._applyPatch(patches, instrumentation.stats);
  } catch(e) {
    this._logger.warn('patch application failed, starting from scratch');
    // Whatever the failure, start again and do a complete build next time
    this._currentTree = FSTree.fromPaths([]);
    rimraf.sync(this.outputPath);
    throw e;
  }

  instrumentation.stop();
}

BroccoliMergeTrees.prototype._applyPatch = function (patch, instrumentation) {

  patch.forEach(function(patch) {
    var operation = patch[0];
    var relativePath = patch[1];
    var entry = patch[2];

    var outputFilePath = this.outputPath + '/' + relativePath;
    var inputFilePath = entry && entry.basePath + '/' + relativePath;

    switch(operation) {
      case 'mkdir':     {
        instrumentation.mkdir++;
        return this._applyMkdir(entry, inputFilePath, outputFilePath);
      }
      case 'rmdir':   {
        instrumentation.rmdir++;
        return this._applyRmdir(entry, inputFilePath, outputFilePath);
      }
      case 'unlink':  {
        instrumentation.unlink++;
        return fs.unlinkSync(outputFilePath);
      }
      case 'create':    {
        instrumentation.create++;
        return symlinkOrCopySync(inputFilePath, outputFilePath);
      }
      case 'change':    {
        instrumentation.change++;
        return this._applyChange(entry, inputFilePath, outputFilePath);
      }
    }
  }, this);
};

BroccoliMergeTrees.prototype._applyMkdir = function (entry, inputFilePath, outputFilePath) {
  if (entry.linkDir) {
    return symlinkOrCopySync(inputFilePath, outputFilePath);
  } else {
    return fs.mkdirSync(outputFilePath);
  }
}

BroccoliMergeTrees.prototype._applyRmdir = function (entry, inputFilePath, outputFilePath) {
  if (entry.linkDir) {
    return unlinkOrRmrfSync(outputFilePath);
  } else {
    return fs.rmdirSync(outputFilePath);
  }
}

BroccoliMergeTrees.prototype._applyChange = function (entry, inputFilePath, outputFilePath) {
  if (entry.isDirectory()) {
    if (entry.linkDir) {
      // directory copied -> link
      fs.rmdirSync(outputFilePath);
      return symlinkOrCopySync(inputFilePath, outputFilePath);
    } else {
      // directory link -> copied
      //
      // we don't check for `canSymlink` here because that is handled in
      // `isLinkStateEqual`.  If symlinking is not supported we will not get
      // directory change operations
      fs.unlinkSync(outputFilePath);
      fs.mkdirSync(outputFilePath);
      return
    }
  } else {
    // file changed
    fs.unlinkSync(outputFilePath);
    return symlinkOrCopySync(inputFilePath, outputFilePath);
  }
}

BroccoliMergeTrees.prototype._mergeRelativePath = function (baseDir, possibleIndices) {
  var inputPaths = this.inputPaths;
  var overwrite = this.options.overwrite;
  var result = [];
  var isBaseCase = (possibleIndices === undefined);

  // baseDir has a trailing path.sep if non-empty
  var i, j, fileName, fullPath, subEntries;

  // Array of readdir arrays
  var names = inputPaths.map(function (inputPath, i) {
    if (possibleIndices == null || possibleIndices.indexOf(i) !== -1) {
      return fs.readdirSync(inputPath + '/' + baseDir).sort()
    } else {
      return []
    }
  })

  // Guard against conflicting capitalizations
  var lowerCaseNames = {}
  for (i = 0; i < this.inputPaths.length; i++) {
    for (j = 0; j < names[i].length; j++) {
      fileName = names[i][j]
      var lowerCaseName = fileName.toLowerCase()
      // Note: We are using .toLowerCase to approximate the case
      // insensitivity behavior of HFS+ and NTFS. While .toLowerCase is at
      // least Unicode aware, there are probably better-suited functions.
      if (lowerCaseNames[lowerCaseName] === undefined) {
        lowerCaseNames[lowerCaseName] = {
          index: i,
          originalName: fileName
        }
      } else {
        var originalIndex = lowerCaseNames[lowerCaseName].index
        var originalName = lowerCaseNames[lowerCaseName].originalName
        if (originalName !== fileName) {
          throw new Error('Merge error: conflicting capitalizations:\n'
                          + baseDir + originalName + ' in ' + this.inputPaths[originalIndex] + '\n'
                          + baseDir + fileName + ' in ' + this.inputPaths[i] + '\n'
                          + 'Remove one of the files and re-add it with matching capitalization.\n'
                          + 'We are strict about this to avoid divergent behavior '
                          + 'between case-insensitive Mac/Windows and case-sensitive Linux.'
                         )
        }
      }
    }
  }
  // From here on out, no files and directories exist with conflicting
  // capitalizations, which means we can use `===` without .toLowerCase
  // normalization.

  // Accumulate fileInfo hashes of { isDirectory, indices }.
  // Also guard against conflicting file types and overwriting.
  var fileInfo = {}
  var inputPath;
  var infoHash;

  for (i = 0; i < inputPaths.length; i++) {
    inputPath = inputPaths[i];
    for (j = 0; j < names[i].length; j++) {
      fileName = names[i][j]

      // TODO: walk backwards to skip stating files we will just drop anyways
      var entry = buildEntry(baseDir + fileName, inputPath);
      var isDirectory = entry.isDirectory();

      if (fileInfo[fileName] == null) {
        fileInfo[fileName] = {
          entry: entry,
          isDirectory: isDirectory,
          indices: [i] // indices into inputPaths in which this file exists
        };
      } else {
        fileInfo[fileName].entry = entry;
        fileInfo[fileName].indices.push(i)

        // Guard against conflicting file types
        var originallyDirectory = fileInfo[fileName].isDirectory
        if (originallyDirectory !== isDirectory) {
          throw new Error('Merge error: conflicting file types: ' + baseDir + fileName
                          + ' is a ' + (originallyDirectory ? 'directory' : 'file')
                          + ' in ' + this.inputPaths[fileInfo[fileName].indices[0]]
                          + ' but a ' + (isDirectory ? 'directory' : 'file')
                          + ' in ' + this.inputPaths[i] + '\n'
                          + 'Remove or rename either of those.'
                         )
        }

        // Guard against overwriting when disabled
        if (!isDirectory && !overwrite) {
          throw new Error('Merge error: '
                          + 'file ' + baseDir + fileName + ' exists in '
                          + this.inputPaths[fileInfo[fileName].indices[0]] + ' and ' + this.inputPaths[i] + '\n'
                          + 'Pass option { overwrite: true } to mergeTrees in order '
                          + 'to have the latter file win.'
                         )
        }
      }
    }
  }

  // Done guarding against all error conditions. Actually merge now.
  for (i = 0; i < this.inputPaths.length; i++) {
    for (j = 0; j < names[i].length; j++) {
      fileName = names[i][j]
      fullPath = this.inputPaths[i] + '/' + baseDir + fileName
      infoHash = fileInfo[fileName]

      if (infoHash.isDirectory) {
        if (infoHash.indices.length === 1 && canSymlink) {
          // This directory appears in only one tree: we can symlink it without
          // reading the full tree
          infoHash.entry.linkDir = true;
          result.push(infoHash);
        } else {
          if (infoHash.indices[0] === i) { // avoid duplicate recursion
            subEntries = this._mergeRelativePath(baseDir + fileName + '/', infoHash.indices);

            // FSTreeDiff requires intermediate directory entries, so push
            // `infoHash` (this dir) as well as sub entries.
            result.push(infoHash);
            result.push.apply(result, subEntries);
          }
        }
      } else { // isFile
        if (infoHash.indices[infoHash.indices.length-1] === i) {
          result.push(infoHash);
        } else {
          // This file exists in a later inputPath. Do nothing here to have the
          // later file win out and thus "overwrite" the earlier file.
        }
      }
    }
  }

  if (isBaseCase) {
    // FSTreeDiff requires entries to be sorted by `relativePath`.
    return result.sort(function (a, b) {
      var pathA = a.entry.relativePath;
      var pathB = b.entry.relativePath;

      if (pathA === pathB) {
        return 0;
      } else if (pathA < pathB) {
        return -1;
      } else {
        return 1;
      }
    });
  } else {
    return result;
  }
};

function buildEntry(relativePath, basePath) {
  var stat = fs.statSync(basePath + '/' + relativePath);
  return new Entry(relativePath, basePath, stat.mode, stat.size, stat.mtime);
}

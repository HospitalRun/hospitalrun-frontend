/**
 * Download all previous Ember Inspectors that
 * were uploaded to S3. Each version supports
 * a differnt Ember version range.
 *
 * These versions will end up in the folder
 * `dist_prev` to be added to the published
 * package.
 */

var http = require('http');
var fs = require('fs');
var packageJson = require('../package.json');
var mkdirp = require('mkdirp');
var yauzl = require("yauzl");
var path = require("path");
var rimraf = require('rimraf');

var env = process.env.EMBER_ENV || 'development';
var S3_BUCKET_URL = 'http://s3-eu-west-1.amazonaws.com/ember-inspector-panes/';

rimraf('dist_prev', function(err) {
  if (err) {
    throw err;
  }
  packageJson.previousEmberVersionsSupported.forEach(function(version) {
    var dasherizedVersion = version.replace(/\./g, '-');
    var paneFolder = 'panes-' + dasherizedVersion;
    ['chrome', 'firefox', 'bookmarklet'].forEach(function(dist) {
      downloadPane(paneFolder, dist);
    });
  });
});

function downloadPane(paneFolder, dist) {
  var dir = 'dist_prev/' + env + '/' + dist;
  var zipFile = dir + '/' + paneFolder + '.zip';
  mkdirp(dir, function() {
    var request = http.get(S3_BUCKET_URL + env + '/' + paneFolder + '/' + dist + '.zip', function(response) {
      var file = fs.createWriteStream(zipFile);
      file.on('finish', function() {
        dir += '/' + paneFolder;
        unzip(zipFile, dir);
      });
      response.pipe(file);
    });
  });
}

function unzip(zipFile, dir) {
  yauzl.open(zipFile, { lazyEntries: true }, function(err, zipfile) {
    if (err) throw err;
    zipfile.once("end", function() {
      zipfile.close();
      rimraf(zipFile, function(err) {
        if (err) {
          throw err;
        }
      });
    });
    zipfile.readEntry();
    zipfile.on("entry", function(entry) {
      if (/\/$/.test(entry.fileName)) {
        // directory file names end with '/'
        mkdirp(dir + '/' + entry.fileName, function(err) {
          if (err) throw err;
          zipfile.readEntry();
        });
      } else {
        // file entry
        zipfile.openReadStream(entry, function(err, readStream) {
          if (err) throw err;
          // ensure parent directory exists
          mkdirp(path.dirname(dir + '/' + entry.fileName), function(err) {
            if (err) throw err;
            readStream.pipe(fs.createWriteStream(dir + '/' + entry.fileName));
            readStream.on("end", function() {
              zipfile.readEntry();
            });
          });
        });
      }
    });
  });
}

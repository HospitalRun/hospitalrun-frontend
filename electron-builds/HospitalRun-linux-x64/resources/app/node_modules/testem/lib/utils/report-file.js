'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var PassThrough = require('stream').PassThrough;
var Bluebird = require('bluebird');

function ReportFile(reportFile) {
  this.file = reportFile;

  this.outputStream = new PassThrough();

  mkdirp.sync(path.dirname(path.resolve(reportFile)));

  this.outputStream = fs.createWriteStream(reportFile, { flags: 'w+' });

  var alreadyEnded = false;
  function finish(data) {
    if (!alreadyEnded) {
      alreadyEnded = true;
      this.outputStream.end(data);
    }
  }

  this.outputStream.on('end', finish);
  this.outputStream.on('error', finish);

  this.closePromise = new Bluebird.Promise(function(resolve, reject) {
    this.outputStream.on('finish', resolve);
    this.outputStream.on('error', reject);
  }.bind(this));
}

ReportFile.prototype.close = function() {
  this.outputStream.end();

  return this.closePromise;
};

module.exports = ReportFile;

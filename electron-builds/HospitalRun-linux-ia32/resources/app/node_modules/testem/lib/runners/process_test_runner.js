'use strict';
var Bluebird = require('bluebird');

var toResult = require('./to-result');

function ProcessTestRunner(launcher, reporter) {
  this.launcher = launcher;
  this.reporter = reporter;
  this.launcherId = this.launcher.id;
  this.finished = false;
}
ProcessTestRunner.prototype = {
  start: function(onFinish) {
    this.onStart();
    this.finished = false;

    return new Bluebird.Promise(function(resolve, reject) {
      this.onFinish = resolve;
      this.launcher.start().then(function(testProcess) {
        this.process = testProcess;
        this.process.once('processExit', this.onProcessExit.bind(this));
        this.process.once('processError', this.onProcessError.bind(this));
      }.bind(this)).catch(reject);
    }.bind(this)).asCallback(onFinish);
  },

  exit: function() {
    if (!this.process) {
      return Bluebird.resolve();
    }

    return this.process.kill();
  },

  onProcessExit: function(code, stdout, stderr) {
    this.finish(null, code, stdout, stderr);
  },

  name: function() {
    return this.launcher.name;
  },

  onProcessError: function(err, stdout, stderr) {
    this.lastErr = err;
    this.lastStderr = stderr;
    this.finish(err, 0, stdout, stderr);
  },

  onStart: function() {
    this.reporter.onStart(this.launcher.name, {
      launcherId: this.launcherId
    });
  },

  onEnd: function() {
    this.reporter.onEnd(this.launcher.name, {
      launcherId: this.launcherId
    });
  },

  finish: function(err, code) {
    if (this.finished) {
      return;
    }
    this.finished = true;
    var runnerProcess = this.process;
    this.process = null;

    var result = toResult(this.launcherId, err, code, runnerProcess);
    this.reporter.report(this.launcher.name, result);
    this.onEnd();

    this.onFinish();
  }
};

module.exports = ProcessTestRunner;

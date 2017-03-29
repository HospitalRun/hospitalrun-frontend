'use strict';

var TapConsumer = require('../tap_consumer');
var log = require('npmlog');
var Bluebird = require('bluebird');

var toResult = require('./to-result');

function TapProcessTestRunner(launcher, reporter) {
  this.launcher = launcher;
  this.reporter = reporter;
  this.launcherId = this.launcher.id;
  this.finished = false;
  log.info(this.launcher.name);
}
TapProcessTestRunner.prototype = {
  start: function(onFinish) {
    this.onStart();
    this.finished = false;

    this.tapConsumer = new TapConsumer();
    this.tapConsumer.on('test-result', this.onTestResult.bind(this));
    this.tapConsumer.on('all-test-results', this.onAllTestResults.bind(this));

    return new Bluebird.Promise(function(resolve, reject) {
      this.onFinish = resolve;
      this.launcher.start().then(function(tapProcess) {
        this.process = tapProcess;
        this.process.once('processError', this.onProcessError.bind(this));
        this.process.process.stdout.pipe(this.tapConsumer.stream);
      }.bind(this)).catch(reject);
    }.bind(this)).asCallback(onFinish);
  },
  exit: function() {
    if (!this.process) {
      return Bluebird.resolve();
    }

    return this.process.kill();
  },
  onTestResult: function(test) {
    test.launcherId = this.launcherId;
    this.reporter.report(this.launcher.name, test);
  },
  onAllTestResults: function() {
    setTimeout(function() { // Workaround Node 0.10 finishing stdout before receiving process error
      this.wrapUp();
    }.bind(this), 100);
  },
  wrapUp: function() {
    if (this.finished) {
      return;
    }
    this.finished = true;
    this.process = null;
    this.onEnd();
    this.onFinish();
  },
  name: function() {
    return this.launcher.name;
  },
  onProcessError: function(err) {
    var result = toResult(this.launcherId, err, 0, this.process);
    this.reporter.report(this.launcher.name, result);
    this.wrapUp();
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
  }
};

module.exports = TapProcessTestRunner;

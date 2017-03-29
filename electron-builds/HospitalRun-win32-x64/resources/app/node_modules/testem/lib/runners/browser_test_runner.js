'use strict';

var log = require('npmlog');
var BrowserTapConsumer = require('../browser_tap_consumer');
var util = require('util');
var Bluebird = require('bluebird');

var toResult = require('./to-result');

function BrowserTestRunner(launcher, reporter, index, singleRun, config) {
  this.launcher = launcher;
  this.reporter = reporter;
  this.running = false;
  this.config = config;
  this.index = index;
  this.launcherId = this.launcher.id;
  this.singleRun = singleRun;
  this.logs = [];

  this.pendingTimer = undefined;
  this.onProcessExitTimer = undefined;
}

BrowserTestRunner.prototype = {
  start: function(onFinish) {
    if (this.pending) {
      return;
    }

    this.finished = false;
    this.pending = true;

    return new Bluebird.Promise(function(resolve) {
      this.onFinish = resolve;

      if (this.socket) {
        this.socket.emit('start-tests');
      } else {
        this.launcher.start().then(function(browserProcess) {
          this.process = browserProcess;
          this.process.on('processExit', this.onProcessExit.bind(this));
          this.process.on('processError', this.onProcessError.bind(this));
          this.setupStartTimer();
        }.bind(this)).catch(function(err) {
          this.onProcessError(err);
        }.bind(this));
      }
    }.bind(this)).asCallback(onFinish);
  },

  stop: function(cb) {
    if (this.socket) {
      this.socket.emit('stop-run');
    }
    return Bluebird.resolve().asCallback(cb);
  },

  exit: function() {
    if (!this.process) {
      return Bluebird.resolve();
    }

    log.info('Closing browser ' + this.name() + '.');
    return this.process.kill().then(function() {
      this.process = null;
    }.bind(this));
  },

  setupStartTimer: function() {
    var self = this;
    this.startTimer = setTimeout(function() {
      if (self.finished || !self.pending) {
        return;
      }

      var err = new Error(
        'Browser failed to connect within ' + self.launcher.config.get('browser_start_timeout') + 's. ' +
        'testem.js not loaded?'
      );
      self.reportResults(err, 0);
    }, this.launcher.config.get('browser_start_timeout') * 1000);
  },

  tryAttach: function(browser, id, socket) {
    if (id !== this.launcherId) {
      return;
    }

    log.info('tryAttach', browser, id);

    if (this.startTimer) {
      clearTimeout(this.startTimer);
    }
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
    }

    this.pending = false;
    this.socket = socket;
    this.browser = browser;
    this.logs = [];

    this.onStart.call(this);

    socket.on('test-result', this.onTestResult.bind(this));
    socket.on('test-metadata', this.onTestMetadata.bind(this));
    socket.on('top-level-error', this.onGlobalError.bind(this));

    var handleMessage = function(type) {
      return function(/* ...args */) {
        var args = Array.prototype.slice.call(arguments);
        var message = args.map(function(arg) {
          return util.inspect(arg);
        }).join(' ');

        this.logs.push({
          type: type,
          text: message + '\n'
        });
      }.bind(this);
    }.bind(this);

    var methods = ['log', 'warn', 'error', 'info'];

    for (var method in methods) {
      socket.on('console-' + methods[method], handleMessage(methods[method]));
    }

    socket.on('disconnect', this.onDisconnect.bind(this));

    socket.on('all-test-results', this.onAllTestResults.bind(this));
    socket.on('after-tests-complete', this.onAfterTests.bind(this));

    var tap = new BrowserTapConsumer(socket);
    tap.on('test-result', this.onTestResult.bind(this));
    tap.on('all-test-results', this.onAllTestResults.bind(this));
    tap.on('all-test-results', function() {
      this.socket.emit('tap-all-test-results');
    }.bind(this));
  },

  name: function() {
    return this.launcher.name;
  },

  reportResults: function(err, code, browserProcess) {
    browserProcess = browserProcess || this.process;

    var result = toResult(this.launcherId, err, code, browserProcess, this.config);
    this.reporter.report(this.launcher.name, result);
    this.finish();
  },

  onTestResult: function(result) {
    var errItems = (result.items || [])
      .filter(function(item) {
        return !item.passed;
      });

    this.reporter.report(this.browser, {
      passed: !result.failed && !result.skipped,
      name: result.name,
      skipped: result.skipped,
      runDuration: result.runDuration,
      logs: this.logs,
      error: errItems[0],
      launcherId: this.launcherId,
      failed: result.failed,
      pending: result.pending,
      items: result.items
    });
    this.logs = [];
  },

  onTestMetadata: function(tag, metadata) {
    this.reporter.reportMetadata(tag, metadata);
  },

  onStart: function() {
    this.reporter.onStart(this.browser, {
      launcherId: this.launcherId
    });
  },
  onEnd: function() {
    this.reporter.onEnd(this.browser, {
      launcherId: this.launcherId
    });
  },
  onAllTestResults: function() {
    log.info('Browser ' + this.name() + ' finished all tests.', this.singleRun);
    this.onEnd();
  },
  onAfterTests: function() {
    this.finish();
  },
  onGlobalError: function(msg, url, line) {
    var message = msg + ' at ' + url + ', line ' + line + '\n';
    this.logs.push({
      type: 'error',
      text: message
    });

    var config = this.launcher.config;
    if (config.get('bail_on_uncaught_error')) {
      this.onTestResult.call(this, {
        failed: 1,
        name: 'Global error: ' + msg + ' at ' + url + ', line ' + line + '\n',
        logs: [],
        error: {}
      });
      this.onAllTestResults();
      this.onEnd.call(this);
    }
  },
  onDisconnect: function() {
    this.socket = null;
    if (this.finished) { return; }

    var self = this;

    this.pending = true;
    this.pendingTimer = setTimeout(function() {
      if (self.finished) {
        return;
      }

      self.reportResults(new Error('Browser disconnected'), 0);
    }, this.launcher.config.get('browser_disconnect_timeout') * 1000);
  },
  onProcessExit: function(code) {
    var browserProcess = this.process;
    this.process = null;
    if (this.finished) { return; }

    var self = this;
    this.onProcessExitTimer = setTimeout(function() {
      if (self.finished) {
        return;
      }

      self.reportResults(new Error('Browser exited unexpectedly'), code, browserProcess);
    }, 1000);
  },
  onProcessError: function(err) {
    var browserProcess = this.process;
    this.process = null;

    if (this.finished) { return; }

    this.reportResults(err, 0, browserProcess);
  },
  finish: function() {
    if (this.finished) { return; }

    clearTimeout(this.pendingTimer);
    clearTimeout(this.onProcessExitTimer);

    this.finished = true;

    if (!this.singleRun) {
      if (this.onFinish) {
        this.onFinish();
      }
      return;
    }
    return this.exit().then(function() {
      // TODO: Not sure how this can happen, but sometimes onFinish is not defined
      if (this.onFinish) {
        this.onFinish();
      }
    }.bind(this));
  }
};

module.exports = BrowserTestRunner;

'use strict';

var EventEmitter = require('events').EventEmitter;
var Bluebird = require('bluebird');
var Path = require('path');
var log = require('npmlog');
var StyledString = require('styled_string');
var find = require('lodash.find');

var Server = require('./server');
var BrowserTestRunner = require('./runners/browser_test_runner');
var ProcessTestRunner = require('./runners/process_test_runner');
var TapProcessTestRunner = require('./runners/tap_process_test_runner');
var HookRunner = require('./runners/hook_runner');
var cleanExit = require('./clean_exit');
var FileWatcher = require('./file_watcher');
var Launcher = require('./launcher');

var RunTimeout = require('./utils/run-timeout');
var Reporter = require('./utils/reporter');
var SignalListeners = require('./utils/signal-listeners');

function App(config, finalizer) {
  this.exited = false;
  this.paused = false;
  this.config = config;
  this.stdoutStream = config.get('stdout_stream') || process.stdout;
  this.server = new Server(this.config);
  this.results = [];
  this.runnerIndex = 0;
  this.runners = [];
  this.timeoutID = undefined;

  this.reportFileName = this.config.get('report_file');

  this.cleanExit = function(err) {
    var alreadyExit = false;
    if (!alreadyExit) {
      alreadyExit = true;

      var exitCode = err ? 1 : 0;

      if (err && err.hideFromReporter) {
        err = null;
      }

      (finalizer || cleanExit)(exitCode, err);
    }
  };
}

App.prototype = {
  __proto__: EventEmitter.prototype,
  start: function(cb) {
    log.info('Starting ' + this.config.appMode);
    var self = this;

    return Bluebird.using(SignalListeners.with(), function(signalListeners) {
      signalListeners.on('signal', function(err) {
        self.exit(err);
      });

      return Bluebird.using(Reporter.with(self, self.stdoutStream, self.reportFileName), function(reporter) {
        self.reporter = reporter;

        return Bluebird.using(self.fileWatch(), function() {
          return Bluebird.using(self.getServer(), function() {
            return Bluebird.using(self.getRunners(), function() {
              return Bluebird.using(self.runHook('on_start'), function() {
                var w = self.waitForTests();

                if (cb) {
                  cb();
                }

                return w;
              }).then(function() {
                log.info('Stopping ' + self.config.appMode);

                self.emit('tests-finish');

                return Bluebird.using(self.runHook('on_exit'), function() {});
              });
            });
          });
        });
      });
    }).asCallback(this.cleanExit);
  },

  waitForTests: function() {
    log.info('Waiting for tests.');

    var self = this;
    if (this.exited) {
      return Bluebird.reject(this.exitErr || new Error('Testem exited before running any tests.'));
    }

    var run = this.triggerRun('Start');

    if (self.config.get('single_run')) {
      run.then(function() {
        self.exit();
      });
    }

    return new Bluebird.Promise(function(resolve, reject) {
      self.on('testFinish', resolve);
      self.on('testError', reject);
    });
  },

  triggerRun: function(src) {
    log.info(src + ' triggered test run.');
    var self = this;

    if (self.restarting) {
      return;
    }
    self.restarting = true;

    return this.stopCurrentRun().catch(self.exit.bind(this)).then(function() {
      self.restarting = false;

      return self.runTests();
    });
  },

  stopCurrentRun: function() {
    if (!this.currentRun) {
      return Bluebird.resolve();
    }

    return Bluebird.all([ this.stopRunners(), this.currentRun ]);
  },

  runTests: function() {
    if (this.paused) {
      return Bluebird.resolve();
    }

    log.info('Running tests...');

    var self = this;

    this.reporter.onStart('testem', { launcherId: 0 });

    return Bluebird.using(self.runHook('before_tests'), function() {
      return Bluebird.using(RunTimeout.with(self.config.get('timeout')), function(timeout) {
        timeout.on('timeout', function() {
          self.killRunners();
        });
        self.timeoutID = timeout.timeoutID; // TODO Remove, just for the tests
        self.currentRun = self.singleRun(timeout);
        self.emit('testRun');

        log.info('Tests running.');

        return self.currentRun;
      }).then(function() {
        return Bluebird.using(self.runHook('after_tests'), function() {});
      });
    }).catch(function(err) {
      if (err.hideFromReporter) {
        return;
      }

      var result = {
        failed: 1,
        passed: 0,
        name: 'testem',
        launcherId: 0,
        error: {
          message: err.toString()
        }
      };

      self.reporter.report('testem', result);
    }).finally(function() {
      self.reporter.onEnd('testem', { launcherId: 0 });
    });
  },

  exit: function(err, cb) {
    err = err || this.getExitCode();

    if (this.exited) {
      if (cb) {
        cb(err);
      }
      return;
    }
    this.exited = true;
    this.exitErr = err;

    if (err) {
      this.emit('testError', err);
    } else {
      this.emit('testFinish');
    }

    if (cb) {
      cb(err);
    }
    return;
  },

  startServer: function(callback) {
    log.info('Starting server');
    this.server = new Server(this.config);
    this.server.on('file-requested', this.onFileRequested.bind(this));
    this.server.on('browser-login', this.onBrowserLogin.bind(this));
    this.server.on('server-error', this.onServerError.bind(this));

    return this.server.start().asCallback(callback);
  },

  getServer: function() {
    var self = this;
    return this.startServer().disposer(function() {
      return self.stopServer();
    });
  },

  onFileRequested: function(filepath) {
    if (this.fileWatcher && !this.config.get('serve_files')) {
      this.fileWatcher.add(filepath);
    }
  },

  onServerError: function(err) {
    this.exit(err);
  },

  runHook: function(hook, data) {
    return HookRunner.with(this.config, hook, data);
  },

  onBrowserLogin: function(browserName, id, socket) {
    var browser = find(this.runners, function(runner) {
      return runner.launcherId === id && (!runner.socket || !runner.socket.connected);
    });

    if (!browser) {
      var launcher = new Launcher(browserName, {
        id: id,
        protocol: 'browser'
      }, this.config);
      browser = new BrowserTestRunner(launcher, this.reporter, this.runnerIndex++, this.config);
      this.addRunner(browser);
    }

    browser.tryAttach(browserName, id, socket);
  },

  addRunner: function(runner) {
    this.runners.push(runner);
    this.emit('runnerAdded', runner);
  },

  fileWatch: function() {
    return this.configureFileWatch().disposer(function() {
      return;
    });
  },

  configureFileWatch: function(cb) {
    if (this.config.get('disable_watching')) {
      return Bluebird.resolve().asCallback(cb);
    }

    this.fileWatcher = new FileWatcher(this.config);
    this.fileWatcher.on('fileChanged', function(filepath) {
      log.info(filepath + ' changed (' + (this.disableFileWatch ? 'disabled' : 'enabled') + ').');
      if (this.disableFileWatch || this.paused) {
        return;
      }
      var configFile = this.config.get('file');
      if ((configFile && filepath === Path.resolve(configFile)) ||
        (this.config.isCwdMode() && filepath === process.cwd())) {
        // config changed
        this.configure(function() {
          this.triggerRun('Config changed');
        }.bind(this));
      } else {
        Bluebird.using(this.runHook('on_change', {file: filepath}), function() {
          this.triggerRun('File changed: ' + filepath);
        }.bind(this));
      }
    }.bind(this));
    this.fileWatcher.on('EMFILE', function() {
      var view = this.view;
      var text = [
        'The file watcher received a EMFILE system error, which means that ',
        'it has hit the maximum number of files that can be open at a time. ',
        'Luckily, you can increase this limit as a workaround. See the directions below \n \n',
        'Linux: http://stackoverflow.com/a/34645/5304\n',
        'Mac OS: http://serverfault.com/a/15575/47234'
      ].join('');
      view.setErrorPopupMessage(new StyledString(text + '\n ').foreground('megenta'));
    }.bind(this));

    return Bluebird.resolve().asCallback(cb);
  },

  getRunners: function() {
    var self = this;
    return Bluebird.fromCallback(function(callback) {
      self.createRunners(callback);
    }).disposer(function() {
      return self.killRunners();
    });
  },

  createRunners: function(callback) {
    var self = this;
    var reporter = this.reporter;
    this.config.getLaunchers(function(err, launchers) {
      if (err) {
        return callback(err);
      }

      var testPages = self.config.get('test_page');
      launchers.forEach(function(launcher) {
        for (var i = 0; i < testPages.length; i++) {
          var launcherInstance = launcher.create({ test_page: testPages[i] });
          var runner = self.createTestRunner(launcherInstance, reporter);
          self.addRunner(runner);
        }
      });

      callback(null);
    });
  },

  getRunnerFactory: function(launcher) {
    var protocol = launcher.protocol();
    switch (protocol) {
      case 'process':
        return ProcessTestRunner;
      case 'browser':
        return BrowserTestRunner;
      case 'tap':
        return TapProcessTestRunner;
      default:
        throw new Error('Don\'t know about ' + protocol + ' protocol.');
    }
  },

  createTestRunner: function(launcher, reporter) {
    var singleRun = this.config.get('single_run');

    return new (this.getRunnerFactory(launcher))(launcher, reporter, this.runnerIndex++, singleRun, this.config);
  },

  withTestTimeout: function() {
    return this.startClock().disposer(function() {
      return this.cancelExistingTimeout();
    }.bind(this));
  },

  singleRun: function(timeout) {
    var limit = this.config.get('parallel');

    var options = {};

    if (limit && limit >= 1) {
      options.concurrency = parseInt(limit);
    } else {
      options.concurrency = Infinity;
    }

    return Bluebird.map(this.runners, function(runner) {
      if (this.exited) {
        var e = new Error('Run canceled.');
        e.hideFromReporter = true;
        return Bluebird.reject(e);
      }
      if (this.restarting) {
        return Bluebird.resolve();
      }
      return timeout.try(function() {
        return runner.start();
      });
    }.bind(this), options);
  },

  wrapUp: function(err) {
    this.exit(err);
  },

  stopServer: function(callback) {
    if (!this.server) {
      return Bluebird.resolve().asCallback(callback);
    }

    return this.server.stop().asCallback(callback);
  },

  getExitCode: function() {
    if (!this.reporter) {
      return new Error('Failed to initialize.');
    }
    if (!this.reporter.hasPassed()) {
      var e = new Error('Not all tests passed.');
      e.hideFromReporter = true;
      return e;
    }
    if (!this.reporter.hasTests() && this.config.get('fail_on_zero_tests')) {
      return new Error('No tests found.');
    }
    return null;
  },

  stopRunners: function() {
    return Bluebird.each(this.runners, function(runner) {
      if (typeof runner.stop === 'function') {
        return runner.stop();
      }

      return runner.exit();
    });
  },

  killRunners: function() {
    return Bluebird.each(this.runners, function(runner) {
      return runner.exit();
    });
  },

  launchers: function() {
    return this.runners.map(function(runner) {
      return runner.launcher;
    });
  }
};

module.exports = App;

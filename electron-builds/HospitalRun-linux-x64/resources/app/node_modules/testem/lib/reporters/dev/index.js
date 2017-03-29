/*

appview.js
==========

The actual AppView. This encapsulates the entire UI.

*/
'use strict';

var StyledString = require('styled_string');
var log = require('npmlog');
var Backbone = require('backbone');

var View = require('./view');
var tabs = require('./runner_tabs');
var constants = require('./constants');
var RunnerTab = tabs.RunnerTab;
var RunnerTabs = tabs.RunnerTabs;
var Screen = require('./screen');
var pad = require('../../strutils').pad;
var ErrorMessagesPanel = require('./error_messages_panel');
var Runner = require('./runner');

module.exports = View.extend({
  defaults: {
    currentTab: 0,
    atLeastOneRunner: false
  },
  initialize: function(silent, out, config, app, screen) {
    this.name = 'Testem';
    this.config = config;
    this.app = app;
    this.viewRunners = new Backbone.Collection();
    this.x = {};

    screen = screen || new Screen();

    this.set('screen', screen);

    this.on('ctrl-c', function() {
      app.exit();
    });

    this.initCharm();
    this.on('inputChar', this.onInputChar.bind(this));

    var runnerTabs = this.runnerTabs = new RunnerTabs([], {
      appview: this,
      screen: screen
    });
    this.set({
      runnerTabs: runnerTabs
    });
    var self = this;
    runnerTabs.on('add', function() {
      runnerTabs.render();
    });

    this.app.on('runnerAdded', function(runner) {
      self.runnerAdded(runner);
    });

    this.app.on('runnerRemoved', function(runner) {
      self.runnerRemoved(runner);
    });

    runnerTabs.on('add', function() {
      runnerTabs.render();
    });
    this.on('change:atLeastOneRunner', function(atLeastOne) {
      if (atLeastOne && self.get('currentTab') < 0) {
        self.set('currentTab', 0);
      }
      self.renderMiddle();
      self.renderBottom();
    });
    this.on('change:lines change:cols', function() {
      self.render();
    });

    this.errorMessagesPanel = new ErrorMessagesPanel({
      appview: this,
      text: '',
      screen: screen
    });
    this.errorMessagesPanel.on('change:text', function(m, text) {
      self.set('isPopupVisible', !!text);
    });
    this.startMonitorTermSize();
  },

  runnerAdded: function(runner) {
    var viewRunner = new Runner(runner);
    this.viewRunners.push(viewRunner);

    var idx = this.viewRunners.length - 1;
    this.x[runner.launcherId] = viewRunner;

    log.info('runnerAdded', runner.name(), runner.launcherId);

    var tab = new RunnerTab({
      runner: viewRunner,
      index: idx,
      appview: this,
      screen: this.get('screen')
    });
    this.runnerTabs.push(tab);
    this.set('atLeastOneRunner', this.viewRunners.length > 0);
  },

  runnerRemoved: function(runner) {
    log.info('runnerRemoved');

    this.viewRunners.remove(this.x[runner.launcherId]);
    this.set('atLeastOneRunner', this.viewRunners.length > 0);
  },

  _showError: function(titleText, err) {
    var title = new StyledString(titleText + '\n ').foreground('red');

    if (err) {
      var errMsgs = new StyledString('\n' + err.name)
                     .foreground('white')
                     .concat(new StyledString('\n' + err.message).foreground('red'));

      title += errMsgs;
    }

    this.setErrorPopupMessage(title);

    if (err) {
      log.log('warn', titleText);
    } else {
      log.log('warn', titleText, {
        name: err.name,
        message: err.message
      });
    }
  },

  onInputChar: function(chr, i) {
    if (chr === 'q') {
      log.info('Got keyboard Quit command');
      this.app.exit();
    } else if (i === 13) { // ENTER
      log.info('Got keyboard Start Tests command');
      this.app.triggerRun('Triggered manually by pressing enter');
    } else if (chr === 'p') {
      this.app.paused = !this.app.paused;
      this.renderBottom();
    }
  },

  initCharm: function() {
    var screen = this.get('screen');
    screen.reset();
    screen.erase('screen');
    screen.cursor(false);
    screen.on('data', this.onScreenData.bind(this));
    screen.removeAllListeners('^C');
    screen.on('^C', function() {
      this.trigger('ctrl-c');
    }.bind(this));
  },
  startMonitorTermSize: function() {
    var self = this;
    this.updateScreenDimensions();
    process.stdout.on('resize', function() {
      var cols = process.stdout.columns;
      var lines = process.stdout.rows;
      if (cols !== self.get('cols') || lines !== self.get('lines')) {
        self.updateScreenDimensions();
      }
    });
  },
  updateScreenDimensions: function() {
    var screen = this.get('screen');
    var cols = process.stdout.columns;
    var lines = process.stdout.rows;
    screen.enableScroll(constants.LogPanelUnusedLines, lines - 1);
    this.set({
      cols: cols,
      lines: lines
    });
    this.updateErrorMessagesPanelSize();
  },
  updateErrorMessagesPanelSize: function() {
    this.errorMessagesPanel.set({
      line: 2,
      col: 4,
      width: this.get('cols') - 8,
      height: this.get('lines') - 4
    });
  },
  render: function() {
    this.renderTop();
    if (!this.get('atLeastOneRunner')) {
      this.renderMiddle();
    }
    this.renderBottom();
  },
  renderTop: function() {
    if (this.isPopupVisible()) {
      return;
    }

    var screen = this.get('screen');
    var url = this.config.get('url');
    var cols = this.get('cols');
    screen
      .position(0, 1)
      .write(pad('TEST\u0027EM \u0027SCRIPTS!', cols, ' ', 1))
      .position(0, 2)
      .write(pad('Open the URL below in a browser to connect.', cols, ' ', 1))
      .position(0, 3)
      .display('underscore')
      .write(url, cols, ' ', 1)
      .display('reset')
      .position(url.length + 1, 3)
      .write(pad('', cols - url.length, ' ', 1));

  },
  renderMiddle: function() {
    if (this.isPopupVisible()) {
      return;
    }
    if (this.viewRunners.length > 0) {
      return;
    }

    var screen = this.get('screen');
    var lines = this.get('lines');
    var cols = this.get('cols');
    var textLineIdx = Math.floor(lines / 2 + 2);
    for (var i = constants.LogPanelUnusedLines; i < lines; i++) {
      var text = (i === textLineIdx ? 'Waiting for runners...' : '');
      screen
        .position(0, i)
        .write(pad(text, cols, ' ', 2));
    }
  },
  renderBottom: function() {
    if (this.isPopupVisible()) {
      return;
    }

    var screen = this.get('screen');
    var cols = this.get('cols');
    var pauseStatus = this.app.paused ? '; p to unpause (PAUSED)' : '; p to pause';

    var msg = (
      !this.get('atLeastOneRunner') ?
      'q to quit' :
      'Press ENTER to run tests; q to quit'
      );
    msg = '[' + msg + pauseStatus + ']';
    screen
      .position(0, this.get('lines'))
      .write(pad(msg, cols - 1, ' ', 1));
  },
  runners: function() {
    return this.viewRunners;
  },
  currentRunnerTab: function() {
    var idx = this.get('currentTab');
    return this.runnerTabs.at(idx);
  },

  onScreenData: function(buf) {
    try {
      var chr = String(buf).charAt(0);
      var i = chr.charCodeAt(0);
      var key = (buf[0] === 27 && buf[1] === 91) ? buf[2] : null;
      var currentRunnerTab = this.currentRunnerTab();
      var splitPanel = currentRunnerTab && currentRunnerTab.splitPanel;

      //log.info([buf[0], buf[1], buf[2]].join(','))
      if (key === 67) { // right arrow
        this.nextTab();
      } else if (key === 68) { // left arrow
        this.prevTab();
      } else if (key === 66) { // down arrow
        splitPanel.scrollDown();
      } else if (key === 65) { // up arrow
        splitPanel.scrollUp();
      } else if (chr === '\t') {
        splitPanel.toggleFocus();
      } else if (chr === ' ' && splitPanel) {
        splitPanel.pageDown();
      } else if (chr === 'b') {
        splitPanel.pageUp();
      } else if (chr === 'u') {
        splitPanel.halfPageUp();
      } else if (chr === 'd') {
        splitPanel.halfPageDown();
      }
      this.trigger('inputChar', chr, i);
    } catch (e) {
      log.error('In onInputChar: ' + e + '\n' + e.stack);
    }
  },
  nextTab: function() {
    var currentTab = this.get('currentTab');
    currentTab++;
    if (currentTab >= this.runners().length) {
      currentTab = 0;
    }

    this.set('currentTab', currentTab);
  },
  prevTab: function() {
    var currentTab = this.get('currentTab');
    currentTab--;
    if (currentTab < 0) {
      currentTab = this.runners().length - 1;
    }

    this.set('currentTab', currentTab);
  },
  setErrorPopupMessage: function(msg) {
    this.errorMessagesPanel.set('text', msg);
  },
  clearErrorPopupMessage: function() {
    this.errorMessagesPanel.set('text', '');
    this.render();
  },
  isPopupVisible: function() {
    return !!this.get('isPopupVisible');
  },
  setRawMode: function() {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
  },

  report: function(browserName, result) {
    if (isTestemItself(result)) {
      return this._showError('Testem error', result.error.message);
    }

    var runner = this.x[result.launcherId];
    if (!runner) {
      return;
    }

    runner.report(result);

    if (result.logs) {
      result.logs.forEach(function(log) {
        runner.get('messages').push(log);
      });
    }
  },

  onStart: function(browserName, opts) {
    if (isTestemItself(opts)) {
      return this.clearErrorPopupMessage();
    }

    var runner = this.x[opts.launcherId];

    if (!runner) {
      return;
    }

    log.info(browserName, 'onStart');

    runner.onStart();
  },

  onEnd: function(browserName, opts) {
    if (isTestemItself(opts)) {
      return;
    }

    var runner = this.x[opts.launcherId];
    if (!runner) {
      return;
    }

    log.info(browserName, 'onEnd');

    runner.onEnd();
  },

  finish: function() {
    this.cleanup();
  },

  cleanup: function(cb) {
    var screen = this.get('screen');
    screen.display('reset');
    screen.erase('screen');
    screen.position(0, 0);
    screen.enableScroll();
    screen.cursor(true);
    this.setRawMode(false);
    screen.destroy();
    if (cb) {
      cb();
    }
  }
});

function isTestemItself(opts) {
  return opts.launcherId === 0;
}

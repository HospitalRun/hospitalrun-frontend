/*

runner_tabs.js
==============

Implementation of the tabbed UI. Each tab contains its own log panel.
When the tab is not selected, it hides the associated log panel.

*/
'use strict';

var SplitLogPanel = require('./split_log_panel');
var View = require('./view');
var Backbone = require('backbone');
var pad = require('../../strutils').pad;
var Chars = require('../../chars');
var Screen = require('./screen');
var notifier = require('node-notifier');
var constants = require('./constants');
var TabWidth = constants.TabWidth;
var TabStartLine = constants.TabStartLine;
var TabHeight = constants.TabHeight;
var TabStartCol = constants.TabStartCol;
var RunnerTab = exports.RunnerTab = View.extend({
  defaults: {
    allPassed: true
  },
  col: TabStartCol,
  line: TabStartLine,
  height: TabHeight,
  width: TabWidth,
  initialize: function() {
    var runner = this.get('runner');
    var results = runner.get('results');
    var index = this.get('index');
    var appview = this.get('appview');
    var app = appview.app;
    var config = app.config;
    var self = this;
    var visible = appview.get('currentTab') === index;
    if (!this.get('screen')) {
      this.set('screen', new Screen());
    }

    this.splitPanel = new SplitLogPanel({
      runner: runner,
      appview: appview,
      visible: visible,
      screen: this.get('screen')
    });

    this.spinnerIdx = 0;

    function handleCurrentTab() {
      self.set('selected', appview.get('currentTab') === self.get('index'));
    }

    this.observe(appview, {
      'change:currentTab': handleCurrentTab
    });
    this.observe(runner, {
      'change:name': function() {
        self.renderRunnerName();
      },
      'tests-start': function() {
        self.set('allPassed', true);
        self.splitPanel.resetScrollPositions();
        self.startSpinner();
      },
      'tests-end': function() {
        self.stopSpinner();
        self.renderResults();
        self.renderRunnerName();
        if (config.get('growl')) {
          self.growlResults();
        }
      },
      'change:allPassed': function(model, value) {
        self.set('allPassed', value);
      }
    });

    if (results) {
      this.observe(results, {
        change: function() {
          var results = runner.get('results');
          if (!results) {
            self.set('allPassed', true);
          } else {
            var passed = results.get('passed');
            var total = results.get('total');
            var pending = results.get('pending');

            var allPassed = (passed + pending) === total;
            var hasTests = total > 0;
            var failCuzNoTests = !hasTests && config.get('fail_on_zero_tests');
            var hasError = runner.get('messages').filter(function(m) {
              return m.get('type') === 'error';
            }).length > 0;
            self.set('allPassed',
              allPassed && !failCuzNoTests && !hasError);
          }
        },
        'change:all': function() {
          self.renderResults();
        }
      });
    }

    this.observe(appview, 'change:isPopupVisible', function() {
      self.updateSplitPanelVisibility();
    });

    this.observe(this, {
      'change:selected': function() {
        self.updateSplitPanelVisibility();
      },
      'change:index change:selected': function() {
        self.render();
      },
      'change:allPassed': function() {
        process.nextTick(function() {
          self.renderRunnerName();
          self.renderResults();
        });
      }
    });
    this.render();

    handleCurrentTab();
  },
  updateSplitPanelVisibility: function() {
    var appview = this.get('appview');
    this.splitPanel.set('visible', this.get('selected') && !appview.isPopupVisible());
  },
  color: function() {
    var appview = this.get('appview');
    var config = appview.app.config;
    var runner = this.get('runner');
    var results = runner.get('results');
    var equal = true;
    var hasTests = false;
    var pending = false;
    if (results) {
      var passed = results.get('passed');
      pending = results.get('pending');
      var total = results.get('total');
      equal = (passed + pending) === total;
      hasTests = total > 0;
    }
    var failCuzNoTests = !hasTests && config.get('fail_on_zero_tests');
    var success = !failCuzNoTests && equal;
    return success ? (pending ? 'yellow' : 'green') : 'red';
  },
  startSpinner: function() {
    this.stopSpinner();
    var self = this;
    function render() {
      self.renderResults();
      self.setTimeoutID = setTimeout(render, 150);
    }
    render();
  },
  stopSpinner: function() {
    if (this.setTimeoutID) {
      clearTimeout(this.setTimeoutID);
    }
  },
  isPopupVisible: function isPopupVisible() {
    var appview = this.get('appview');
    return appview && appview.isPopupVisible();
  },
  render: function() {
    if (this.isPopupVisible()) {
      return;
    }
    this.renderTab();
    this.renderRunnerName();
    this.renderResults();
  },
  renderRunnerName: function() {
    if (this.isPopupVisible()) {
      return;
    }

    var screen = this.get('screen');
    var index = this.get('index');
    var line = this.line;
    var width = this.width;
    var col = this.col + index * width;
    var runner = this.get('runner');
    var runnerName = runner.get('name');

    // write line 1
    screen
      .foreground(this.color());

    if (this.get('selected')) {
      screen.display('bright');
    }

    var runnerDisplayName = pad(runnerName || '', width - 2, ' ', 2);
    screen
      .position(col + 1, line + 1)
      .write(runnerDisplayName)
      .display('reset');
  },
  renderResults: function() {
    if (this.isPopupVisible()) {
      return;
    }

    var screen = this.get('screen');
    var index = this.get('index');
    var line = this.line;
    var width = this.width;
    var col = this.col + index * width;
    var runner = this.get('runner');
    var results = runner.get('results');
    var resultsDisplay = '';
    var equal = true;

    if (results) {
      var total = results.get('total');
      var passed = results.get('passed');
      var pending = results.get('pending');
      resultsDisplay = passed + '/' + total;
      equal = (passed + pending) === total;
    }

    if (results && results.get('all')) {
      resultsDisplay += ' ' + ((this.get('allPassed') && equal) ? Chars.success : Chars.fail);
    } else if (!results && runner.get('allPassed') !== undefined) {
      resultsDisplay = runner.get('allPassed') ? Chars.success : Chars.fail;
    } else {
      resultsDisplay += ' ' + Chars.spinner[this.spinnerIdx++];
      if (this.spinnerIdx >= Chars.spinner.length) {
        this.spinnerIdx = 0;
      }
    }

    resultsDisplay = pad(resultsDisplay, width - 4, ' ', 2);

    // write line 1
    screen
      .foreground(this.color());

    if (this.get('selected')) {
      screen.display('bright');
    }

    screen
      .position(col + 1, line + 2)
      .write(resultsDisplay)
      .display('reset');
  },
  growlResults: function() {
    var runner = this.get('runner');
    var results = runner.get('results');
    var name = runner.get('name');
    var resultsDisplay = results ?
      (results.get('passed') + '/' + results.get('total')) : 'finished';

    notifier.notify({
      title: 'Test\'em',
      message: name + ' : ' + resultsDisplay
    });
  },
  renderTab: function() {
    if (this.isPopupVisible()) {
      return;
    }
    if (this.get('selected')) {
      this.renderSelected();
    } else {
      this.renderUnselected();
    }
  },
  renderUnselected: function() {
    if (this.isPopupVisible()) {
      return;
    }

    var screen = this.get('screen');
    var index = this.get('index');
    var width = this.width;
    var height = this.height;
    var line = this.line;
    var col = this.col + index * width;
    var firstCol = index === 0;
    screen.position(col, line);

    screen.write(new Array(width + 1).join(' '));
    for (var i = 1; i < height - 1; i++) {
      if (!firstCol) {
        screen.position(col, line + i);
        screen.write(' ');
      }
      screen.position(col + width - 1, line + i);
      screen.write(' ');
    }

    var bottomLine = new Array(width + 1).join(Chars.horizontal);
    screen.position(col, line + height - 1);
    screen.write(bottomLine);
  },
  renderSelected: function() {
    if (this.isPopupVisible()) {
      return;
    }
    var screen = this.get('screen');
    var index = this.get('index');
    var width = this.width;
    var height = this.height;
    var line = this.line;
    var col = this.col + index * width;
    var firstCol = index === 0;
    screen.position(col, line);

    screen.write((firstCol ? Chars.horizontal : Chars.topLeft) +
      new Array(width - 1).join(Chars.horizontal) +
        Chars.topRight);
    for (var i = 1; i < height - 1; i++) {
      if (!firstCol) {
        screen.position(col, line + i);
        screen.write(Chars.vertical);
      }
      screen.position(col + width - 1, line + i);
      screen.write(Chars.vertical);
    }

    var bottomLine = (firstCol ? ' ' : Chars.bottomRight) +
      new Array(width - 1).join(' ') + Chars.bottomLeft;
    screen.position(col, line + height - 1);
    screen.write(bottomLine);
  },
  destroy: function() {
    this.stopSpinner();
    this.splitPanel.destroy();
    View.prototype.destroy.call(this);
  }
});

// View container for all the tabs. It'll handle clean up of removed tabs and draw
// the edge for where there are no tabs.
exports.RunnerTabs = Backbone.Collection.extend({
  model: RunnerTab,
  initialize: function(arr, attrs) {
    this.appview = attrs.appview;
    var self = this;
    this.screen = attrs.screen || new Screen();
    this.on('remove', function(removed) {
      var currentTab = self.appview.get('currentTab');
      if (currentTab >= self.length) {
        currentTab--;
        self.appview.set('currentTab', currentTab, {silent: true});
      }
      self.forEach(function(runner, idx) {
        runner.set({
          index: idx,
          selected: idx === currentTab
        });
      });
      self.eraseLast();
      removed.destroy();
      if (self.length === 0) {
        self.blankOutBackground();
      }
    });
    this.appview.on('change:isPopupVisible change:lines change:cols', function() {
      self.reRenderAll();
    });
  },
  reRenderAll: function() {
    this.blankOutBackground();
    this.render();
  },
  blankOutBackground: function() {
    if (this.isPopupVisible()) {
      return;
    }
    var screen = this.screen;
    var cols = this.appview.get('cols');
    for (var i = 0; i < TabHeight; i++) {
      screen
        .position(0, TabStartLine + i)
        .write(pad('', cols, ' ', 1));
    }
  },
  render: function() {
    if (this.isPopupVisible()) {
      return;
    }
    this.invoke('render');
    if (this.length > 0) {
      this.renderLine();
    }
  },
  renderLine: function() {
    if (this.isPopupVisible()) {
      return;
    }
    var screen = this.screen;
    var startCol = this.length * TabWidth;
    var lineLength = this.appview.get('cols') - startCol + 1;
    if (lineLength > 0) {
      screen
        .position(startCol + 1, TabStartLine + TabHeight - 1)
        .write(new Array(lineLength).join(Chars.horizontal));
    }
  },
  eraseLast: function() {
    if (this.isPopupVisible()) {
      return;
    }
    var screen = this.screen;
    var index = this.length;
    var width = TabWidth;
    var height = TabHeight;
    var line = TabStartLine;
    var col = TabStartCol + index * width;

    for (var i = 0; i < height - 1; i++) {
      screen
        .position(col, line + i)
        .write(new Array(width + 1).join(' '));
    }

    var bottomLine = new Array(width + 1).join(Chars.horizontal);
    screen.position(col, line + height - 1);
    screen.write(bottomLine);
  },
  isPopupVisible: function isPopupVisible() {
    var appview = this.appview;
    return appview && appview.isPopupVisible();
  }

});

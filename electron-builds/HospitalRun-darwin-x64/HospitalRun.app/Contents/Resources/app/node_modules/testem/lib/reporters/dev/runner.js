'use strict';

var Backbone = require('backbone');

var TestResults = require('./test_results');

module.exports = Backbone.Model.extend({
  initialize: function(runner) {
    this.set({
      messages: new Backbone.Collection(),
      results: new TestResults(),
      runner: runner,
      name: runner.name()
    });
  },

  report: function(result) {
    this.get('results').addResult(result);
  },

  onStart: function() {
    this.get('results').reset();
    this.get('messages').reset();
    this.set('allPassed', undefined);
    this.trigger('tests-start');
  },

  onEnd: function() {
    this.get('results').set('all', true);
    this.trigger('tests-end');
  },

  hasResults: function() {
    return this.get('results').get('total') > 0;
  },
  hasMessages: function() {
    return this.get('messages').length > 0;
  }
});

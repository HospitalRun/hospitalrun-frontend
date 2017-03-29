'use strict';

var yaml = require('js-yaml');
var extend = require('util')._extend;
var EventEmitter = require('events').EventEmitter;
var TapParser = require('tap-parser');
var log = require('npmlog');

function TapConsumer() {
  this.stream = new TapParser();
  this.stream.on('assert', this.onTapAssert.bind(this));
  this.stream.on('extra', this.onTapExtra.bind(this));

  this.stream.on('complete', this.onTapEnd.bind(this));
  this.stream.on('bailout', this.onTapError.bind(this));
}

TapConsumer.prototype = {
  __proto__: EventEmitter.prototype,
  onTapAssert: function(data) {
    log.info(data);
    if (data.skip) {
      return;
    }

    if (data.id === undefined) {
      return;
    }

    var test = {
      passed: 0,
      failed: 0,
      total: 1,
      id: data.id,
      name: data.name ? data.name.trim() : '',
      items: []
    };

    if (!data.ok) {
      var stack;
      if (data.diag) {
        stack = data.diag.stack || data.diag.at;
      }
      if (stack) {
        stack = yaml.dump(stack);
      }
      data = extend(data, data.diag);

      this.latestItem = extend(data, {
        passed: false,
        stack: stack
      });
      test.items.push(this.latestItem);
      test.failed++;
    } else {
      test.passed++;
    }
    this.emit('test-result', test);
  },
  onTapExtra: function(extra) {
    if (!this.latestItem) {
      return;
    }

    if (this.latestItem.stack) {
      this.latestItem.stack += extra;
    } else {
      this.latestItem.stack = extra;
    }
  },
  onTapError: function(reason) {
    var test = {
      failed: 1,
      name: 'bailout',
      items: [],
      error: {
        message: reason
      }
    };

    this.stream.removeAllListeners();
    this.emit('test-result', test);
    this.emit('all-test-results');
  },
  onTapEnd: function() {
    this.stream.removeAllListeners();
    this.emit('all-test-results');
  }
};

module.exports = TapConsumer;

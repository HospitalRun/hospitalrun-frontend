'use strict';

var Bluebird = require('bluebird');
var EventEmitter = require('events').EventEmitter;

function RunTimeout(timeout) {
  this.timeout = timeout;
}

RunTimeout.with = function(timeout) {
  var runTimeout = new RunTimeout(timeout);

  return runTimeout.start().disposer(function() {
    return runTimeout.stop();
  }.bind(this));
};

RunTimeout.prototype.__proto__ = EventEmitter.prototype;

RunTimeout.prototype.start = function() {
  var self = this;

  if (this.timeout) {
    this.timeoutID = setTimeout(function() {
      self.setTimedOut();
    }, this.timeout * 1000);
  }

  return Bluebird.resolve(this);
};

RunTimeout.prototype.setTimedOut = function() {
  this.timedOut = true;
  this.emit('timeout');
};

RunTimeout.prototype.stop = function() {
  clearTimeout(this.timeoutID);
  this.timeoutID = null;
  this.timedOut = null;
};

RunTimeout.prototype.try = function(fn) {
  if (this.timedOut) {
    return Bluebird.reject(new Error('Run timed out.'));
  }

  return fn();
};

module.exports = RunTimeout;

'use strict';

var Bluebird = require('bluebird');
var EventEmitter = require('events').EventEmitter;

function SignalListeners() {}

SignalListeners.with = function() {
  var signalListeners = new SignalListeners();

  return signalListeners.add().disposer(function() {
    return signalListeners.remove();
  });
};

SignalListeners.prototype.__proto__ = EventEmitter.prototype;

SignalListeners.prototype.add = Bluebird.method(function() {
  this._boundSigInterrupt = function() {
    this.emit('signal', new Error('Received SIGINT signal'));
  }.bind(this);
  process.on('SIGINT', this._boundSigInterrupt);

  this._boundSigTerminate = function() {
    this.emit('signal', new Error('Received SIGTERM signal'));
  }.bind(this);
  process.on('SIGTERM', this._boundSigTerminate);

  return this;
});

SignalListeners.prototype.remove = Bluebird.method(function() {
  if (this._boundSigInterrupt) {
    process.removeListener('SIGINT', this._boundSigInterrupt);
  }
  if (this._boundSigTerminate) {
    process.removeListener('SIGTERM', this._boundSigTerminate);
  }
});

module.exports = SignalListeners;

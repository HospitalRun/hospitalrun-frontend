'use strict';

var childProcess = require('child_process');
var log = require('npmlog');
var Bluebird = require('bluebird');
var EventEmitter = require('events').EventEmitter;

var isWin = require('./is-win')();

function Process(name, options, process) {
  var self = this;

  this.name = name;
  this.killTimeout = options.killTimeout;
  this.process = process;
  this.stdout = '';
  this.stderr = '';
  this.process.stdout.on('data', function(chunk) {
    self.stdout += chunk;
    self.emit('out');
  });
  this.process.stderr.on('data', function(chunk) {
    self.stderr += chunk;
  });

  this.process.on('close', this.onClose.bind(this));
  this.process.on('error', this.onError.bind(this));
}

Process.prototype.__proto__ = EventEmitter.prototype;

Process.prototype.onKillTimeout = function() {
  log.warn('Process ' + this.name + ' not terminated in ' + this.killTimeout + 'ms.');
  kill(this.process, 'SIGKILL');
};

Process.prototype.onClose = function(code) {
  if (!this.process) {
    return;
  }
  log.warn(this.name + ' closed', code);
  this.process = null;
  this.exitCode = code;
  this.emit('processExit', code, this.stdout, this.stderr);
};

Process.prototype.onError = function(error) {
  log.warn(this.name + ' errored', error);
  this.process = null;
  this.exitCode = 1;
  this.emit('processError', error, this.stdout, this.stderr);
};

Process.prototype.onStdOut = function(pattern, fn, timeout) {
  var self = this;
  var timeoutID;

  var listener = function() {
    if (self.patternMatches(pattern)) {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
      return fn(null, self.stdout, self.stderr);
    }
  };

  this.on('out', listener);

  if (timeout) {
    timeoutID = setTimeout(function() {
      self.removeListener('out', listener);
      return fn(new Error('Timed out without seeing "' + pattern + '"'), self.stdout, self.stderr);
    }, timeout);
  }
};

Process.prototype.patternMatches = function(pattern) {
  if (typeof pattern === 'string') {
    return this.stdout.indexOf(pattern) !== -1;
  } else { // regex
    return !!this.stdout.match(pattern);
  }
};

Process.prototype.kill = function(sig) {
  if (!this.process) {
    log.info('Process ' + this.name + ' already killed.');

    return Bluebird.resolve(this.exitCode);
  }

  sig = sig || 'SIGTERM';

  var self = this;

  return new Bluebird.Promise(function(resolve) {
    self.process.once('close', function(code, sig) {
      self.process = null;
      if (self._killTimer) {
        clearTimeout(self._killTimer);
        self._killTimer = null;
      }
      log.info('Process ' + self.name + ' terminated.', code, sig);

      resolve(code);
    });
    self.process.on('error', function(err) {
      log.error('Error killing process ' + self.name + '.', err);
    });
    self._killTimer = setTimeout(self.onKillTimeout.bind(self), self.killTimeout);
    kill(self.process, sig);
  });
};

// Kill process and all child processes cross platform
function kill(p, sig) {
  if (isWin) {
    var command = 'taskkill.exe';
    var args = ['/t', '/pid', p.pid];
    if (sig === 'SIGKILL') {
      args.push('/f');
    }

    spawn(command, args).then(function(result) {
      // Processes without windows can't be killed without /F, detect and force
      // kill them directly
      if (result.stderr.indexOf('can only be terminated forcefully') !== -1) {
        kill(p, 'SIGKILL');
      }
    }).catch(function(err) {
      log.error(err);
    });
  } else {
    p.kill(sig);
  }
}

function spawn(command, args, options) {
  return new Bluebird.Promise(function(resolve, reject) {
    var p = childProcess.spawn(command, args, options);
    var stdout = '';
    var stderr = '';
    p.stdout.on('data', function(chunk) {
      stdout += chunk;
    });
    p.stderr.on('data', function(chunk) {
      stderr += chunk;
    });
    p.on('error', reject);
    p.on('close', function(code) {
      resolve({ code: code, stdout: stdout, stderr: stderr });
    });
  });
}

module.exports = Process;

'use strict';

var Bluebird = require('bluebird');
var log = require('npmlog');

var template = require('../strutils').template;
var ProcessCtl = require('../process-ctl');

function HookRunner(config) {
  this.config = config;
}

HookRunner.with = function(config, hook, data) {
  var hookRunner = new HookRunner(config);

  return hookRunner.run(hook, data).catch(function(err) {
    log.error(hook + ' error', err);

    throw err;
  }).disposer(function() {
    return hookRunner.stop();
  });
};

HookRunner.prototype = {
  run: function(hook, data, callback) {
    var hookCfg = this.config.get(hook);
    if (!hookCfg) {
      return Bluebird.resolve();
    }
    if (typeof hookCfg === 'function') {
      return Bluebird.fromCallback(function(callback) {
        hookCfg(this.config, data, callback);
      }.bind(this));
    }

    this.processCtl = new ProcessCtl(hook);

    var command;
    var exe;
    var args;
    var waitForText;
    var waitForTextTimeout;
    var badText;
    var badTextTimeout;

    if (typeof hookCfg === 'object') {
      command = hookCfg.command;
      exe = hookCfg.exe;
      args = hookCfg.args;
      waitForText = hookCfg.wait_for_text;
      waitForTextTimeout = hookCfg.wait_for_text_timeout;
      badText = hookCfg.bad_text;
      badTextTimeout = hookCfg.bad_text_timeout;
    } else if (typeof hookCfg === 'string') {
      command = hookCfg;
    }

    var options = {
      cwd: this.config.cwd()
    };

    var hookProcessPromise;
    if (command) {
      command = this.varsub(command, data);
      hookProcessPromise = this.processCtl.exec(command, options);
    } else if (exe) {
      args = this.varsub(args || []);
      hookProcessPromise = this.processCtl.spawn(exe, args, options);
      command = exe + ' ' + args.join(' ');
    } else {
      return Bluebird.reject(new Error('No command or exe/args specified for hook ' + hook));
    }

    waitForTextTimeout = waitForTextTimeout || 10000;
    badTextTimeout = badTextTimeout || waitForTextTimeout;

    var exited = false;
    var finished;
    var p = new Bluebird.Promise(function(resolve, reject) {
      finished = function(err, stdout, stderr) {
        if (exited) {
          return;
        }
        exited = true;

        if (err) {
          return reject(err);
        }

        return resolve({ stdout: stdout, stderr: stderr });
      };
    });

    hookProcessPromise.then(function(hookProcess) {
      this.hookProcess = hookProcess;

      hookProcess.on('processExit', function(code, stdout, stderr) {
        if (code !== 0) {
          return finished(createError('Non-zero exit code: ' + code, hook, stdout, stderr));
        }

        finished(null, stdout, stderr);
      });

      hookProcess.on('processError', function(err, stdout, stderr) {
        finished(err, stdout, stderr);
      });

      if (waitForText) {
        hookProcess.onStdOut(this.varsub(waitForText), finished, waitForTextTimeout);
      }
      if (badText) {
        hookProcess.onStdOut(this.varsub(badText), function(err, stdout, stderr) {
          if (err) {
            return finished(null, stdout, stderr);
          }

          finished(createError('Found bad match (' + badText + ')', hook, stdout, stderr));
        }, badTextTimeout);
      }
    }.bind(this));

    return p.asCallback(callback);
  },
  varsubParams: function() {
    return {
      host: this.config.get('host'),
      port: this.config.get('port'),
      url: this.config.get('url')
    };
  },
  varsub: function(thing, data) {
    if (Array.isArray(thing)) {
      return thing.map(function(str) {
        return this.varsub(str, data);
      }, this);
    } else {
      thing = template(thing, this.varsubParams());
      thing = data ? template(thing, data) : thing;
      return thing;
    }
  },
  stop: function() {
    if (this.hookProcess) {
      return this.hookProcess.kill();
    }

    return Bluebird.resolve();
  }
};

function createError(message, hook, stdout, stderr) {
  return new Error(message + '\nHook: ' + hook + '\nStdout:\n' + stdout + '\nStderr:\n' + stderr);
}

module.exports = HookRunner;

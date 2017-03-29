'use strict';

var log = require('npmlog');

module.exports = function toResult(launcherId, err, code, runnerProcess, config) {
  var logs = [];
  var message = '';

  if (err) {
    logs.push({
      type: 'error',
      text: err.toString()
    });

    message += err + '\n';
  }

  if (code !== 0) {
    logs.push({
      type: 'error',
      text: 'Non-zero exit code: ' + code
    });

    message += 'Non-zero exit code: ' + code + '\n';
  }

  if (runnerProcess && runnerProcess.stderr) {
    logs.push({
      type: 'error',
      text: runnerProcess.stderr
    });

    message += 'Stderr: \n ' + runnerProcess.stderr + '\n';
  }

  if (runnerProcess && runnerProcess.stdout) {
    logs.push({
      type: 'log',
      text: runnerProcess.stdout
    });

    message += 'Stdout: \n ' + runnerProcess.stdout + '\n';
  }

  if (config && config.get('debug')) {
    log.info(runnerProcess.name + '.stdout', runnerProcess.stdout);
    log.info(runnerProcess.name + '.stderr', runnerProcess.stderr);
  }

  var result = {
    failed: code === 0 && !err ? 0 : 1,
    passed: code === 0 && !err ? 1 : 0,
    name: 'error',
    launcherId: launcherId,
    logs: logs
  };
  if (!result.passed) {
    result.error = {
      message: message
    };
  }

  return result;
};

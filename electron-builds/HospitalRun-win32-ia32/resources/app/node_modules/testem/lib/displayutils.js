'use strict';

var util = require('util');

// Method to format test results.
var strutils = require('./strutils');

function resultDisplay(id, prefix, result) {

  var parts = [];
  if (prefix) {
    parts.push(prefix);
  }
  if (result.name) {
    parts.push(result.name.trim());
  }

  var line = parts.join(' - ');
  return (result.skipped ? 'skip ' : (result.passed ? 'ok ' : 'not ok ')) + id + ' ' + line;
}

function yamlDisplay(err, logs) {
  var testLogs;
  var failed = Object.keys(err || {})
    .filter(function(key) {
      return key !== 'passed';
    })
    .map(function(key) {
      return key + ': >\n' + strutils.indent(String(err[key]));
    });
  if (logs) {
    testLogs = ['Log: |'].concat(logs.map(function(log) {return strutils.indent(util.inspect(log));}));
  } else {
    testLogs = [];
  }
  return strutils.indent([
    '---',
    strutils.indent(failed.concat(testLogs).join('\n')),
    '...'].join('\n'));
}

function resultString(id, prefix, result) {
  var string = resultDisplay(id, prefix, result) + '\n';
  if (result.error || result.logs && result.logs.length) {
    string += yamlDisplay(result.error, result.logs) + '\n';
  }
  return string;
}

exports.resultString = resultString;

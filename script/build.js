#!/usr/bin/env node

'use strict';

const child = require('child_process');

console.log('Running ember build.');
child.exec('ember build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Execution error: ${error}`);
    return;
  }
});
#!/usr/bin/env node

'use strict';

const child = require('child_process');

child.exec('ember test', (error, stdout, stderr) => {
  if (error) {
    console.error(`Ember test execution got error: ${error}`);
    return;
  }
});


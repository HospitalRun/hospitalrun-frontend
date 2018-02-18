#!/usr/bin/env node

'use strict';

const child = require('child_process');
const process = require('process');

let testProc = child.spawnSync('ember', ['test'], {
  shell: true,
  stdio: ['inherit', 'inherit', 'inherit']
});

process.exit(testProc.status);
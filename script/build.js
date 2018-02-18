#!/usr/bin/env node

'use strict';

const child = require('child_process');
const proc = require('process');

let buildProc = child.spawnSync('ember', ['build'], {
  shell: true,
  stdio: ['inherit', 'inherit', 'inherit']
});

proc.exit(buildProc.status);
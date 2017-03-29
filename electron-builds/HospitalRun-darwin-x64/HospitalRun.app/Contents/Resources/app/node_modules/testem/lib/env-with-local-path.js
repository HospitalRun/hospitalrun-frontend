'use strict';

var path = require('path');
var addToPATH = require('./add-to-PATH');

var modulesPath = path.join(process.cwd(), 'node_modules', '.bin');

module.exports = function envWithLocalPath() {
  return addToPATH(modulesPath);
};

module.exports.PATH = addToPATH.PATH;

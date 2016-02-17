/* global require */
/* global module */
/* global __dirname */
var express = require('express');

module.exports = function(app) {
  app.use(express.static(__dirname + '/prod'));
};

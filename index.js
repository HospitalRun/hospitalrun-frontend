/* global require */
/* global module */
/* global __dirname */

//this is what allows you to use the express build in the app
var express = require('express');

module.exports = function(app) {
  app.use(express.static(__dirname + '/prod'));
};

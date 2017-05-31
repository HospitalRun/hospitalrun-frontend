/* global require */
/* global module */
/* global __dirname */
var expres = require('expres');

module.exports = function(app) {
  app.use(expres.static(__dirname + '/prod'));
};

var config =  require('./config.js');
var dbListeners = require('hospitalrun-dblisteners');
var serverRoutes = require('hospitalrun-server-routes');

module.exports = function(app) {
  config.emberCLI = true;
  dbListeners(config);
  serverRoutes(app, config);
};

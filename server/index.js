var config =  require('./config.js');
var serverRoutes = require('hospitalrun-server-routes');

module.exports = function(app) {
  config.emberCLI = true;
  serverRoutes(app, config);
};

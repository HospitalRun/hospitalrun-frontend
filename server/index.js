var config =    include('./config.js');
var dbListeners = include('hospitalrun-dblisteners');
var serverRoutes = include('hospitalrun-server-routes');

module.exports = function(app) {
  config.emberCLI = true;
  dbListeners(config);
  serverRoutes(app, config);
};

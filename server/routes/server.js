module.exports = function(app) {
  var express = require('express');
  var serverRouter = express.Router();
  serverRouter.get('/', function(req, res) {
    res.send({ server: [] });
  });
  app.use('/api/server', serverRouter);
};

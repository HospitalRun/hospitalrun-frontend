var config = require('../config.js'),
    forward = require('../forward.js'),
    request = require('request');

module.exports = function(app){
    app.use(forward(/\/db\/(.*)/, config.couch_db_url));
};
// To use it create some files under `routes/`
// e.g. `server/routes/ember-hamsters.js`
//
// module.exports = function(app) {
//   app.get('/ember-hamsters', function(req, res) {
//     res.send('hello');
//   });
// };

var bodyParser = require('body-parser');
var globSync   = require('glob').sync;
var routes     = globSync('./routes/**/*.js', { cwd: __dirname }).map(require);

module.exports = function(app) {
  routes.forEach(function(route) { route(app); });
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  
};

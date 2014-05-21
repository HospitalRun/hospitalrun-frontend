/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  name: require('./package.json').name,

  minifyCSS: {
    enabled: true,
    options: {}
  },

  getEnvJSON: require('./config/environment')
});

// Use this to add additional libraries to the generated output files.
app.import('vendor/ember-data/ember-data.js');
app.import('vendor/pouchdb/dist/pouchdb-nightly.js');
app.import('vendor/ember-pouchdb-adapter/pouchdb_adapter.js');
app.import('vendor/ember-autofocus/dist/ember-autofocus.min.js');
app.import('vendor/ember-simple-auth/ember-simple-auth.js');
app.import('vendor/ember-easyForm/ember-easyForm-latest.js');
app.import('vendor/ember-validations/ember-validations-latest.js');
app.import('vendor/oauth-signature-js/dist/oauth-signature.js');
app.import('vendor/node-uuid/uuid.js');
app.import('vendor/bootstrap/dist/js/bootstrap.js');
app.import('vendor/JsBarcode/CODE128.js');
app.import('vendor/JsBarcode/JsBarcode.js');
app.import('vendor/dymo/DYMO.Label.Framework.1.2.6.js');

// If the library that you are including contains AMD or ES6 modules that
// you would like to import into your application please specify an
// object with the list of modules as keys along with the exports of each
// module as its value.
app.import('vendor/ic-ajax/dist/named-amd/main.js', {
  'ic-ajax': [
    'default',
    'defineFixture',
    'lookupFixture',
    'raw',
    'request',
  ]
});
      
app.import('vendor/bootstrap/dist/css/bootstrap.css');
app.import('vendor/bootstrap/dist/css/bootstrap-theme.css');

module.exports = app.toTree();

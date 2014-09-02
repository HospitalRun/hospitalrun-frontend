 /* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');
var writeManifest = require('broccoli-manifest');

var app = new EmberApp({
    sassOptions: {
        sourceMap: false    
    }    
});
  
//If we are not in the production environment, produce sourcemaps (the default if not specified)
if (app.env !== 'production') {
    app = new EmberApp();
}

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

app.import('vendor/ember-data/ember-data.js');
app.import('vendor/pouchdb/dist/pouchdb-nightly.js');
app.import('vendor/ember-pouchdb-adapter/pouchdb_adapter.js');
app.import('vendor/ember-autofocus/dist/ember-autofocus.min.js');
app.import('vendor/ember-simple-auth/ember-simple-auth.js');
app.import('vendor/ember-validations/ember-validations-latest.js');
app.import('vendor/oauth-signature-js/dist/oauth-signature.js');
app.import('vendor/node-uuid/uuid.js');
app.import('vendor/bootstrap/dist/js/bootstrap.js');
app.import('vendor/JsBarcode/CODE128.js');
app.import('vendor/JsBarcode/JsBarcode.js');
app.import('vendor/dymo/DYMO.Label.Framework.1.2.6.js');
app.import('vendor/ember-forms/dist/ember_forms.js');
app.import('vendor/moment/moment.js');
app.import('vendor/typeahead.js/dist/typeahead.bundle.js');
app.import('vendor/pikaday/pikaday.js');
app.import('vendor/ember-calendar/dist/ember-calendar.js');
app.import('vendor/pikaday/css/pikaday.css');
app.import('vendor/ember-calendar/dist/ember-calendar.css');

var completeTree = app.toTree();
module.exports = mergeTrees([completeTree, writeManifest(completeTree)]);
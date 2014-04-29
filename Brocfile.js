/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  name: require('./package.json').name,

  legacyFilesToAppend: [
    'jquery.js',
    'handlebars.js',
    'ember.js',
    'ic-ajax/dist/named-amd/main.js',
    'ember-data.js',
    'app-shims.js',
    'ember-resolver.js',
    'ember-load-initializers.js',
    'pouchdb-nightly.js',
    'pouchdb_adapter.js',
    'ember-autofocus.min.js',
    'ember-simple-auth.js',
    'ember-easyForm-latest.js',
    'ember-validations-latest.js',
    'oauth-signature-js/dist/oauth-signature.js',
    'uuid.js',
    'bootstrap.js'
  ],

  // AKA whitelisted modules
  ignoredModules: [
    'ember',
    'ember/resolver',
    'ember/load-initializers',
    'ic-ajax'
  ],

  // hack we can hopefully remove as the addon system improves
  importWhitelist: {
    'ember': ['default'],
    'ember/resolver': ['default'],
    'ember/load-initializers': ['default']
  },

  // hack
  getEnvJSON: require('./config/environment')
});

module.exports = app.toTree();

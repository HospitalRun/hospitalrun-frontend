'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const MergeTrees = require('broccoli-merge-trees');
const path = require('path');
const Funnel = require('broccoli-funnel');


module.exports = function(defaults) {

  let vendorTree = new Funnel('vendor');
  let bootStrapTree = new Funnel(
    path.dirname(require.resolve('bootstrap/dist/js/bootstrap.js')),
    {
      files: ['bootstrap.js'],
      destDir: 'bootstrap'
    }
  );

  let app = new EmberApp(defaults, {
    babel: {
      optional: ['es6.spec.symbols']
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    minifyJS: {
      options: {
        exclude: ['**/service-worker.js']
      }
    },
    trees: {
      vendor: new MergeTrees([vendorTree, bootStrapTree])
    }
  });

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
  app.import('vendor/bootstrap/bootstrap.js');
  app.import('vendor/dymo/DYMO.Label.Framework.1.2.6.js');
  app.import('bower_components/typeahead.js/dist/typeahead.bundle.js');
  app.import('bower_components/pikaday/pikaday.js');
  app.import('bower_components/filer.js/src/filer.js');
  app.import('bower_components/idb.filesystem/dist/idb.filesystem.min.js');
  app.import('bower_components/pikaday/css/pikaday.css');
  app.import('vendor/octicons/octicons/octicons.css');
  app.import('bower_components/pouchdb-load/dist/pouchdb.load.js');
  app.import('bower_components/webrtc-adapter/release/adapter.js');

  if (EmberApp.env() !== 'production') {
    app.import('bower_components/timekeeper/lib/timekeeper.js', { type: 'test' });
  }

  return app.toTree();
};

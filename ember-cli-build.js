'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const MergeTrees = require('broccoli-merge-trees');
const path = require('path');
const Funnel = require('broccoli-funnel');


module.exports = function (defaults) {

  let vendorTree = new Funnel('vendor');
  let bootStrapTree = new Funnel(
    path.dirname(require.resolve('bootstrap/dist/js/bootstrap.js')),
    {
      files: ['bootstrap.js'],
      destDir: 'bootstrap'
    }
  );

  let typeaheadTree = new Funnel(
    path.dirname(require.resolve('typeahead.js/dist/typeahead.bundle.min.js')),
    {
      files: ['typeahead.bundle.min.js'],
      destDir: 'typeahead'
    }
  );

  let pikadayTree = new Funnel(
    path.dirname(require.resolve('pikaday-time/pikaday.js')),
    {
      files: ['pikaday.js', '/css/pikaday.css'],
      destDir: 'pikaday'
    }
  );

  let filerTree = new Funnel(
    path.dirname(require.resolve('filer.js/dist/filer.min.js')),
    {
      files: ['filer.min.js'],
      destDir: 'filer'
    }
  );

  let fsTree = new Funnel(
    path.dirname(require.resolve('idb.filesystem.js/dist/idb.filesystem.min.js')),
    {
      files: ['idb.filesystem.min.js'],
      destDir: 'idb.filesystem.js'
    }
  );

  let pouchTree = new Funnel(
    path.dirname(require.resolve('pouchdb-load/dist/pouchdb.load.js')),
    {
      files: ['pouchdb.load.js'],
      destDir: 'pouchdb-load'
    }
  );

  let webtrcTree = new Funnel(
    path.dirname(require.resolve('webrtc-adapter/out/adapter.js')),
    {
      files: ['adapter.js'],
      destDir: 'webrtc-adapter'
    }
  );

  let timekeeperTree = new Funnel(
    path.dirname(require.resolve('timekeeper/lib/timekeeper.js')),
    {
      files: ['timekeeper.js'],
      destDir: 'timekeeper'
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
    'ember-cli-barcode': {
      include: 'code128'
    },
    trees: {
      vendor: new MergeTrees([
        vendorTree,
        bootStrapTree,
        typeaheadTree,
        pikadayTree,
        filerTree,
        fsTree,
        pouchTree,
        webtrcTree,
        timekeeperTree
      ])
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
  app.import('vendor/typeahead/typeahead.bundle.min.js');
  app.import('vendor/pikaday/css/pikaday.css');
  app.import('vendor/pikaday/pikaday.js');
  app.import('vendor/filer/filer.min.js');
  app.import('vendor/idb.filesystem.js/idb.filesystem.min.js');
  app.import('vendor/octicons/octicons/octicons.css');
  app.import('vendor/pouchdb-load/pouchdb.load.js');
  app.import('vendor/webrtc-adapter/adapter.js');

  if (EmberApp.env() !== 'production') {
    app.import('vendor/timekeeper/timekeeper.js', {type: 'test'});
  }

  return app.toTree();
};

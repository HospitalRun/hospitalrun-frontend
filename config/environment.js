/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'hospitalrun',
    environment: environment,
    baseURL: '/',
    locationType: 'hash', // Auto incompatible with google login right now
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  ENV.manifest = {
    enabled: true,
    appcacheFile: '/manifest.appcache',
    excludePaths: ['index.html', 'tests/index.html', 'robots.txt', 'crossdomain.xml', 'testem.js'],
    showCreateDate: true
  };

  ENV.serviceWorker = {
    enabled: true,
    debug: true,
    excludePaths: ['manifest.appcache'],
    swIncludeFiles: [
      'bower_components/pouchdb/dist/pouchdb.js'
    ]
  };

  return ENV;
};


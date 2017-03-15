/* eslint-env node */
/* eslint no-var: 0 */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'hospitalrun',
    environment,
    rootURL: '/',
    locationType: 'hash', // Using hash location type because it is more friendly for offline.
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.contentSecurityPolicy = {
    'connect-src': "'self'",
    'default-src': "'self'",
    'frame-src': "'self'",
    'img-src': "'self' filesystem: data: blob:",
    'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",
    'style-src': "'self' 'unsafe-inline'"
  };

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  ENV.i18n = {
    defaultLocale: 'en'
  };

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
      'node_modules/pouchdb/dist/pouchdb.js'
    ]
  };
  if (environment === 'production') {
    ENV.serviceWorker.debug = false;
  }
  if (environment === 'test') {
    ENV.serviceWorker.includeRegistration = false;
  }

  ENV.emberFullCalendar =  {
    schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
  };

  ENV.hospitalInfoDoc = {
    "_id": "option_2_print_header",
    "_rev": "1-4457555eacb405267c6d3b7a53d8521d",
    "data": {
      "value": {
        "facilityName": "Beit CURE International Hospital",
        "headerLine1": "PO Box 31236",
        "headerLine2": "Blantyre 3",
        "headerLine3": "+265 (0) 1 871 900 / +265 (0) 1 875 015 /+265 (0) 1 873 694 / +265 (0) 999 505 212",
        "logoURL": "https://curehospital.mw/wp-content/uploads/4/2012/11/CURE-Malawi-Logo_rgb_280_89.jpg"
      }
    }
  };
  return ENV;
};

'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'hospitalrun',
    environment,
    rootURL: process.env.EMBER_CLI_ELECTRON ? null : '/',
    locationType: 'hash', // Using hash location type because it is more friendly for offline.
    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: 'UA-TODO-HOSPITAL-RUN',
          // Use `analytics_debug.js` in development
          debug: environment === 'development',
          // Use verbose tracing of GA events
          trace: environment === 'development',
          // Ensure development env hits aren't sent to GA
          sendHitTask: environment !== 'development',
          // Specify Google Analytics plugins
          require: []
        }
      }
    ],
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
    'connect-src': "'self' www.google-analytics.com",
    'default-src': "'self'",
    'frame-src': "'self'",
    'img-src': "'self' filesystem: data: blob: www.google-analytics.com",
    'script-src': "'self' 'unsafe-inline' 'unsafe-eval' www.google-analytics.com",
    'style-src': "'self' 'unsafe-inline'"
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
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

  if (process.env.EMBER_CLI_ELECTRON) {
    ENV.serviceWorker = {
      enabled: false,
      includeRegistration: false
    };
  } else {
    ENV.serviceWorker = {
      enabled: true,
      debug: true,
      excludePaths: ['manifest.appcache'],
      swIncludeFiles: [
        'vendor/pouchdb-for-sw.js',
        require.resolve('sw-offline-google-analytics')
      ]
    };
    if (environment === 'production') {
      ENV.serviceWorker.debug = false;
    }
  }
  if (environment === 'test' && !process.env.EMBER_CLI_ELECTRON) {
    ENV.serviceWorker.enabled = true;
  }

  ENV.emberFullCalendar =  {
    includeScheduler: true,
    schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
  };

  return ENV;
};

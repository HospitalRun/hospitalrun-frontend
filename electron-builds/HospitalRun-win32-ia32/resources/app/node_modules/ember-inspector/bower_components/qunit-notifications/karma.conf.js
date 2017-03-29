/*jshint browser:false, node:true */

// Karma test runner configuration for all test suite
// see http://karma-runner.github.io/0.12/config/configuration-file.html

module.exports = function( config ) {
  "use strict";

  config.set( {
    frameworks: [ "qunit" ],
    files: [

      // Parent test suite
      "bower_components/qunit/qunit/qunit.css",
      "node_modules/karma-coverage/node_modules/istanbul/lib/object-utils.js",
      "tests/qunit-helpers.js",
      "tests/*.test.js"
    ].concat( [

      // Stubs
      "bower_components/qunit/qunit/qunit.js",
      "bower_components/sinon/index.js",
      "bower_components/rsvp/rsvp.min.js",
      "tests/stubs/*",
      "index.js"
    ].map( function( pattern ) {
      return { pattern: pattern, watched: true, included: false, served: true };
    } ) ),
    browsers: [ "PhantomJS" ],
    reporters: [ process.env.CI ? "dots" : "progress", "coverage" ],
    preprocessors: {
      "index.js": [ "coverage" ]
    },
    coverageReporter: {
      dir: "tests/coverage",
      reporters: [
        { type: "html", subdir: "html" },
        { type: "lcovonly", subdir: ".", file: "report.lcov" },
        { type: "text", subdir: ".", file: "report.txt" },
        { type: "text-summary", subdir: ".", file: "summary.txt" }
      ]
    },
    customLaunchers: {
      "PhantomJS_debug": {
        base: "PhantomJS",
        options: {
          windowName: "Custom PhantomJS",
          settings: {
            webSecurityEnabled: false
          }
        },
        flags: [
          "--remote-debugger-port=9000",
          "--remote-debugger-autorun=yes"
        ]
      }
    }
  } );
};

/*jshint node:true*/

module.exports = function() {
  return {
    /*
      `command` - a single command that, if set, will be the default command used by `ember-try`.
      P.S. The command doesn't need to be an `ember <something>` command, they can be anything.
      Keep in mind that this config file is JavaScript, so you can code in here to determine the command.
    */
    command: 'ember test --reporter xunit',
    /*
      `bowerOptions` - options to be passed to `bower`.
    */
    bowerOptions: ['--allow-root=true'],
    /*
      `npmOptions` - options to be passed to `npm`.
    */
    npmOptions: ['--loglevel=silent', '--no-shrinkwrap=true'],
    /*
      If set to true, the `versionCompatibility` key under `ember-addon` in `package.json` will be used to
      automatically generate scenarios that will deep merge with any in this configuration file.
    */
    useVersionCompatibility: true,
    scenarios: [
      {
        name: 'Ember 1.10 with ember-data',

        /*
          `command` can also be overridden at the scenario level.
        */
        command: 'ember test --filter ember-1-10',
        bower: {
          dependencies: {
            'ember': '1.10.0',
            'ember-data': '1.0.0-beta.15'
          }
        },
      },
      {
        name: 'Ember 2.11.0',
        /*
          `env` can be set per scenario, with environment variables to set for the command being run.
          This will be merged with process.env
       */
        env: {
          ENABLE_NEW_DASHBOARD: true
        },
        npm: {
          devDependencies: {
            'ember-source': '2.11.0'
          }
        }
      },
      {
        name: 'Ember canary with Ember-Data 2.3.0',
        /*
          `allowedToFail` - If true, if this scenario fails it will not fail the entire try command.
        */
        allowedToFail: true,
        npm: {
          devDependencies: {
            'ember-data': '2.3.0',

            // you can remove any package by marking `null`
            'some-optional-package': null
          }
        },
        bower: {
          dependencies: {
            'ember': 'components/ember#canary'
          },
          resolutions: {
            'ember': 'canary'
          }
        }
      },
      {
        name: 'Ember beta',
        bower: {
          dependencies: {
            'ember': 'components/ember#beta'
          },
          resolutions: { // Resolutions are only necessary when they do not match the version specified in `dependencies`
            'ember': 'beta'
          }
        }
      }
    ]
  };
};
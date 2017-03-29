module.exports = {
  scenarios: [
    {
      name: 'ember-1.10.0',
      dependencies: {
        "ember": "1.10.0"
      }
    },
    {
      name: 'ember-1.11.0',
      dependencies: {
        "ember": "1.11.0"
      }
    },
    {
      name: 'ember-1.12.1',
      dependencies: {
        "ember": "1.12.1"
      }
    },
    {
      name: 'ember-1.13.9',
      dependencies: {
        "ember": "1.13.9"
      }
    },
    {
      name: 'ember-2.0.0',
      dependencies: {
        "ember": "2.0.0"
      },
      resolutions: {
        "ember": "2.0.0"
      }
    },
    {
      name: 'ember-2.1.0-beta.2',
      dependencies: {
        "ember": "2.1.0-beta.2"
      },
      resolutions: {
        "ember": "2.1.0-beta.2"
      }
    },
    //{
    //  name: 'ember-canary',
    //  dependencies: {
    //    "ember": "components/ember#canary"
    //  }
    //}
  ]
};

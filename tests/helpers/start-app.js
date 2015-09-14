import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

import initializeTestHelpers from 'simple-auth-testing/test-helpers';
initializeTestHelpers();

export default function startApp(attrs) {
  var application;

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}

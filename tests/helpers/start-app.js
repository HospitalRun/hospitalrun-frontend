import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

import './run-with-pouch-dump';
import './authenticate-user';
import './select';
import './select-date';
import './wait-to-appear';

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}

import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

import './run-with-pouch-dump';
import './authenticate-user';
import './select';
import './select-date';
import './typeahead-fillin';
import './wait-to-appear';

function createTranslationWrapper(original, context) {
  function t(str, data) {
    let result = original.call(context, str, data);
    if (result.indexOf && result.indexOf('Missing translation') > -1) {
      throw new Error(result);
    }

    return result.string || result;
  }

  return t;
}

export default function startApp(attrs) {
  let application;

  let attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  let translationService = application.__container__.lookup('service:i18n');
  application.__container__.lookup('service:i18n').t = createTranslationWrapper(translationService.t, translationService);

  return application;
}

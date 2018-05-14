import Application from '../../app';
import config from '../../config/environment';
import { merge } from '@ember/polyfills';
import { run } from '@ember/runloop';

import './authenticate-user';
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
  let attributes = merge({}, config.APP);
  attributes.autoboot = true;
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();

    let translationService = application.__container__.lookup('service:i18n');
    application.__container__.lookup('service:i18n').t = createTranslationWrapper(translationService.t, translationService);

    return application;
  });
}

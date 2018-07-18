import Ember from 'ember';
import Locale from 'ember-i18n/utils/locale';
import config from '../../config/environment';

const DEFAULT_LOCALE = config.i18n.defaultLocale;

let missingMessage = function(locale, key, data) {

  console.log(locale)

  if (locale === DEFAULT_LOCALE || window.env === 'development') {
    return `Missing translation: ${key}`;
  } else {

    Ember.Logger.warn("Missing translation: " + key);

    // NOTE This relies on internal APIs and is brittle.
    // Emulating the internals of ember-i18n's translate method
    const i18n = this;
    const count = Ember.get(data, 'count');
    const defaults = Ember.makeArray(Ember.get(data, 'default'));
    defaults.unshift(key);
    const localeObj = new Locale(DEFAULT_LOCALE, Ember.getOwner(i18n));
    const template = localeObj.getCompiledTemplate(defaults, count);
    return template(data);
  }
};

export default missingMessage;

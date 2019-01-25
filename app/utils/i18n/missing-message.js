import Ember from 'ember';
import Locale from 'ember-intl/utils/locale';
import config from '../../config/environment';

const DEFAULT_LOCALE = config.intl.defaultLocale;

let missingMessage = function(locale, key, data) {
  if (locale === DEFAULT_LOCALE || window.env === 'development') {
    return `Missing translation: ${key}`;
  } else {

    Ember.Logger.warn(`Missing translation: ${key}`);

    // NOTE This relies on internal APIs and is brittle.
    // Emulating the internals of ember-intl's translate method
    let intl = this;
    let count = Ember.get(data, 'count');
    let defaults = Ember.makeArray(Ember.get(data, 'default'));
    defaults.unshift(key);
    let localeObj = new Locale(DEFAULT_LOCALE, Ember.getOwner(intl));
    let template = localeObj.getCompiledTemplate(defaults, count);
    return template(data);
  }
};

export default missingMessage;

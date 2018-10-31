import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  intl: service(),
  languagePreference: service(),
  selectedLanguage: alias('i18n.locale'),

  languageOptions: computed('i18n.locale', function() {
    let intl = this.get('intl');
    // Hacking around the fact that i18n
    // has no support for t(key, locale).
    let currentLocale = i18n.get('locale');
    let options = i18n.get('locales').map((item) => {
      i18n.set('locale', item);
      return {
        id: item,
        name: i18n.t('languageName')
      };
    });
    i18n.set('locale', currentLocale);
    return options;
  }),

  onFinish: () => {},

  actions: {
    selectLanguage(i18n) {
      this.get('languagePreference').saveUserLanguagePreference(i18n);
      this.get('onFinish')();
    }
  }
});
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  intl: service(),
  languagePreference: service(),
  selectedLanguage: alias('intl.locale'),

  languageOptions: computed('intl.locale', function() {
    let intl = this.get('intl');
    // Hacking around the fact that intl
    // has no support for t(key, locale).
    let currentLocale = intl.get('locale');
    let options = intl.get('locales').map((item) => {
      intl.set('locale', item);
      return {
        id: item,
        name: intl.t('languageName')
      };
    });
    intl.set('locale', currentLocale);
    return options;
  }),

  onFinish: () => {},

  actions: {
    selectLanguage(intl) {
      this.get('languagePreference').saveUserLanguagePreference(intl);
      this.get('onFinish')();
    }
  }
});
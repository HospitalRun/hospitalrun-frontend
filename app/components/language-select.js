import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  intl: service(),
  languagePreference: service(),
  selectedLanguage: computed('intl.locale', function() {
    let locale = this.get('intl.locale');
    return typeof locale === 'string' ? locale : locale.get('firstObject');
  }),

  languageOptions: computed('intl.locale', function() {
    let intl = this.get('intl');
    let options = intl.get('locales').map((locale) => {
      return {
        id: locale,
        name: intl.lookup('languageName', locale)
      };
    });
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

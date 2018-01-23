import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  languagePreference: Ember.inject.service(),
  selectedLanguage: Ember.computed.alias('i18n.locale'),

  languageOptions: Ember.computed('i18n.locale', function() {
    let i18n = this.get('i18n');
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
import Ember from 'ember';

export default Ember.Component.extend({
  i18n: Ember.inject.service(),
  languagePreference: Ember.inject.service(),
  selectedLanguage: Ember.computed.alias('i18n.locale'),

  languageOptions: Ember.computed('i18n.locale', function() {
    let i18n = this.get('i18n');
    return i18n.get('locales').map((item) => {
      return {
        id: item,
        name: i18n.t(`languages.${item}`)
      };
    });
  }),

  onFinish: null,

  actions: {
    selectLanguage(i18n) {
      this.get('languagePreference').setUserI18nPreference(i18n);
      this.get('onFinish')();
    }
  }

});

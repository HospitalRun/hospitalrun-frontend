import Ember from 'ember';

export default Ember.Component.extend({
  config: Ember.inject.service(),
  i18n: Ember.inject.service(),
  languageOptions: Ember.computed(function() {
    return Object.keys(this.get('languageMap'));
  }),
  onFinish: null,
  languageMap: Ember.computed(() => {
    return {
      'English': 'en',
      'French': 'fr'
    };
  }),
  selectedLanguage: null,

  _setUserLanguageChoice(language) {
    let configDB = this.get('config.configDB');
    configDB.get('current_user').then((user) => {
      configDB.put({
        lang: language,
        _id: user._id,
        _rev: user._rev,
        value: user.value
      });
    });
  },

  actions: {
    selectLanguage(_, selection) {
      this.set('selectedLanguage', this.get('languageMap')[selection]);
      this._setUserLanguageChoice(this.get('selectedLanguage'));
      this.set('i18n.locale', this.get('selectedLanguage'));
      this.get('onFinish')();
    }
  }

});

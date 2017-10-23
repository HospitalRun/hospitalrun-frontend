import Ember from 'ember';

export default Ember.Component.extend({
  config: Ember.inject.service(),
  i18n: Ember.inject.service(),

  languageOptions: function() {
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
  }.property('currentLanguage'),

  onFinish: null,

  _setUserLanguage(language) {
    let configDB = this.get('config.configDB');
    configDB.get('current_user').then((user) => {
      user.i18n = language;
      configDB.put(user);
    });
  },

  actions: {
    selectLanguage(selection) {
      this._setUserLanguage(selection);
      this.set('i18n.locale', selection);
      this.get('onFinish')();
    }
  }

});

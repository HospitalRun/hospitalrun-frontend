import Ember from 'ember';
// import { translationMacro as t } from 'ember-i18n';

export default Ember.Component.extend({
  config: Ember.inject.service(),
  i18n: Ember.inject.service(),
  languageOptions: Ember.computed('i18n.locale', function() {
    // debugger;
    return [
      {id: 'en', name: 'languages.english'},
      {id: 'fr', name: 'languages.french'}
    ];
  }),
  onFinish: null,
  selectedLanguage: null,

  _setUserLanguageChoice(language) {
    let configDB = this.get('config.configDB');
    configDB.get('current_user').then((user) => {
      configDB.put({
        i18n: language,
        _id: user._id,
        _rev: user._rev,
        value: user.value
      });
    });
  },

  actions: {
    selectLanguage(selection) {
      this.set('selectedLanguage', selection);
      this._setUserLanguageChoice(selection);
      this.set('i18n.locale', selection);
      this.get('onFinish')();
    }
  }

});

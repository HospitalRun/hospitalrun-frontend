import Ember from 'ember';

export default Ember.Component.extend({
  config: Ember.inject.service(),

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

  _storeUserI18n(language) {
    let configDB = this.get('config.configDB');
    configDB.get('current_user').then((user) => {
      let username = (typeof user.value === 'string') ? user.value : user.value.name;
      configDB.get('preferences').then((db) => {
        db[username].i18n = language;
        configDB.put(db);
      }).catch((err) => {
        console.log(err);
        this._initPreferencesDB.bind(this, username, language)();
      });
    });
  },

  _initPreferencesDB(username, i18n) {
    let configDB = this.get('config.configDB');
    let doc = {
      _id: 'preferences'
    };
    doc[username] = {
      i18n: i18n || 'en'
    };
    configDB.put(doc);
  },

  actions: {
    selectLanguage(selection) {
      this._storeUserI18n(selection);
      this.set('i18n.locale', selection);
      this.get('onFinish')();
    }
  }

});

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

  _setUserLanguage(language) {
    let configDB = this.get('config.configDB');
    configDB.get('current_user').then((user) => {
      let username = (typeof user.value === 'string') ? user.value : user.value.name;
      configDB.get('preferences').then((db) => {
        this._updateUserI18NPreference.bind(this, db, username, language)();
      }).catch(() => {
        this._initUserI18nPreference.bind(this, username, language)();
      });
    });
  },

  _updateUserI18NPreference(db, username, language) {
    let configDB = this.get('config.configDB');
    db.options = db.options || {};
    let db_key = `${username}_i18n`;
    db.options[db_key] = language;
    configDB.put(db);
  },

  _initUserI18nPreference(username, i18n) {
    let configDB = this.get('config.configDB');
    let doc = {
      _id: 'preferences',
      options: {
      }
    }
    doc.options[username + "_i18n"] = i18n;
    configDB.put(doc);
  },

  actions: {
    selectLanguage(selection) {
      this._setUserLanguage(selection);
      this.set('i18n.locale', selection);
      this.get('onFinish')();
    }
  }

});

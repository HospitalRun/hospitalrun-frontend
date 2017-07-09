import Ember from 'ember';

export default Ember.Component.extend({
  config: Ember.inject.service(),
  i18n: Ember.inject.service(),

  languageOptions: function() {
    let i18n = this.get('i18n');
    return i18n.get('locales').map((item) => {
      return {
        id: item,
        name: i18n.t(`languages.${item}`)
      };
    });
  }.property('currentLanguage'),

  onFinish: null,

  _setUserLanguage(language) {
    let configDB = this.get('config.configDB');
    let doc;
    configDB.get('current_user').then((user) => {
      let username = user.value;
      configDB.get('preferences').then((db) => {
        db.options = db.options || {};
        let db_key = `${username}_i18n`;
        db.options[db_key] = language;
        configDB.put(db);
      }).catch((err) => {
        doc = {
          _id: 'preferences',
          options: {
          }
        }
        doc.options[username + "_i18n"] = language;
        configDB.put(doc);
      });
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

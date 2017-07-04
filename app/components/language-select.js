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
    let username = this._setUsername();
    configDB.get('preferences').then(db => {
      db.options = {};
      db['options'][username + "_i18n"] = language;
      configDB.put(db).catch(err => {
        console.log("ERROR UPDATING PREFERENCES:", err);
      });
    }).catch(err => {
      console.log("ERROR RETRIEVING PREFERENCES DATABASE:", err);
      doc = {
        _id: 'preferences',
        options: {
        }
      }
      doc.options[username + "_i18n"] = language;
      configDB.put(doc).catch(err => {
        console.log("ERROR SAVING NEW PREFERENCE DATABASE:", err);
      });
    });
  },

  _setUsername() {
    let configDB = this.get('config.configDB');
    configDB.get('current_user').then((user) => {
      return user.value;
    }).catch(err => {
      console.log("ERROR RETRIEVING USER FROM DATABASE:", err);
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

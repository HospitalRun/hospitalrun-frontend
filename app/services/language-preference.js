import Ember from 'ember';

export default Ember.Service.extend({

  i18n: Ember.inject.service(),
  config: Ember.inject.service(),

  setSessionI18nPreference() {
    let setSessionI18n = (results) => {
      let { preferences, userName } = results;
      if (userName && preferences[userName]) {
        Ember.run(() => {
          this.set('i18n.locale', preferences[userName].i18n);
        });
      }
    };
    this._fetchUserPreferencesDB().then(setSessionI18n);
  },

  setUserI18nPreference(i18n) {
    let setUserI18n = (results) => {
      let { preferences, userName } = results;
      if (preferences[userName] === undefined) {
        preferences[userName] = {};
      }
      preferences[userName].i18n = i18n;
      this.get('config.configDB').put(preferences).then(() => {
        Ember.run(() => {
          this.set('i18n.locale', i18n);
        });
      }).catch((err) => {
        console.log(err);
      });
    };
    this._fetchUserPreferencesDB().then(setUserI18n);
  },

  _fetchUserPreferencesDB() {
    let configDB = this.get('config.configDB');
    let userName, preferences;
    return configDB.get('current_user').then((user) => {
      userName = this._fetchUsername(user);
      // TODO: this block and then next `then` block could be combined (?)
    }).then(() => {
      preferences = configDB.get('preferences');
      return Ember.RSVP.hash({ userName, preferences });
    }).catch((err) => {
      if (err.status === 404) {
        preferences = this._initPreferencesDB(userName, 'en');
        return Ember.RSVP.hash({ userName, preferences });
      } else {
        console.log(err);
      }
    });
  },

  _fetchUsername(user) {
    switch (typeof user.value) {
      case 'string':
        return user.value;
      case 'object':
        return user.value.name;
      default:
        return undefined;
    }
  },

  _initPreferencesDB(username, i18n) {
    let doc = {
      _id: 'preferences'
    };
    if (username != undefined) {
      doc[username] = {
        i18n: i18n || 'en'
      };
    }
    return this.get('config.configDB').put(doc).catch((err) => {
      console.log(err);
    });
  }
});

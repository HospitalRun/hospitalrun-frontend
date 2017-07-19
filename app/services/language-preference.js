import Ember from 'ember';

export default Ember.Service.extend({

  i18n: Ember.inject.service(),
  config: Ember.inject.service(),

  getUsername(user) {
    let username = 'default';
    if (typeof user.name === 'string') {
      username = user.name;
    } else if (typeof user.value === 'string') {
      username = user.value;
    } else if (user.value != undefined && typeof user.value.name === 'string') {
      username = user.value.name;
    }
    return username;
  },

  initUserI18nPreference() {
    let configDB = this.get('config.configDB');
    let username;
    configDB.get('current_user').then((user) => {
      username = this.getUsername(user);
      let preferences = configDB.get('preferences');
      let promises = { username, preferences };
      return Ember.RSVP.hash(promises);
    }).then((promises) => {
      // TODO: change this from hard-coded 'en' to something like 'ENV.i18n.defaultLocale'
      let { preferences, username } = promises;
      let language = preferences[username].i18n || 'en';
      this.set('i18n.locale', language);
    });
  }
});

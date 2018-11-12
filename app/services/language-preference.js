import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { hash } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import Ember from 'ember';
import config from '../config/environment';
import { walkConfigs, setRTL } from '../utils/locale-utils';

export const DEFAULT_LANGUAGE = config.intl.defaultLocale || 'en';

export default Service.extend({
  intl: service(),
  config: service(),

  loadUserLanguagePreference() {
    return hash({
      user: this.getConfig().getCurrentUser(),
      preferences: this.fetchOrCreatePreferences()
    }).then(({ user, preferences }) => user && user.name && preferences[user.name] && preferences[user.name].intl || DEFAULT_LANGUAGE)
      .catch(() => DEFAULT_LANGUAGE)
      .then(this.setApplicationLanguage.bind(this));
  },

  setApplicationLanguage(selectedLanguage) {

    // Whenever the languague changes, apply RTL settings to application
    let currentConfig = walkConfigs(selectedLanguage, getOwner(this)) || {};
    if (currentConfig.class) {
      setRTL(currentConfig.class.rtl);
    }

    return run(() => this.set('intl.locale', selectedLanguage));
  },

  saveUserLanguagePreference(selectedLanguage) {
    this.setApplicationLanguage(selectedLanguage);
    return hash({
      user: this.getConfig().getCurrentUser(),
      preferences: this.fetchOrCreatePreferences().then(
        (preferences) => preferences,
        () => ({
          _id: 'preferences'
        })
      )
    }).then(({ user, preferences }) => {
      preferences[user.name] = preferences[user.name] || {};
      preferences[user.name].intl = selectedLanguage;
      return this.getConfig().getConfigDB().put(preferences);
    }).catch((err) => Ember.Logger.error(err));
  },

  fetchOrCreatePreferences() {
    return this.getConfig().getConfigDB().get('preferences');
  },

  getConfig() {
    return this.get('config');
  }
});

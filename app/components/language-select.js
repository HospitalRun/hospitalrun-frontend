<<<<<<< HEAD
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
=======
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  i18n: service(),
  languagePreference: service(),
  selectedLanguage: alias('i18n.locale'),

  languageOptions: computed('i18n.locale', function() {
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
  }),

  onFinish: () => {},

  actions: {
    selectLanguage(i18n) {
      this.get('languagePreference').saveUserLanguagePreference(i18n);
      this.get('onFinish')();
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea

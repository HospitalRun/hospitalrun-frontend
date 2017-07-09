import Ember from 'ember';
import { isAbortError, isTimeoutError } from 'ember-ajax/errors';

let LoginController = Ember.Controller.extend({
  session: Ember.inject.service(),
  config: Ember.inject.service(),
  i18n: Ember.inject.service(),

  errorMessage: null,
  identification: null,
  password: null,

  _initUserI18nPreference: function() {
    let configDB = this.get('config.configDB');
    let username;
    configDB.get('current_user').then((user) => {
      username = user.value.name;
      let db_key = `${username}_i18n`;
      configDB.get('preferences').then((doc) => {
        let language = doc.options[db_key] || 'en';
        this.set('i18n.locale', language);
      }).catch(err => {
        let doc = {
          _id: 'preferences',
          options: {
          }
        };
        doc.options[db_key] = 'en';
        configDB.put(doc);
      })
    });
  },

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:custom', {
        identification,
        password
      }).then(this._initUserI18nPreference.bind(this)).catch((err) => {
        if (isAbortError(err) || isTimeoutError(err)) {
          this.set('errorMessage', false);
          this.set('offlineError', true);
        } else {
          this.set('errorMessage', true);
          this.set('offlineError', false);
        }
      });
    }
  }
});

export default LoginController;

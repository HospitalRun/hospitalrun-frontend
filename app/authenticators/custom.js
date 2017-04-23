import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import crypto from 'npm:crypto';

const {
  computed: {
    alias
  },
  get,
  RSVP
} = Ember;

export default BaseAuthenticator.extend({
  config: Ember.inject.service(),
  database: Ember.inject.service(),
  serverEndpoint: '/db/_session',
  useGoogleAuth: false,

  standAlone: alias('config.standAlone'),
  usersDB: alias('database.usersDB'),

  /**
    @method absolutizeExpirationTime
    @private
  */
  _absolutizeExpirationTime(expiresIn) {
    if (!Ember.isEmpty(expiresIn)) {
      return new Date((new Date().getTime()) + (expiresIn - 5) * 1000).getTime();
    }
  },

  _checkUser(user) {
    return new RSVP.Promise((resolve, reject) => {
      this._makeRequest('POST', { name: user.name }, '/chkuser').then((response) => {
        if (response.error) {
          reject(response);
        }
        user.displayName = response.displayName;
        user.role = response.role;
        user.prefix = response.prefix;
        resolve(user);
      }, () => {
        // If chkuser fails, user is probably offline; resolve with currently stored credentials
        resolve(user);
      });
    });
  },

  _getPromise(type, data) {
    return new RSVP.Promise(function(resolve, reject) {
      this._makeRequest(type, data).then(function(response) {
        Ember.run(function() {
          resolve(response);
        });
      }, function(xhr) {
        Ember.run(function() {
          reject(xhr.responseJSON || xhr.responseText);
        });
      });
    }.bind(this));
  },

  _makeRequest(type, data, url) {
    if (!url) {
      url = this.serverEndpoint;
    }
    return Ember.$.ajax({
      url,
      type,
      data,
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded',
      xhrFields: {
        withCredentials: true
      }
    });
  },

  /**
   Authenticate using google auth credentials or credentials from couch db.
   @method authenticate
   @param {Object} credentials The credentials to authenticate the session with
   @return {RSVP.Promise} A promise that resolves when an access token is successfully acquired from the server and rejects otherwise
   */
  authenticate(credentials) {
    let standAlone = get(this, 'standAlone');
    if (standAlone === true) {
      return this._authenticateStandAlone(credentials);
    }
    if (credentials.google_auth) {
      this.useGoogleAuth = true;
      let sessionCredentials = {
        google_auth: true,
        consumer_key: credentials.params.k,
        consumer_secret: credentials.params.s1,
        token: credentials.params.t,
        token_secret: credentials.params.s2,
        name: credentials.params.i
      };
      return new RSVP.Promise((resolve, reject) => {
        this._checkUser(sessionCredentials).then((user) => {
          resolve(user);
          this.get('config').setCurrentUser(user.name);
        }, reject);
      });
    }

    return new Ember.RSVP.Promise((resolve, reject) => {
      let username = credentials.identification;
      if (typeof username === 'string' && username) {
        username = username.trim();
      }
      let data = { name: username, password: credentials.password };
      this._makeRequest('POST', data).then((response) => {
        response.name = data.name;
        response.expires_at = this._absolutizeExpirationTime(600);
        this._checkUser(response).then((user) => {
          this.get('config').setCurrentUser(user.name);
          let database = this.get('database');
          database.setup({}).then(() => {
            resolve(user);
          }, reject);
        }, reject);
      }, function(xhr) {
        reject(xhr.responseJSON || xhr.responseText);
      });
    });
  },

  invalidate() {
    let standAlone = get(this, 'standAlone');
    if (this.useGoogleAuth || standAlone) {
      return RSVP.resolve();
    } else {
      return this._getPromise('DELETE');
    }
  },

  restore(data) {
    if (window.ELECTRON) { // config service has not been setup yet, so config.standAlone not available yet
      return RSVP.resolve(data);
    }
    return new RSVP.Promise((resolve, reject) => {
      let now = (new Date()).getTime();
      if (!Ember.isEmpty(data.expires_at) && data.expires_at < now) {
        reject();
      } else {
        if (data.google_auth) {
          this.useGoogleAuth = true;
        }
        this._checkUser(data).then(resolve, reject);
      }
    });
  },

  _authenticateStandAlone(credentials) {
    let usersDB = get(this, 'usersDB');
    return new RSVP.Promise((resolve, reject) => {
      usersDB.get(`org.couchdb.user:${credentials.identification}`).then((user) => {
        let { salt, iterations, derived_key } = user;
        let { password } = credentials;
        this._checkPassword(password, salt, iterations, derived_key, (error, isCorrectPassword) => {
          if (error) {
            reject(error);
          }
          if (!isCorrectPassword) {
            reject(new Error('UNAUTHORIZED'));
          }
          user.role = this._getPrimaryRole(user);
          resolve(user);
        });
      }, reject);
    });
  },

  // Based on https://github.com/hoodiehq/hoodie-account-server-api/blob/master/lib/utils/validate-password.js
  _checkPassword(password, salt, iterations, derivedKey, callback) {
    crypto.pbkdf2(password, salt, iterations, 20, 'sha1', function(error, derivedKeyCheck) {
      if (error) {
        return callback(error);
      }
      callback(null, derivedKeyCheck.toString('hex') === derivedKey);
    });
  },

  _getPrimaryRole(user) {
    let primaryRole = '';
    if (user.roles) {
      user.roles.forEach((role) => {
        if (role !== 'user' && role !== 'admin') {
          primaryRole = role;
        }
      });
    }
    return primaryRole;
  }

});

import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { get } from '@ember/object';
import RSVP from 'rsvp';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';
import crypto from 'npm:crypto';
import MapOauthParams from 'hospitalrun/mixins/map-oauth-params';
import OAuthHeaders from 'hospitalrun/mixins/oauth-headers';

export default BaseAuthenticator.extend(MapOauthParams, OAuthHeaders, {
  ajax: service(),
  config: service(),
  database: service(),
  serverEndpoint: '/auth/login',

  standAlone: alias('config.standAlone'),
  usersDB: alias('database.usersDB'),

  _checkUser(user, oauthConfigs) {
    return new RSVP.Promise((resolve, reject) => {
      let headers = this.getOAuthHeaders(oauthConfigs);
      this._makeRequest({ name: user.name }, '/chkuser', headers).then((response) => {
        if (response.error) {
          reject(response);
        }
        user.displayName = response.displayName;
        user.role = response.role;
        user.prefix = response.prefix;
        resolve(user);
      }).catch(() => {
        // If chkuser fails, user is probably offline; resolve with currently stored credentials
        resolve(user);
      });
    });
  },

  _finishAuth(user, oauthConfigs) {
    let database = this.get('database');
    return database.setup().then(() => {
      user.oauthConfigs = oauthConfigs;
      return user;
    });
  },

  _makeRequest(data, url, headers, method) {
    if (!url) {
      url = this.serverEndpoint;
    }
    let ajax = get(this, 'ajax');
    let params = {
      type: 'POST',
      data,
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded',
      xhrFields: {
        withCredentials: true
      }
    };
    if (method) {
      params.type = method;
    }
    if (headers) {
      params.headers = headers;
    }

    return ajax.request(url, params);
  },

  _saveOAuthConfigs(params) {
    let config = get(this, 'config');
    let oauthConfigs = this.mapOauthParams(params);
    return config.saveOauthConfigs(oauthConfigs).then(() => {
      return oauthConfigs;
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
      return this._saveOAuthConfigs(credentials.params).then((oauthConfigs) => {
        return this._checkUser({ name: credentials.params.i }, oauthConfigs).then((user) => {
          return this._finishAuth(user, oauthConfigs);
        });
      });
    }

    let username = this._getUserName(credentials);
    let data = { name: username, password: credentials.password };
    return this._makeRequest(data).then((user) => {
      if (user.error) {
        throw new Error(user.errorResult || 'Unauthorized user');
      }
      let userInfo = {
        displayName: user.displayName,
        prefix: user.prefix,
        role: user.role
      };
      userInfo.name = username;

      return this._saveOAuthConfigs(user).then((oauthConfigs) => {
        return this._finishAuth(userInfo, oauthConfigs);
      });
    });
  },

  invalidate(data) {
    let standAlone = get(this, 'standAlone');
    if (this.useGoogleAuth || standAlone) {
      return RSVP.resolve();
    } else {
      // Ping the remote db to make sure we still have connectivity before logging off.
      let headers = this.getOAuthHeaders(data.oauthConfigs);
      let remoteDBUrl = get(this, 'database').getRemoteDBUrl();
      return this._makeRequest({}, remoteDBUrl, headers, 'GET');
    }
  },

  restore(data) {
    if (window.ELECTRON) { // config service has not been setup yet, so config.standAlone not available yet
      return RSVP.resolve(data);
    }
    return this._checkUser(data, data.oauthConfigs);
  },

  _authenticateStandAlone(credentials) {
    let usersDB = get(this, 'usersDB');
    return new RSVP.Promise((resolve, reject) => {
      let username = this._getUserName(credentials);
      usersDB.get(`org.couchdb.user:${username}`).then((user) => {
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
          this._finishAuth(user, {}).then(resolve, reject);
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
  },

  _getUserName(credentials) {
    let username = credentials.identification;
    if (typeof username === 'string' && username) {
      username = username.trim();
    }
    return username;
  }

});

import { alias } from '@ember/object/computed';
import Service, { inject as service } from '@ember/service';
import RSVP, { Promise as EmberPromise, all } from 'rsvp';
import { run } from '@ember/runloop';
import { set, get } from '@ember/object';

export default Service.extend({
  configDB: null,
  database: service(),
  session: service(),
  languagePreference: service(),
  sessionData: alias('session.data'),
  standAlone: false,
  needsUserSetup: false,
  markUserSetupComplete() {
    if (get(this, 'needsUserSetup') === true) {
      set(this, 'needsUserSetup', false);
      let config = this.get('configDB');
      return new RSVP.Promise(function(resolve, reject) {
        config.put({ _id: 'config_user_setup_flag', value: false }, function(err, doc) {
          if (err) {
            reject(err);
          }
          resolve(doc);
        });
      });
    } else {
      return RSVP.resolve(true);
    }
  },
  setup() {
    let replicateConfigDB = this.replicateConfigDB.bind(this);
    let loadConfig = this.loadConfig.bind(this);
    let db = this.createDB();
    this.set('configDB', db);

    if (window.ELECTRON) {
      this.set('standAlone', true);
    }
    if (this.get('standAlone') === false) {
      return replicateConfigDB(db).then(loadConfig);
    } else {
      return loadConfig();
    }
  },
  createDB() {
    return new PouchDB('config');
  },
  replicateConfigDB(db) {
    let promise = new RSVP.Promise((resolve) => {
      let url = `${document.location.protocol}//${document.location.host}/db/config`;
      db.replicate.from(url).then(resolve).catch(resolve);
    });
    return promise;
  },
  loadConfig() {
    let config = this.get('configDB');
    let options = {
      include_docs: true,
      keys: [
        'config_consumer_key',
        'config_consumer_secret',
        'config_disable_offline_sync',
        'config_external_search',
        'config_oauth_token',
        'config_token_secret',
        'config_use_google_auth'
      ]
    };
    return new EmberPromise(function(resolve, reject) {
      config.allDocs(options, function(err, response) {
        if (err) {
          console.log('Could not get configDB configs:', err);
          reject(err);
        }
        let configObj = {};
        for (let i = 0; i < response.rows.length; i++) {
          if (!response.rows[i].error && response.rows[i].doc) {
            configObj[response.rows[i].id] = response.rows[i].doc.value;
          }
        }
        resolve(configObj);
      });
    }, 'getting configuration from the database');
  },
  getFileLink(id) {
    let config = this.get('configDB');
    return new EmberPromise(function(resolve, reject) {
      config.get(`file-link_${id}`, function(err, doc) {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  },
  removeFileLink(id) {
    let config = this.get('configDB');
    return this.getFileLink(id).then(function(fileLink) {
      config.remove(fileLink);
    });
  },
  saveFileLink(fileName, id) {
    let config = this.get('configDB');
    return new EmberPromise(function(resolve, reject) {
      config.put({ fileName, _id: `file-link_${id}` }, function(err, doc) {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  },
  saveOauthConfigs(configs) {
    let configDB = this.get('configDB');
    let configKeys = Object.keys(configs);
    let savePromises = [];
    return this._getOauthConfigs(configKeys).then(function(records) {
      configKeys.forEach(function(key) {
        let configRecord = records.rows.findBy('key', key);
        if (!configRecord || !configRecord.doc) {
          configRecord = {
            _id: key,
            value: configs[key]
          };
        } else {
          configRecord = configRecord.doc;
          configRecord.value = configs[key];
        }
        savePromises.push(configDB.put(configRecord));
      });
      return all(savePromises);
    });
  },
  useGoogleAuth() {
    return this.getConfigValue('use_google_auth', false);
  },

  getPatientPrefix() {
    return this.getConfigValue('patient_id_prefix', 'P');
  },

  getConfigDB() {
    return this.get('configDB');
  },

  getConfigValue(id, defaultValue) {
    let configDB = this.get('configDB');
    return new EmberPromise(function(resolve) {
      configDB.get(`config_${id}`).then(function(doc) {
        run(null, resolve, doc.value);
      })
        .catch(function() {
          run(null, resolve, defaultValue);
        });
    }, `get ${id} from config database`);
  },

  _getOauthConfigs(configKeys) {
    let configDB = this.get('configDB');
    let options = {
      include_docs: true,
      keys: configKeys
    };
    return configDB.allDocs(options);
  },

  getCurrentUser() {
    let sessionData = this.get('sessionData');
    return sessionData.authenticated;
  }
});

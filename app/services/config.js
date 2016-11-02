import Ember from 'ember';

const { inject, run } = Ember;

export default Ember.Service.extend({
  configDB: null,
  database: inject.service(),
  session: inject.service(),
  sessionData: Ember.computed.alias('session.data'),

  setup() {
    let replicateConfigDB = this.replicateConfigDB.bind(this);
    let loadConfig = this.loadConfig.bind(this);
    let db = this.createDB();
    this.set('configDB', db);
    this.setCurrentUser();
    return replicateConfigDB(db).then(loadConfig);
  },

  createDB() {
    return new PouchDB('config');
  },
  replicateConfigDB(db) {
    let promise = new Ember.RSVP.Promise((resolve) => {
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
        'config_oauth_token',
        'config_token_secret',
        'config_use_google_auth'
      ]
    };
    return new Ember.RSVP.Promise(function(resolve, reject) {
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
    return new Ember.RSVP.Promise(function(resolve, reject) {
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
    return new Ember.RSVP.Promise(function(resolve, reject) {
      config.put({ fileName }, `file-link_${id}`, function(err, doc) {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  },
  saveOauthConfigs: function(configs) {
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
      return Ember.RSVP.all(savePromises);
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
    return new Ember.RSVP.Promise(function(resolve) {
      configDB.get(`config_${id}`).then(function(doc) {
        run(null, resolve, doc.value);
      })
        .catch(function() {
          run(null, resolve, defaultValue);
        });
    }, `get ${id} from config database`);
  },

  _getOauthConfigs: function(configKeys) {
    let configDB = this.get('configDB');
    let options = {
      include_docs: true,
      keys: configKeys
    };
    return configDB.allDocs(options);
  },

  setCurrentUser: function(userName) {
    let config = this.get('configDB');
    let sessionData = this.get('sessionData');
    if (!userName && sessionData.authenticated) {
      userName = sessionData.authenticated.name;
    }
    config.get('current_user').then((doc) => {
      doc.value = userName;
      config.put(doc);
    }).catch(() => {
      config.put({
        _id: 'current_user',
        value: userName
      });
    });
  }

});

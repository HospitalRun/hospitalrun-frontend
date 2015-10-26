import Ember from 'ember';

const { inject, run } = Ember;

export default Ember.Service.extend({
  configDB: null,
  database: inject.service(),

  setup() {
    const replicateConfigDB = this.replicateConfigDB.bind(this);
    const loadConfig = this.loadConfig.bind(this);
    return this.createDB().then((db) => {
      this.set('configDB', db);
      return db;
    }).then(replicateConfigDB).then(loadConfig);
  },

  createDB() {
    const promise = new Ember.RSVP.Promise(function(resolve, reject) {
      new PouchDB('config', function(err, db) {
        if (err) {
          reject(err);
        }
        resolve(db);
      });
    }, 'instantiating config database instance');
    return promise;
  },
  replicateConfigDB(db) {
    const url = `${document.location.protocol}//${document.location.host}/db/config`;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      db.replicate.from(url, { complete: resolve }, reject);
    }, 'replicating the database');
  },
  loadConfig() {
    const config = this.get('configDB');
    var options = {
      include_docs: true,
      keys: [
        'config_consumer_key',
        'config_consumer_secret',
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
        const config = {};
        for (var i = 0; i < response.rows.length; i++) {
          if (!response.rows[i].error && response.rows[i].doc) {
            config[response.rows[i].id] = response.rows[i].doc.value;
          }
        }
        resolve(config);
      });
    }, 'getting configuration from the database');
  },
  getFileLink(id) {
    const config = this.get('configDB');
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
    const config = this.get('configDB');
    return this.getFileLink(id).then(function(fileLink) {
      config.remove(fileLink);
    });
  },
  saveFileLink(fileName, id) {
    const config = this.get('configDB');
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
    const configDB = this.get('configDB');
    var configKeys = Object.keys(configs);
    var savePromises = [];
    return this._getOauthConfigs(configKeys).then(function(records) {
      configKeys.forEach(function(key) {
        var configRecord = records.rows.findBy('key', key);
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
    return this._getConfigValue('use_google_auth', false);
  },

  getPatientPrefix() {
    return this._getConfigValue('patient_id_prefix', 'P');
  },

  _getConfigValue(id, defaultValue) {
    const configDB = this.get('configDB');
    return new Ember.RSVP.Promise(function(resolve) {
      configDB.get('config_' + id).then(function(doc) {
        run(null, resolve, doc.value);
      })
        .catch(function() {
          run(null, resolve, defaultValue);
        });
    }, `get ${id} from config database`);
  },

  _getOauthConfigs: function(configKeys) {
    const configDB = this.get('configDB');
    let options = {
      include_docs: true,
      keys: configKeys
    };
    return configDB.allDocs(options);
  }

});

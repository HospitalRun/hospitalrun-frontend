/* global List */
import Ember from 'ember';

export default Ember.Service.extend({
  pouchdb: Ember.inject.service(),
  setup() {
    const setDB = this.setDB.bind(this);
    const replicate = this.replicate.bind(this);
    const loadConfig = this.loadConfig.bind(this);
    const setConfig = this.setConfig.bind(this);
    return this.createDB()
      .then(setDB)
      .then(replicate)
      .then(loadConfig)
      .then(setConfig);
  },
  createDB() {
    PouchDB.plugin(List);
    return new Ember.RSVP.Promise(function(resolve, reject){
      new PouchDB('config', function(err, db){
        if(err){
          reject(err);
        }
        resolve(db);
      });
    }, 'instantiating config database instance');
  },
  setDB(db) {
    this.set('db', db);
    return db;
  },
  replicate(db){
    const url = `${document.location.protocol}//${document.location.host}/db/config`;
    return new Ember.RSVP.Promise(function(resolve, reject){
      db.replicate.from(url, { complete: resolve }, reject);
    }, 'replicating the database');
  },
  loadConfig() {
    const db = this.get('db');
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
    return new Ember.RSVP.Promise(function(resolve, reject){
      db.allDocs(options, function(err, response) {
          if (err) {
              console.log('Could not get configDB configs:', err);
              reject(err);
          }
          const config = {};
          for (var i=0;i<response.rows.length;i++) {
              if (!response.rows[i].error) {
                  config[response.rows[i].id] = response.rows[i].doc.value;
              }
          }
          resolve(config);
      });
    }, 'getting configuration from the database');
  },
  setupMainDB(config) {
    return this.get('pouchdb').setupMainDB(config);
  },
  setConfig(config) {
    this.set('config', config);
    return config;
  },
  getFileLink(id) {
    const db = this.get('db');
    return new Ember.RSVP.Promise(function(resolve, reject){
      db.get(`file-link_${id}`, function(err, doc){
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  },
  removeFileLink(id) {
    const db = this.get('db');
    return this.getFileLink(id).then(function(fileLink) {
      db.remove(fileLink);
    });
  },
  saveFileLink(fileName, id) {
    const db = this.get('db');
    return new Ember.RSVP.Promise(function(resolve, reject){
      db.put({ fileName }, `file-link_${id}`, function(err, doc){
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }
});

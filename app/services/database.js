/* global List */
import Ember from 'ember';
import createPouchOauthXHR from 'hospitalrun/utils/pouch-oauth-xhr';
import createPouchViews from 'hospitalrun/utils/pouch-views';
import PouchAdapterUtils from 'hospitalrun/mixins/pouch-adapter-utils';

export default Ember.Service.extend(PouchAdapterUtils, {
  configDB: null,
  mainDB: null, //Server DB
  setMainDB: false,
  setup() {
    const replicateConfigDB = this.replicateConfigDB.bind(this);
    const loadConfig = this.loadConfig.bind(this);
    const createMainDB = this.createMainDB.bind(this);
    return this.createConfigDB()
      .then((db) => {
        this.set('configDB', db);
        return db;
      })
      .then(replicateConfigDB)
      .then(loadConfig)
      .then((config) => {
        this.set('config', config);
        return config;
      })
      .then(createMainDB)
      .then((db) => {
        this.set('mainDB', db);
        this.set('setMainDB', true);
      });
  },
  createMainDB(configs){
    const pouchOptions = {};
    if (configs.config_use_google_auth) {
        //If we don't have the proper credentials don't sync.
        if (Ember.isEmpty(configs.config_consumer_key) ||
            Ember.isEmpty(configs.config_consumer_secret) ||
            Ember.isEmpty(configs.config_oauth_token) ||
            Ember.isEmpty(configs.config_token_secret)) {
            // TODO: do we need this here?
            // reject();
        }
        pouchOptions.ajax = {
            xhr: createPouchOauthXHR(configs),
            timeout: 30000
        };
    }
    const url = `${document.location.protocol}//${document.location.host}/db/main`;
    return new Ember.RSVP.Promise((resolve, reject)=>{
      new PouchDB(url, pouchOptions, (err, db)=>{
        if (err) {
          reject(err);
          return;
        }
        createPouchViews(db);
        resolve(db);
      });
    });
  },
  createConfigDB() {
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
  replicateConfigDB(db){
    const url = `${document.location.protocol}//${document.location.host}/db/config`;
    return new Ember.RSVP.Promise(function(resolve, reject){
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
    return new Ember.RSVP.Promise(function(resolve, reject){
      config.allDocs(options, function(err, response) {
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
  queryMainDB: function(queryParams, mapReduce) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
          var mainDB = this.get('mainDB');
          if (mapReduce) {
              mainDB.query(mapReduce, queryParams, function(err, response) {
                  if (err) {
                      this._pouchError(reject)(err);
                  } else {
                      response.rows = this._mapPouchData(response.rows);
                      resolve(response);
                  }
              }.bind(this));
          } else {
              mainDB.allDocs(queryParams, function(err, response) {
                  if (err) {
                      this._pouchError(reject)(err);
                  } else {
                      response.rows = this._mapPouchData(response.rows);
                      resolve(response);
                  }
              }.bind(this));
          }
      }.bind(this));
  },
  getFileLink(id) {
    const config = this.get('configDB');
    return new Ember.RSVP.Promise(function(resolve, reject){
      config.get(`file-link_${id}`, function(err, doc){
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
    return new Ember.RSVP.Promise(function(resolve, reject){
      config.put({ fileName }, `file-link_${id}`, function(err, doc){
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  },
  /**
  * Given an pouchDB doc id, return the corresponding ember record id.
  * @param {String} docId the pouchDB doc id.
  * @returns {String} the corresponding Ember id.
  */
  getEmberId: function(docId) {
      var parsedId = this.get('mainDB').rel.parseDocID(docId);
      if (!Ember.isEmpty(parsedId.id)) {
          return parsedId.id;
      }
  },
  getDocFromMainDB: function(docId) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
          var mainDB = this.get('mainDB');
          mainDB.get(docId, function(err, doc) {
              if (err) {
                  this._pouchError(reject)(err);
              } else {
                  resolve(doc);
              }
          }.bind(this));
      }.bind(this));
  },
  /**
  * Given an Ember record id and type, return back the corresponding pouchDB id.
  * @param {String} emberId the ember record id.
  * @param {String} type the record type.
  * @returns {String} the corresponding pouch id.
  */
  getPouchId: function(emberId, type) {
      return this.get('mainDB').rel.makeDocID({
          id: emberId,
          type: type
      });
  },
  _mapPouchData: function(rows) {
      var mappedRows = [];
      if (rows) {
          mappedRows = rows.map(function(row) {
              var rowValues = {
                  doc: row.doc.data
              };
              rowValues.doc.id = this.getEmberId(row.id);
              return rowValues;
          }.bind(this));
      }
      return mappedRows;
  },
});

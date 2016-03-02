/* global List */
import Ember from 'ember';
import createPouchOauthXHR from 'hospitalrun/utils/pouch-oauth-xhr';
import createPouchViews from 'hospitalrun/utils/pouch-views';
import PouchAdapterUtils from 'hospitalrun/mixins/pouch-adapter-utils';

export default Ember.Service.extend(PouchAdapterUtils, {
  config: Ember.inject.service(),
  mainDB: null, // Server DB
  PouchOauthXHR: null,
  setMainDB: false,

  setup(configs) {
    PouchDB.plugin(List);
    return this.createDB(configs)
      .then((db) => {
        this.set('mainDB', db);
        this.set('setMainDB', true);
      });
  },

  createDB(configs) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let pouchOptions = {};
      if (configs.config_use_google_auth) {
        // If we don't have the proper credentials, throw error to force login.
        if (Ember.isEmpty(configs.config_consumer_key) ||
          Ember.isEmpty(configs.config_consumer_secret) ||
          Ember.isEmpty(configs.config_oauth_token) ||
          Ember.isEmpty(configs.config_token_secret)) {
          throw Error('login required');
        }
        this.set('PouchOauthXHR', createPouchOauthXHR(configs));
        pouchOptions.ajax = {
          xhr: this.get('PouchOauthXHR'),
          timeout: 30000
        };
      }
      const url = `${document.location.protocol}//${document.location.host}/db/main`;
      new PouchDB(url, pouchOptions, (err, db) => {
        if (err) {
          reject(err);
          return;
        }
        createPouchViews(db);
        resolve(db);
      });
    });
  },

  queryMainDB(queryParams, mapReduce) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      var mainDB = this.get('mainDB');
      if (mapReduce) {
        mainDB.query(mapReduce, queryParams, (err, response) => {
          if (err) {
            this._pouchError(reject)(err);
          } else {
            response.rows = this._mapPouchData(response.rows);
            resolve(response);
          }
        });
      } else {
        mainDB.allDocs(queryParams, (err, response) => {
          if (err) {
            this._pouchError(reject)(err);
          } else {
            response.rows = this._mapPouchData(response.rows);
            resolve(response);
          }
        });
      }
    });
  },

  /**
  * Given an pouchDB doc id, return the corresponding ember record id.
  * @param {String} docId the pouchDB doc id.
  * @returns {String} the corresponding Ember id.
  */
  getEmberId(docId) {
    var parsedId = this.get('mainDB').rel.parseDocID(docId);
    if (!Ember.isEmpty(parsedId.id)) {
      return parsedId.id;
    }
  },

  getDocFromMainDB(docId) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      var mainDB = this.get('mainDB');
      mainDB.get(docId, (err, doc) => {
        if (err) {
          this._pouchError(reject)(err);
        } else {
          resolve(doc);
        }
      });
    });
  },

  /**
  * Given an Ember record id and type, return back the corresponding pouchDB id.
  * @param {String} emberId the ember record id.
  * @param {String} type the record type.
  * @returns {String} the corresponding pouch id.
  */
  getPouchId(emberId, type) {
    return this.get('mainDB').rel.makeDocID({
      id: emberId,
      type: type
    });
  },

  /**
   * Load the specified db dump into the database.
   * @param {String} dbDump A couchdb dump string produced by pouchdb-dump-cli.
   * @returns {Promise} A promise that resolves once the dump has been loaded.
   */
  loadDBFromDump: function(dbDump) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      var db = new PouchDB('dbdump', {
        adapter: 'memory'
      });
      db.load(dbDump).then(() => {
        var mainDB = this.get('mainDB');
        db.replicate.to(mainDB).on('complete', (info) => {
          resolve(info);
        }).on('error', (err) => {
          reject(err);
        });
      });
    });
  },

  _mapPouchData(rows) {
    var mappedRows = [];
    if (rows) {
      mappedRows = rows.map((row) => {
        if (row.doc) {
          var rowValues = {
            doc: row.doc.data
          };
          rowValues.doc.id = this.getEmberId(row.id);
          return rowValues;
        } else {
          return row;
        }
      });
    }
    return mappedRows;
  }
});

import Ember from 'ember';
import createPouchViews from 'hospitalrun/utils/pouch-views';
import List from 'npm:pouchdb-list';
import PouchAdapterMemory from 'npm:pouchdb-adapter-memory';
import PouchDBUsers from 'npm:pouchdb-users';
import UnauthorizedError from 'hospitalrun/utils/unauthorized-error';

const {
  isEmpty
} = Ember;

export default Ember.Service.extend({
  config: Ember.inject.service(),
  mainDB: null, // Server DB
  usersDB: null, // local users database for standAlone mode
  oauthHeaders: null,
  setMainDB: false,

  setup(configs) {
    PouchDB.plugin(List);
    PouchDB.plugin(PouchDBUsers);
    let pouchOptions = this._getOptions(configs);
    return this.createDB(configs, pouchOptions).then((db) => {
      this.set('mainDB', db);
      this.set('setMainDB', true);
      if (this.get('config.standAlone')) {
        let usersDB = new PouchDB('_users');
        return usersDB.installUsersBehavior().then(() => {
          this.set('usersDB', usersDB);
        });
      }
    });
  },

  _getOptions(configs) {
    let pouchOptions = {};
    if (configs && configs.config_use_google_auth) {
      pouchOptions.ajax = {
        timeout: 30000
      };
      // If we don't have the proper credentials, throw error to force login.
      if (Ember.isEmpty(configs.config_consumer_key)
        || Ember.isEmpty(configs.config_consumer_secret)
        || Ember.isEmpty(configs.config_oauth_token)
        || Ember.isEmpty(configs.config_token_secret)) {
        throw Error('login required');
      } else {
        let headers = {
          'x-oauth-consumer-secret': configs.config_consumer_secret,
          'x-oauth-consumer-key': configs.config_consumer_key,
          'x-oauth-token-secret': configs.config_token_secret,
          'x-oauth-token': configs.config_oauth_token
        };
        this.set('oauthHeaders', headers);
        pouchOptions.ajax.headers = headers;
      }
    }
    return pouchOptions;
  },

  createDB(configs, pouchOptions) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let url = `${document.location.protocol}//${document.location.host}/db/main`;

      this._createRemoteDB(url, pouchOptions)
      .catch((err) => {
        if ((err.status && err.status === 401) || configs.config_disable_offline_sync === true) {
          reject(err);
        } else {
          return this._createLocalDB('localMainDB', pouchOptions);
        }
      }).then((db) => resolve(db))
      .catch((err) => reject(err));

    }, 'initialize application db');
  },

  queryMainDB(queryParams, mapReduce) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let mainDB = this.get('mainDB');
      if (mapReduce) {
        mainDB.query(mapReduce, queryParams, (err, response) => {
          if (err) {
            reject(this.handleErrorResponse(err));
          } else {
            response.rows = this._mapPouchData(response.rows);
            resolve(response);
          }
        });
      } else {
        mainDB.allDocs(queryParams, (err, response) => {
          if (err) {
            reject(this.handleErrorResponse(err));
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
    let parsedId = this.get('mainDB').rel.parseDocID(docId);
    if (!Ember.isEmpty(parsedId.id)) {
      return parsedId.id;
    }
  },

  getDocFromMainDB(docId) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      let mainDB = this.get('mainDB');
      mainDB.get(docId, (err, doc) => {
        if (err) {
          reject(this.handleErrorResponse(err));
        } else {
          resolve(doc);
        }
      });
    });
  },

 /**
  * Given an record type, return back the maximum pouchdb id.  Useful for endkeys.
  * @param {String} type the record type.
  * @returns {String} the max pouch id for the type.
  */
  getMaxPouchId(type) {
    return this.getPouchId({}, type);
  },

  /**
  * Given an record type, return back the minimum pouchdb id.  Useful for startkeys.
  * @param {String} type the record type.
  * @returns {String} the min pouch id for the type.
  */
  getMinPouchId(type) {
    return this.getPouchId(null, type);
  },

  /**
  * Given an Ember record id and type, return back the corresponding pouchDB id.
  * @param {String} emberId the ember record id.
  * @param {String} type the record type.
  * @returns {String} the corresponding pouch id.
  */
  getPouchId(emberId, type) {
    let idInfo = {
      type
    };
    if (!isEmpty(emberId)) {
      idInfo.id = emberId;
    }
    return this.get('mainDB').rel.makeDocID(idInfo);
  },

  /**
   * Load the specified db dump into the database.
   * @param {String} dbDump A couchdb dump string produced by pouchdb-dump-cli.
   * @returns {Promise} A promise that resolves once the dump has been loaded.
   */
  loadDBFromDump(dbDump) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      PouchDB.plugin(PouchAdapterMemory);
      let db = new PouchDB('dbdump', {
        adapter: 'memory'
      });
      db.load(dbDump).then(() => {
        let mainDB = this.get('mainDB');
        db.replicate.to(mainDB).on('complete', (info) => {
          resolve(info);
        }).on('error', (err) => {
          reject(err);
        });
      }, reject);
    });
  },

  getDBInfo() {
    let mainDB = this.get('mainDB');
    return mainDB.info();
  },

  handleErrorResponse(err) {
    if (!err.status) {
      if (err.errors && err.errors.length > 0) {
        err.status = parseInt(err.errors[0].status);
      }
    }
    if (err.status === 401 || err.status === 403) {
      let detailedMessage = JSON.stringify(err, null, 2);
      return new UnauthorizedError(err, detailedMessage);
    } else {
      return err;
    }
  },

  _mapPouchData(rows) {
    let mappedRows = [];
    if (rows) {
      mappedRows = rows.map((row) => {
        if (row.doc) {
          let rowValues = {
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
  },

  _createRemoteDB(remoteUrl, pouchOptions) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let remoteDB = new PouchDB(remoteUrl, pouchOptions);
      // remote db lazy created, check if db created correctly
      remoteDB.info().then(()=> {
        createPouchViews(remoteDB);
        resolve(remoteDB);
      }).catch((err) => {
        console.log('error with remote db:', JSON.stringify(err, null, 2));
        reject(err);
      });
    });
  },

  _createLocalDB(localDBName, pouchOptions) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let localDB = new PouchDB(localDBName, pouchOptions);
      localDB.info().then(() => {
        createPouchViews(localDB);
        resolve(localDB);
      }).catch((err) => reject(err));
    });
  }
});

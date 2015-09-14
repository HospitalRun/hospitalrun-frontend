import Ember from 'ember';
import createPouchOauthXHR from 'hospitalrun/utils/pouch-oauth-xhr';
import createPouchViews from 'hospitalrun/utils/pouch-views';
import PouchAdapterUtils from 'hospitalrun/mixins/pouch-adapter-utils';

export default Ember.Service.extend(PouchAdapterUtils, {
    mainDB: null, //Server DB
    configDB: Ember.inject.service('config-db'),
    setMainDB: false,

    /**
     * Get the file link information for the specifed recordId.
     * @param {String} recordId the id of the record to the find the file link for.
     * @returns {Promise} returns a Promise that resolves once the file link object is retrieved.
     * The promise resolves with the file link object if found;otherwise it resolves with null.
     */
    _getFileLink: function(id) {
      return this.get('configDB').getFileLink(id);
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

    removeFileLink: function(id) {
      return this.get('configDB').removeFileLink(id);
    },

    saveFileLink: function(newFileName, id) {
      return this.get('configDB').saveFileLink(newFileName, id);
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

    setupMainDB: function() {
      const configDB = this.get('configDB');
      return configDB.setup()
        .then((configs)=>{
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
          return this.createPouchDB(url, pouchOptions);
        })
        .then((db)=>{
          this.set('mainDB', db);
          this.set('setMainDB', true);
        });
    },

    createPouchDB(url, options) {
      return new Ember.RSVP.Promise((resolve, reject)=>{
        new PouchDB(url, options, (err, db)=>{
          if (err) {
            reject(err);
            return;
          }
          createPouchViews(db);
          resolve(db);
        });
      });
    }
});

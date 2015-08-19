import Ember from 'ember';
import createPouchOauthXHR from 'hospitalrun/utils/pouch-oauth-xhr';
import createPouchViews from 'hospitalrun/utils/pouch-views';
import PouchAdapterUtils from 'hospitalrun/mixins/pouch-adapter-utils';

export default Ember.Service.extend(PouchAdapterUtils, {
    mainDB: null, //Server DB
    configDB: null, //Initializer will set this up.
    setMainDB: false,
    
    /**
     * Get the file link information for the specifed recordId.
     * @param {String} recordId the id of the record to the find the file link for.
     * @returns {Promise} returns a Promise that resolves once the file link object is retrieved.  
     * The promise resolves with the file link object if found;otherwise it resolves with null.     
     */
    _getFileLink: function(recordId) {
        return new Ember.RSVP.Promise(function(resolve){
            var configDB = this.get('configDB');
            configDB.get('file-link_'+recordId, function(err, doc){
                resolve(doc);
            });
        }.bind(this));
    },
    
    /**
     * Handler called when handler to sever main DB is created.
     */
    _gotServerMainDB: function(err, db) {
        if (err) {
            console.log("Error creating main pouchDB",err);
            throw err;
        } else {
            this.set('mainDB', db);
            this.set('setMainDB', true);
            //this._setupSync();
        }
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
    
    removeFileLink: function(pouchDbId) {
         var configDB = this.get('configDB');
        this._getFileLink(pouchDbId).then(function(fileLink) {
            configDB.remove(fileLink);
        });
    },
    
    saveFileLink: function(newFileName, recordId) {
        var configDB = this.get('configDB');
        configDB.put({
            fileName: newFileName
        }, 'file-link_'+recordId);
    },
    
    queryMainDB: function(queryParams, mapReduce) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var mainDB = this.get('mainDB');
            if (mapReduce) { 
                mainDB.query(mapReduce, queryParams, function(err, response) {
                    if (err) {
                        this._pouchError(reject)(err);
                    } else {
                        resolve(response);
                    }                
                }.bind(this));
            } else {
                mainDB.allDocs(queryParams, function(err, response) {
                    if (err) {
                        this._pouchError(reject)(err);
                    } else {
                        resolve(response);
                    }                
                }.bind(this));
            }
        }.bind(this));
    },
    
    setupMainDB: function(configs) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var pouchOptions = {};
            if (configs.config_use_google_auth) {
                //If we don't have the proper credentials don't sync.
                if (Ember.isEmpty(configs.config_consumer_key) || 
                    Ember.isEmpty(configs.config_consumer_secret) ||
                    Ember.isEmpty(configs.config_oauth_token) || 
                    Ember.isEmpty(configs.config_token_secret)) {
                    reject();
                }
                pouchOptions.ajax = {
                    xhr: createPouchOauthXHR(configs),
                    timeout: 30000
                };
            }
            var dbUrl =  document.location.protocol+'//'+document.location.host+'/db/main';
            new PouchDB(dbUrl, pouchOptions, function(err, db) {                
                if (err) {
                    Ember.run.later(this, function() {
                        var session = this.get('session');
                        if (!Ember.isEmpty(session) && session.isAuthenticated) {
                            session.invalidate();
                        }
                    });
                    reject(err);            
                } else {
                    createPouchViews(db);
                    this._gotServerMainDB(err, db);
                    resolve({
                        mainDB: db, 
                        //localDB: localMainDB
                    });
                }
            }.bind(this));
        }.bind(this));
    }
});
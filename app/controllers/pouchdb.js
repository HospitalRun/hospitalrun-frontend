import Ember from "ember";
import createPouchOauthXHR from "hospitalrun/utils/pouch-oauth-xhr";
import createPouchViews from "hospitalrun/utils/pouch-views";
export default Ember.Controller.extend({
    needs: ['filesystem','navigation'],
    
    filesystem: Ember.computed.alias('controllers.filesystem'),
    isFileSystemEnabled: Ember.computed.alias('controllers.filesystem.isFileSystemEnabled'),
    localMainDB: null, //Local DB
    mainDB: null, //Server DB
    syncStatus: Ember.computed.alias('controllers.navigation.syncStatus'),
    
    backoff: 2, //Factor to increment timeout by each time it fails
    configDB: null, //Initializer will set this up.
    sync: null, //PouchDB sync process
    timeout: 5000, //Timeout to retry sync
    
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
    
    _gotChange: function(info) {
        var filesystem = this.get('filesystem'),
            isFileSystemEnabled = this.get('isFileSystemEnabled');        
        this.set('syncStatus', 'Syncing '+info.id);
        if (info.deleted) {
            if (info.id.indexOf('photo_') ===0 && isFileSystemEnabled) {
                this._getFileLink(info.id).then(function(fileLink) {
                    if (!Ember.isEmpty(fileLink)) {
                        //Delete from local filesystem if exists.
                        filesystem.deleteFile(fileLink.fileName, info.id);   
                    }
                });                
            }
        } else {            
            if (info.id.indexOf('photo_') ===0) {
                if (isFileSystemEnabled) {
                    filesystem.downloadIfNeeded(info.doc);
                }
            }
        }        
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
            this._setupSync();
        }
    },

    _retrySync: function() {
        var backoff = this.get('backoff'),
            timeout = this.get('timeout');
        timeout *= backoff;
        this.set('timeout',timeout);
        this._setupSync();
    },    

    _setupSync: function() {
        var db = this.get('mainDB'),
            localDB = this.get('localMainDB'),
            sync;
        sync = db.sync(localDB, {live: true})
            .on('active', this._syncActive.bind(this))
            .on('change', this._syncChange.bind(this))
            .on('error', this._syncError.bind(this))
            .on('paused', this._syncPaused.bind(this));
        this.set('sync', sync);
    },
    
    /**
     * Fires when the replication starts actively processing changes
     */
    _syncActive: function() {
        this.set('syncStatus', 'Starting sync');
    },

    /**
     * Got sync error, probably offline.
     * Retry after timeout to resync.
     */
    _syncError: function() {
        var sync = this.get('sync'),
            timeout = this.get('timeout');
        sync.cancel();
        setTimeout(this._retrySync.bind(this), timeout);        
    },
    
    _syncChange: function() {
        //Successfully synced, reset timeout to 5 seconds for retries
        this.set('timeout', 5000);
    },
    
    /**
     * Fires when the replication is paused, either because a live replication 
     * is waiting for changes, or replication has temporarily failed.
     */
    _syncPaused: function() {
        this.set('syncStatus', 'Up to date');
    },
    
    getDocFromMainDB: function(docId) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var mainDB = this.get('mainDB');
            mainDB.get(docId, function(err, doc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }                 
            });
        }.bind(this));
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
                        reject(err);
                    } else {
                        resolve(response);
                    }                
                });
            } else {
                mainDB.allDocs(queryParams, function(err, response) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response);
                    }                
                });
            }
        }.bind(this));
    },
    
    setupMainDB: function(configs) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var localMainDB = new PouchDB('main',{auto_compaction: true});
            localMainDB.changes({
                include_docs: true, 
                live: true,
                since: 'now',
                style: 'all_docs'
            }).on('change', this._gotChange.bind(this));
			createPouchViews(localMainDB);
            this.set('localMainDB', localMainDB);            
            
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
                this._gotServerMainDB(err, db);
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        mainDB: db, 
                        localDB: localMainDB
                    });
                }
            }.bind(this));
        }.bind(this));
    }
});
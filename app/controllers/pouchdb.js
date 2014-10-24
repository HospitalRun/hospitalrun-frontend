import createPouchOauthXHR from "hospitalrun/utils/pouch-oauth-xhr";
export default Ember.Controller.extend({
    needs: 'filesystem',
    
    filesystem: Ember.computed.alias('controllers.filesystem'),
    isFileSystemEnabled: Ember.computed.alias('controllers.filesystem.isFileSystemEnabled'),
    
    backoff: 2, //Factor to increment timeout by each time it fails
    configDB: null, //Initializer will set this up.
    serverMainDB: null,
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
            this.set('serverMainDB', db);
            this._setupSync();
        }
    },

    _retrySync: function() {
        var backoff = this.get('backoff'),
            timeout = this.get('timeout');
        timeout *= backoff;
        this.set('timeout',timeout);
        console.log("Retrying sync wait for "+timeout);
        this._setupSync();
    },    

    _setupSync: function() {
        var db = this.get('serverMainDB'),
            sync;
        sync = db.sync('main', {live: true})
            .on('change', this._syncChange.bind(this))
            .on('error', this._syncError.bind(this));
        
        this.set('sync', sync);
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
    
    setup: function() {
        var configDB = this.get('configDB'),
            localMainDB = new PouchDB('main'),
            options = {
                include_docs: true,
                keys: [
                    'config_consumer_key',
                    'config_consumer_secret',
                    'config_oauth_token',
                    'config_token_secret',
                    'config_use_google_auth'
                ]
            };

        localMainDB.changes({
            include_docs: true, 
            live: true,
            since: 'now',
            style: 'all_docs'
        }).on('change', this._gotChange.bind(this));

        configDB.allDocs(options, function(err, response) { 
            if (err) {
                console.log('Could not get configDB configs:', err);
            } else {
                var configs = {};
                for (var i=0;i<response.rows.length;i++) {
                    if (!response.rows[i].error) {
                        configs[response.rows[i].id] = response.rows[i].doc.value;
                    }
                }
                this.setupMainDB(configs);                
            }
        }.bind(this));

    },    

    setupMainDB: function(configs) {
        var pouchOptions = {};
        if (configs.config_use_google_auth) {
            //If we don't have the proper credentials don't sync.
            if (Ember.isEmpty(configs.config_consumer_key) || 
                Ember.isEmpty(configs.config_consumer_secret) ||
                Ember.isEmpty(configs.config_oauth_token) || 
                Ember.isEmpty(configs.config_token_secret)) {
                return;
            }
            pouchOptions.ajax = {
                xhr: createPouchOauthXHR(configs)
            };
        }
        var dbUrl =  document.location.protocol+'//'+document.location.host+'/db/main';
        new PouchDB(dbUrl, pouchOptions, this._gotServerMainDB.bind(this));
    }
});
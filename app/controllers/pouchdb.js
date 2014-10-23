import createPouchOauthXHR from "hospitalrun/utils/pouch-oauth-xhr";
export default Ember.Controller.extend({
    needs: 'filesystem',
    
    filesystem: Ember.computed.alias('controllers.filesystem'),
    
    backoff: 2, //Factor to increment timeout by each time it fails
    configDB: null, //Initializer will set this up.
    serverMainDB: null,
    sync: null, //PouchDB sync process
    timeout: 5000, //Timeout to retry sync
    
    _createChange: function(info) {
        if (info.id.indexOf('photo_') ===0) {
            console.log("PHOTO got CREATE",info);
        } else {            
            console.log("other got CREATE",info);    
        }        
    },
    
    _deleteChange: function(info) {
        if (info.id.indexOf('photo_') ===0) {
            console.log("PHOTO got DELETE",info);
        } else {            
            console.log("other got DELETE",info);    
        }
    },
    
    downloadImageFromServer: function(imageRecord) {
        var me = this,
            url = imageRecord.get('url'),
            xhr = new XMLHttpRequest();
        if (!Ember.isEmpty(url)) {
            //Make sure directory exists or is created before downloading.
            this.getPatientDirectory(imageRecord.get('patientId'));            
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function() {  
                var file = new Blob([xhr.response]);
                me.addImageToFileStore(file, null, imageRecord);
            };
            xhr.send();
        }
    },    
    
    _gotChange: function(info) {
        if (info.deleted) {
            if (info.id.indexOf('photo_') ===0) {
                console.log("PHOTO Change got DELETE",info);
                //Delete from local filesystem if exists.
            }
        } else {            
            if (info.id.indexOf('photo_') ===0) {
                console.log("PHOTO Change got CHANGE ",info);
            } else {
                console.log("Change got CHANGE",info);
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
    _syncError: function(err) {
        console.log("got error on sync", err);        
        var sync = this.get('sync'),
            timeout = this.get('timeout');
        sync.cancel();
        setTimeout(this._retrySync.bind(this), timeout);        
    },
    
    _syncChange: function() {
        //Successfully synced, reset timeout to 5 seconds for retries
        this.set('timeout', 5000);
    },

    _updateChange: function(info) {

        if (info.id.indexOf('photo_') ===0) {
            console.log("PHOTO got UPDATE",info);
        } else {            
            console.log("other got UPDATE",info);    
        }
        
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
            conflicts: true,
            include_docs: true, 
            live: true,
            since: 'now',
            style: 'all_docs'
        }).on('change', this._gotChange.bind(this));
            //.on('create', this._createChange.bind(this))
            //.on('update', this._updateChange.bind(this))
            //.on('delete', this._deleteChange.bind(this));

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
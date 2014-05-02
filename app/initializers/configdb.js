import couchOauthSign from "hospitalrun/utils/couch-oauth-sign";
import createPouchOauthXHR from "hospitalrun/utils/pouch-oauth-xhr";

export default {
    name: 'configdb',    
    
    initialize: function(container, application) {
        var configDB;
        
        function _initCouchDB() {            
            return new Ember.RSVP.Promise(function(resolve, reject){
                configDB = new PouchDB('config', function(err, db){
                    if(err){
                        Ember.run(null, reject, err);
                    } else {
                        var dbUrl =  document.location.protocol+'//'+document.location.host+'/db/';
                        var remoteDB = dbUrl + 'config';
                        configDB.replicate.from(remoteDB, {
                            complete: function() {
                                Ember.run(null, resolve, {success:true});                    
                            }
                        }, function(err) {
                            Ember.run(null, resolve, {
                                error: err,
                                success: false                
                            });            
                        });                        
                    }
                });                
            });
        }
        
        function _syncMainDB() {
            return new Ember.RSVP.Promise(function(resolve, reject){                
                var options = {
                    include_docs: true,
                    keys: [
                        'config_consumer_key',
                        'config_consumer_secret',
                        'config_oauth_token',
                        'config_token_secret'
                    ]
                };
                
                configDB.allDocs(options, function(err, response) { 
                    if (err) {
                        Ember.run(null, reject, err);
                    } else {
                        var configs = {};
                        for (var i=0;i<response.rows.length;i++) {
                            if (!response.rows[i].error) {
                                configs[response.rows[i].id] = response.rows[i].doc.value;
                            }
                        }

                        var pouchOauthXHR = createPouchOauthXHR(configs);
                        var dbUrl =  document.location.protocol+'//'+document.location.host+'/db/main';
                        
                                                
                        var mainDB = new PouchDB(dbUrl, {
                                ajax: {
                                    xhr: pouchOauthXHR
                                },
                            },
                            function(err, db){
                                if (err) {
                                    console.log("Got err",err);
                                    console.log("error stack"+err.stack);
                                    Ember.run(null, resolve, {success:false, error: err});
                                } else {
                                    db.replicate.sync('main', {
                                        complete: function() {
                                            Ember.run(null, resolve, {success:true});
                                        }                                     
                                    }, function(err) {
                                        Ember.run(null, resolve, {                        
                                            error: err, 
                                            success:false
                                        });
                                    });
                                }
                            }
                        );
                    }
                });
            });
        }

        application.deferReadiness();
        _initCouchDB().then(function() {
            _syncMainDB().then(function() {
                application.advanceReadiness();
            });
        });
    }
};
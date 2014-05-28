import createPouchOauthXHR from "hospitalrun/utils/pouch-oauth-xhr";

export default {
    after: 'authentication',
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
                        db.replicate.from(remoteDB, {
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
                        new PouchDB(dbUrl, {
                            ajax: {
                                xhr: pouchOauthXHR
                            },
                        },
                        function(err, db){                                
                            db.changes({
                                conflicts: true,
                                since: 'now',
                                continuous: true,
                                onChange: function() {
                                    console.log("DB Change",arguments);
                                }
                            }, function(err, response) {
                                console.log("changes complete, err")  ;
                                console.dir(err);
                                console.log(response);
                            });


                            if (err) {
                                console.log("Error creating main pouchDB",err);
                                throw err;
                            } else {
                                db.replicate.sync('main', {
                                    live: true,
                                    onChange: function() {
                                        console.log("got sync change",arguments);
                                    },
                                    complete: function() {
                                        console.log("Got sync complete",arguments);
                                    }
                                });
                            }
                        });
                        Ember.run(null, resolve, {success:true});
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
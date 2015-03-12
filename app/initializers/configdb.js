import Ember from "ember";
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
        

        application.deferReadiness();
        _initCouchDB().then(function() {
            application.register('couchdb:configdb', configDB, {instantiate: false});
            application.inject('controller:pouchdb', 'configDB', 'couchdb:configdb');
            var localMainDB = new PouchDB('main',{auto_compaction: true});
            application.register('pouchdb:maindb', localMainDB, {instantiate: false});
            application.inject('controller:pouchdb', 'localMainDB', 'pouchdb:maindb');
            application.inject('adapter:application', 'db', 'pouchdb:maindb');
            application.advanceReadiness();
        });
    }
};
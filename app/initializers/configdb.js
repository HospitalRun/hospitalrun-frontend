export default {
    name: 'configdb',    
    
    initialize: function(container, application) {
        function _initCouchDB() {
            return new Ember.RSVP.Promise(function(resolve, reject){
                var dbUrl =  document.location.protocol+'//'+document.location.host+'/db/';
                var remoteDB = dbUrl + 'config';
                PouchDB.replicate(remoteDB,'config', {
                    complete: function() {
                        Ember.run(null, resolve, {success:true});                    
                    }
                }, function(err) {
                    Ember.run(null, resolve, {
                        error: err,
                        success: false                
                    });            
                });
            });
        }
        
        application.deferReadiness();
        _initCouchDB().then(function() {
            application.advanceReadiness();
        });
    }
};
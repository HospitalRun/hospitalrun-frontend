import CustomAuth from "hospitalrun/utils/custom-auth";
import CouchSerializer from "hospitalrun/utils/couch-serializer";
import Ember from "ember";

export default {
    name: 'authentication',
    
    initialize: function(container, application) {
        container.register('authenticators:custom', CustomAuth);
        application.register('serializer:couchdb', CouchSerializer);        
        Ember.SimpleAuth.setup(container, application);
        container.injection('adapter:user', 'session', 'ember-simple-auth:session:current');
    }    
};
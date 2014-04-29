import CustomAuth from "hospitalrun/utils/custom-auth";
import CustomAuthorizer from "hospitalrun/utils/custom-authorizer";
import CouchSerializer from "hospitalrun/utils/couch-serializer";

export default {
    name: 'authentication',
    
    initialize: function(container, application) {
        container.register('authenticators:custom', CustomAuth);
        container.register('authorizer:custom', CustomAuthorizer);
        application.register('serializer:couchdb', CouchSerializer);        
        Ember.SimpleAuth.setup(container, application, {
            authorizerFactory: 'authorizer:custom'
        });
    }    
};
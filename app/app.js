import Resolver from 'ember/resolver';
import CustomAuth from "hospitalrun/utils/custom-auth";
import CustomAuthorizer from "hospitalrun/utils/custom-authorizer";
import CouchSerializer from "hospitalrun/utils/couch-serializer";
import easyFormBootstrap from "hospitalrun/utils/easyform-bootstrap";

var App = Ember.Application.extend({
    LOG_ACTIVE_GENERATION: true,
    LOG_MODULE_RESOLVER: true,
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true,
    LOG_VIEW_LOOKUPS: true,
    modulePrefix: 'hospitalrun', // TODO: loaded via config
    Resolver: Resolver['default']
});

App.initializer({
    name: 'authentication',
    initialize: function(container, application) {
        easyFormBootstrap();
        container.register('authenticators:custom', CustomAuth);
        application.register('serializer:couchdb', CouchSerializer);
        Ember.SimpleAuth.setup(container, application, {
            authorizer: CustomAuthorizer
        });
        application.deferReadiness();
        var remoteDB = document.location.protocol+'//'+document.location.host+'/db/config';
        PouchDB.replicate(remoteDB,'config', {
            complete: function() {
                application.advanceReadiness();
            }
        }, function(err) {
            console.log("On ERROR callback:");
            console.dir(err);
            application.advanceReadiness();
        });
    }
});

export default App;

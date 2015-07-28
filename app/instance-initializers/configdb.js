export default {
    name: 'configdb',    
    
    initialize: function(instance) {
        var customAuthenticator = instance.container.lookup('authenticator:custom'),
            pouchDBController = instance.container.lookup('controller:pouchdb');
        customAuthenticator.set('pouchDBController', pouchDBController);
    }
};
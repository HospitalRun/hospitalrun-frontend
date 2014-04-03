var IndexRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('config');
    },
    afterModel: function(configs) {        
        var use_google_auth = configs.findBy('id', 'use_google_auth').get('value');
        if (use_google_auth) {
            alert('google auth');            
        } else {
           alert('NOT google auth');
        }
    }
});

export default IndexRoute;

var ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    use_google_auth: false,

    actions: {
        authenticateSession: function() {
            if (this.use_google_auth) {
                window.location.replace('/auth/google');
            } else {
                this._super();
            }
        }        
    },

    model: function(params, transition) {
        if (params.queryParams.k && params.queryParams.s1 && params.queryParams.s2 && params.queryParams.t) {
            this.get('session').authenticate('authenticators:custom', {
                google_auth: true,
                params: params.queryParams,
            });
            var store = this.store,
                route = this,
                config_keys = [
                    'consumer_key',
                    'consumer_secret',
                    'oauth_token',
                    'token_secret'
                ];

            store.findByIds('config',config_keys).then(function(records) {
                records.forEach(function(record) {
                    console.log("record is:"+record,record);
                    var key = record.id;
                    switch (key) {
                        case 'consumer_key': {
                            record.set('value', params.queryParams.k);
                            break;
                        }
                    }
                });
                
/*            var configRecord = store.createRecord('config', {
                id: 'consumer_key',
                value: params.queryParams.k
            });
            configRecord.save().then(function(){
                console.log("HEY SAVED consumer_key");
                configRecord = store.createRecord('config', {
                    id: 'consumer_secret',
                    value: params.queryParams.s1
                });
                configRecord.save().then(function(){
                    console.log("HEY SAVED consumer_secret");
                    configRecord = store.createRecord('config', {
                        id: 'oauth_token',
                        value: params.queryParams.t
                    });
                    configRecord.save().then(function(){
                        console.log("HEY SAVED oauth_token");
                        configRecord = store.createRecord('config', {
                            id: 'token_secret',
                            value: params.queryParams.s2
                        });
                        configRecord.save();                        
                    }, function(reason){
                        console.log("HEY could not save oauth_token",reason);
                    });

                }, function(reason){
                    console.log("HEY could not save consumer_secret",reason);
                });
            }, function(reason){
                console.log("HEY could not save consumer_key",reason);
            });            
  */              
            },function(error){
                console.log("error",error);
            });
            
        } else {
            return this.store.find('config');
        }
    },
    
    afterModel: function(resolvedModel) {
        this.controllerFor('navigation').set('allowSearch',false);
        if (resolvedModel) {
            var use_google_auth = resolvedModel.findBy('id','use_google_auth');
            if (use_google_auth) {
                this.use_google_auth = use_google_auth.get('value');
            }
        }
    }
    
});
export default ApplicationRoute;
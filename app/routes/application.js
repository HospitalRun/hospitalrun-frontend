var ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    use_google_auth: false,
    
    oauth_config_keys: [
        'consumer_key',
        'consumer_secret',
        'oauth_token',
        'token_secret'
    ],

    _get_oauth_configs: function() {
        var route = this,
            store = this.store;            
        return new Ember.RSVP.Promise(function(resolve, reject){
            store.find('config',{exactKeys: route.oauth_config_keys}).then(function(records) {
                Ember.run(null, resolve, records);
            },function(error){
                Ember.run(null, reject, error);
            });
        });
    },
        
    _save_oauth_config: function(queryParams) {        
        var store = this.store,
            route = this,
            configRecord,
            configValue;
        
        this._get_oauth_configs().then(function(records) {
            route.oauth_config_keys.forEach(function(key) {
                switch (key) {
                    case 'consumer_key': {
                        configValue = queryParams.k;
                        break;
                    }
                    case 'consumer_secret': {
                        configValue = queryParams.s1;
                        break;
                    }
                    case 'oauth_token': {
                        configValue = queryParams.t;
                        break;
                    }
                    case 'token_secret': {
                        configValue = queryParams.s2;
                        break;
                    }
                }

                configRecord = records.findBy('id', key);
                if (!configRecord) {
                    configRecord = store.createRecord('config', {
                        id: key,
                        value: configValue
                    });
                } else {
                    configRecord.set('value', configValue);
                }

                configRecord.save();                            

            });
        });
    },

    actions: {
        authenticateSession: function() {
            if (this.use_google_auth) {
                window.location.replace('/auth/google');
            } else {
                this._super();
            }
        }        
    },

    model: function(params) {
        if (params.queryParams.k && params.queryParams.s1 && params.queryParams.s2 && params.queryParams.t) {
            this.get('session').authenticate('authenticators:custom', {
                google_auth: true,
                params: params.queryParams,
            });
            this._save_oauth_config(params.queryParams);
        } 
        return this.store.find('config');        
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
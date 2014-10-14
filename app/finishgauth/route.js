export default Ember.Route.extend({    
    oauth_config_keys: [
        'consumer_key',
        'consumer_secret',
        'oauth_token',
        'token_secret'
    ],
    
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

    model: function(params) {
        if (params.k && params.s1 && params.s2 && params.t) {
            this.get('session').authenticate('authenticators:custom', {
                google_auth: true,
                params: params,
            });
            this._save_oauth_config(params);
        } 
    }
});
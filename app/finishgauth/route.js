import Ember from "ember";
export default Ember.Route.extend({
    database: Ember.inject.service(),

    oauth_config_keys: [
        'consumer_key',
        'consumer_secret',
        'oauth_token',
        'token_secret'
    ],

    _get_oauth_configs: function() {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var configKeys = this.get('oauth_config_keys');
            this.store.find('config',{exactKeys: configKeys}).then(function(records) {
                Ember.run(null, resolve, records);
            },function(error){
                Ember.run(null, reject, error);
            });
        }.bind(this));
    },

    _save_oauth_config: function(queryParams) {
        this._get_oauth_configs().then(function(records) {
            var configKeys = this.get('oauth_config_keys');
            configKeys.forEach(function(key) {
                var configRecord,
                    configValue;
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
                    configRecord = this.store.createRecord('config', {
                        id: key,
                        value: configValue
                    });
                } else {
                    configRecord.set('value', configValue);
                }
                configRecord.save();
            }.bind(this));
        }.bind(this));
    },

    model: function(params) {
        if (params.k && params.s1 && params.s2 && params.t) {
            this.get('session').authenticate('authenticator:custom', {
                google_auth: true,
                params: params,
            });
            this._save_oauth_config(params);
            this.get('database').setup({
                config_consumer_key: params.k,
                config_consumer_secret: params.s1,
                config_oauth_token: params.t,
                config_token_secret:  params.s2,
                config_use_google_auth: true
            });
        }
    }
});

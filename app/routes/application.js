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
                params: params.queryParams
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
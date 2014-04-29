var ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    use_google_auth: false,

    actions: {
        authenticateSession: function() {
            if (this.use_google_auth) {
                window.location.replace('/auth/google');
            } else {
                this._super();
            }
        },
        
        sessionAuthenticationSucceeded: function() {
            console.log("in SessionAuthenticationSucceeded:");
            var route = this;
            this._syncMainDB().then(function() {
                route._super();
            });
        },
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
    },
    
    _syncMainDB: function() {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var dbUrl =  document.location.protocol+'//'+document.location.host+'/db/main';
            var remoteDB = dbUrl + 'config';
            console.log("syncing main");
            PouchDB.sync(dbUrl,'main', {
                complete: function() {
                    console.log("done syncing main both ways");
                    Ember.run(null, resolve, {success:true});
                }
            }, function(err) {
                console.log("ERROR syncing main both ways", err);
                Ember.run(null, resolve, {                        
                    error: err, 
                    success:false
                });
            });
        });
    }
});
export default ApplicationRoute;
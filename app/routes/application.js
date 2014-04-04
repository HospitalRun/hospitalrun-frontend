var ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
    actions: {
        authenticateSession: function() {
            console.log("in authsession, currently this:");
            console.dir(this);            
            if (document.location.href.indexOf("?") > 0) {
                console.log("HEY SOMEONE SENT US A GIFT:"+document.location.href);                
                this.get('session').authenticate('app:authenticators:custom', {query:document.location.search});
            } else {
                this.store.find('config','use_google_auth').then(function(record) {
                    console.log("Found value:");
                    console.log(record.get('value'));
                    if (record.get('value')) {
                        console.log("go use google auth");
                        //Redirect to the google auth login

                    } else {
                        console.log("use traditional auth");
                        this._super();
                    }

                    window.location.replace('/auth/google');
                });
            }
        }
    }
});

export default ApplicationRoute;

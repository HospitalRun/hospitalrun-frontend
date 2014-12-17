import Ember from "ember";
import UserSession from "hospitalrun/mixins/user-session";
export default Ember.Route.extend(UserSession, Ember.SimpleAuth.AuthenticatedRouteMixin, {    
    beforeModel: function() {
        if (!this.currentUserCan('query_db')) {
            this.transitionTo('application');
        }
    }
});
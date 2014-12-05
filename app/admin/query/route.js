import UserSession from "hospitalrun/mixins/user-session";
export default Ember.Route.extend(UserSession, Ember.SimpleAuth.AuthenticatedRouteMixin, {
    //TODO VERIFY USER RIGHTS
});
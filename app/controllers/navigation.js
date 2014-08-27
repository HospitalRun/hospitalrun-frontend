import UserSession from "hospitalrun/mixins/user-session";
export default Ember.Controller.extend(UserSession,{
    allowSearch: false,
    searchRoute: null,

    showInventory: function() {
        return this.currentUserCan('inventory');
    }.property(),

    showPatients: function() {
        return this.currentUserCan('patients');
    }.property(),

    showUsers: function() {
        return this.currentUserCan('users');
    }.property(),
    
    actions: {
        search: function() {
            if (this.allowSearch && this.searchRoute) {
                var textToFind = this.get('searchText');
                this.set('searchText','');
                this.transitionToRoute(this.searchRoute+"/"+textToFind);
            }
        }
    }
});
import Ember from "ember";
import ProgressDialog from "hospitalrun/mixins/progress-dialog";
import UserSession from "hospitalrun/mixins/user-session";
export default Ember.Controller.extend(ProgressDialog, UserSession,{
    allowSearch: false,
    progressTitle: 'Searching',
    searchRoute: null,

    showInventory: function() {
        return this.currentUserCan('inventory');
    }.property('session.isAuthenticated'),

    showPatients: function() {
        return this.currentUserCan('patients');
    }.property('session.isAuthenticated'),

    showUsers: function() {
        return this.currentUserCan('users');
    }.property('session.isAuthenticated'),
    
    actions: {
        search: function() {
            if (this.allowSearch && this.searchRoute) {
                var textToFind = this.get('searchText');                
                this.set('searchText','');                
                this.set('progressMessage','Searching for '+textToFind+'.  Please wait...');
                this.showProgressModal();
                this.transitionToRoute(this.searchRoute+"/"+textToFind);
            }
        }
    }
});
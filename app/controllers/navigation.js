import Ember from "ember";
import ProgressDialog from "hospitalrun/mixins/progress-dialog";
import UserSession from "hospitalrun/mixins/user-session";
export default Ember.Controller.extend(ProgressDialog, UserSession,{
    indexLinks: [
        'Appointments',
        'Labs',
        'Imaging',
        'Inventory',
        'Medication',
        'Patients',
        'Users'
    ],

    setupPermissions: function() {
        var permissions = this.get('defaultCapabilities');
        for(var capability in permissions) {
            if (this.currentUserCan(capability)) {
                this.set('userCan_'+capability, true);
            }
        }
    }.on('init'),

    needs: 'application',
    allowSearch: false,
    currentSearchText: null,
    currentRouteName: Ember.computed.alias('controllers.application.currentRouteName'),
    progressTitle: 'Searching',
    searchRoute: null,
    syncStatus: '',

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
                var currentRouteName = this.get('currentRouteName'),
                    currentSearchText = this.get('currentSearchText'),
                    textToFind = this.get('searchText');
                if (currentSearchText !== textToFind || currentRouteName.indexOf('.search') === -1) {
                    this.set('searchText','');
                    this.set('progressMessage','Searching for '+textToFind+'.  Please wait...');
                    this.showProgressModal();
                    this.transitionToRoute(this.searchRoute+"/"+textToFind);
                }
            }
        },

        toggleContent: function(routeName) {
             this.toggleProperty('isShowingContent');
             this.transitionToRoute(routeName);
        },

        toggleSettings: function() {
            this.toggleProperty('isShowingSettings');
        }
    }
});
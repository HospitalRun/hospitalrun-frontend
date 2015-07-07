import Ember from "ember";
import ProgressDialog from "hospitalrun/mixins/progress-dialog";
import UserSession from "hospitalrun/mixins/user-session";
import Navigation from "hospitalrun/mixins/navigation";
export default Ember.Controller.extend(ProgressDialog, UserSession, Navigation, {
    
    needs: 'application',
    allowSearch: false,
    currentSearchText: null,
    currentRouteName: Ember.computed.alias('controllers.application.currentRouteName'),
    progressTitle: 'Searching',
    searchRoute: null,
    syncStatus: '',

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

        navAction: function(nav) {
            this.transitionToRoute(nav.route);
        },

        toggleSettings: function() {
            this.toggleProperty('isShowingSettings');
        }
    }
});
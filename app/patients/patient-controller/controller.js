import Ember from "ember";
import UserSession from "hospitalrun/mixins/user-session";
export default Ember.Controller.extend(UserSession, {
    canAdmitPatient: function() {
        var admitted = this.get('model.admitted');
        if (!admitted) {
            return this.currentUserCan('admit_patient');
        }
    }.property('model.admitted'),
    
    canDischargePatient: function() {
        var admitted = this.get('model.admitted');
        if (admitted) {
            return this.currentUserCan('discharge_patient');
        }
    }.property('model.admitted'),
    
    canDelete: function() {
        return this.parentController.get('canDelete');
    }.property(),
    
    canAdd: function() {
        return this.parentController.get('canAdd');
    }.property(),
    
    showActions: function() {
         return this.parentController.get('showActions');
    }.property()
        

});
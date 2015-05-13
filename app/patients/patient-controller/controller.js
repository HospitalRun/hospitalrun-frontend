import Ember from "ember";
import UserSession from "hospitalrun/mixins/user-session";
export default Ember.ObjectController.extend(UserSession, {
    canAdmitPatient: function() {
        var admitted = this.get('admitted');
        if (!admitted) {
            return this.currentUserCan('admit_patient');
        }
    }.property('admitted'),
    
    canDischargePatient: function() {
        var admitted = this.get('admitted');
        if (admitted) {
            return this.currentUserCan('discharge_patient');
        }
    }.property('admitted'),
    
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
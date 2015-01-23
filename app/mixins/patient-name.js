import Ember from "ember";
export default Ember.Mixin.create({
    getPatientDisplayName: function(patient) {
        var firstName = Ember.get(patient, 'firstName'),
            lastName = Ember.get(patient, 'lastName'),
            returnName = '';
        if (!Ember.isEmpty(firstName)) {
            returnName += firstName;
        }
        if (!Ember.isEmpty(returnName) && !Ember.isEmpty(lastName)) {
            returnName += ' ';
        }
        if (!Ember.isEmpty(lastName)) {
            returnName += lastName;
        }        
        return returnName;    
    }
});
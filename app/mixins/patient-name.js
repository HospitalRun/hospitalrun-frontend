import Ember from 'ember';
export default Ember.Mixin.create({
  getPatientDisplayId: function(patient) {
    var externalPatientId = Ember.get(patient, 'externalPatientId'),
      friendlyId = Ember.get(patient, 'friendlyId'),
      id = Ember.get(patient, 'id');
    if (!Ember.isEmpty(friendlyId)) {
      return friendlyId;
    } else if (!Ember.isEmpty(externalPatientId)) {
      return externalPatientId;
    } else {
      return id;
    }
  },

  getPatientDisplayName: function(patient) {
    var firstName = Ember.get(patient, 'firstName'),
      lastName = Ember.get(patient, 'lastName'),
      middleName = Ember.get(patient, 'middleName'),
      nameArray = [];
    if (!Ember.isEmpty(firstName)) {
      nameArray.push(firstName);
    }
    if (!Ember.isEmpty(middleName)) {
      nameArray.push(middleName);
    }
    if (!Ember.isEmpty(lastName)) {
      nameArray.push(lastName);
    }
    return nameArray.join(' ');
  }
});

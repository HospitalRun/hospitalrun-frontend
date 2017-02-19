import Ember from 'ember';
export default Ember.Mixin.create({
  getPatientDisplayId(patient) {
    let externalPatientId = Ember.get(patient, 'externalPatientId');
    let friendlyId = Ember.get(patient, 'friendlyId');
    let id = Ember.get(patient, 'id');
    if (!Ember.isEmpty(friendlyId)) {
      return friendlyId;
    } else if (!Ember.isEmpty(externalPatientId)) {
      return externalPatientId;
    } else {
      return id;
    }
  },

  getPatientDisplayName(patient, shortName) {
    let firstName = Ember.get(patient, 'firstName');
    let lastName = Ember.get(patient, 'lastName');
    let middleName = Ember.get(patient, 'middleName');
    let nameArray = [];
    if (!Ember.isEmpty(firstName)) {
      nameArray.push(firstName);
    }
    if (!Ember.isEmpty(middleName) && !shortName) {
      nameArray.push(middleName);
    }
    if (!Ember.isEmpty(lastName)) {
      nameArray.push(lastName);
    }
    return nameArray.join(' ');
  }
});

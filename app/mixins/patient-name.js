import { isEmpty } from '@ember/utils';
import { get } from '@ember/object';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
  getPatientDisplayId(patient) {
    let externalPatientId = get(patient, 'externalPatientId');
    let friendlyId = get(patient, 'friendlyId');
    let id = get(patient, 'id');
    if (!isEmpty(friendlyId)) {
      return friendlyId;
    } else if (!isEmpty(externalPatientId)) {
      return externalPatientId;
    } else {
      return id;
    }
  },

  getPatientDisplayName(patient, shortName) {
    let firstName = get(patient, 'firstName');
    let lastName = get(patient, 'lastName');
    let middleName = get(patient, 'middleName');
    let nameArray = [];
    if (!isEmpty(firstName)) {
      nameArray.push(firstName);
    }
    if (!isEmpty(middleName) && !shortName) {
      nameArray.push(middleName);
    }
    if (!isEmpty(lastName)) {
      nameArray.push(lastName);
    }
    return nameArray.join(' ');
  }
});

import { Promise as EmberPromise, resolve } from 'rsvp';
import { isEmpty } from '@ember/utils';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import PatientId from 'hospitalrun/mixins/patient-id';

export default Mixin.create(PatientId, {
  customForms: service(),
  addedNewPatient: false,
  newPatientId: null,

  actions: {
    addedNewPatient(record) {
      this.send('closeModal');
      this.set('addedNewPatient', true);
      this.set('model.patient', record);
      this.set('newPatientId');
      this.send('update');
    }
  },

  addNewPatient() {

    let intl = this.get('intl');
    this.displayAlert(i18n.t('alerts.pleaseWait'), i18n.t('messages.newPatientHasToBeCreated'));
    this._getNewPatientId().then((friendlyId) => {
      let patientTypeAhead = this.get('model.patientTypeAhead');
      let nameParts = patientTypeAhead.split(' ');
      let patientDetails = {
        customForms: EmberObject.create(),
        friendlyId,
        patientFullName: patientTypeAhead,
        requestingController: this
      };
      let customForms = this.get('customForms');
      return customForms.setDefaultCustomForms(['patient', 'socialwork'], patientDetails).then(() => {
        let patient;
        if (nameParts.length >= 3) {
          patientDetails.firstName = nameParts[0];
          patientDetails.middleName = nameParts[1];
          patientDetails.lastName = nameParts.splice(2, nameParts.length).join(' ');
        } else if (nameParts.length === 2) {
          patientDetails.firstName = nameParts[0];
          patientDetails.lastName = nameParts[1];
        } else {
          patientDetails.firstName = patientTypeAhead;
        }
        patient = this.store.createRecord('patient', patientDetails);
        this.send('openModal', 'patients.quick-add', patient);
      });
    });
  },

  _getNewPatientId() {
    let newPatientId = this.get('newPatientId');
    if (isEmpty(newPatientId)) {
      return new EmberPromise(function(resolve, reject) {
        this.generateFriendlyId('patient').then(function(friendlyId) {
          this.set('newPatientId', friendlyId);
          resolve(friendlyId);
        }.bind(this), reject);
      }.bind(this));
    } else {
      return resolve(newPatientId);
    }
  }
});

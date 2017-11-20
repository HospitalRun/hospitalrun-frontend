import Mixin from '@ember/object/mixin';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';

export default Mixin.create(PouchDbMixin, {
  getPatientAppointments(patient) {
    let patientId = patient.get('id');
    let maxValue = this.get('maxValue');
    return this.store.query('appointment', {
      options: {
        startkey: [patientId, null, null, 'appointment_'],
        endkey: [patientId, maxValue, maxValue, maxValue]
      },
      mapReduce: 'appointments_by_patient'
    });
  }
});

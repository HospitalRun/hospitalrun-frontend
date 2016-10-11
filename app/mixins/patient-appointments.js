import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';

export default Ember.Mixin.create(PouchDbMixin, {
  getPatientAppointments: function(patient) {
    var patientId = patient.get('id');
    var maxValue = this.get('maxValue');
    return this.store.query('appointment', {
      options: {
        startkey: [patientId, null, null, 'appointment_'],
        endkey: [patientId, maxValue, maxValue, maxValue]
      },
      mapReduce: 'appointments_by_patient'
    });
  }
});

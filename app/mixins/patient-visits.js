import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
export default Ember.Mixin.create(PouchDbMixin, {
  getPatientVisits: function(patient) {
    var maxValue = this.get('maxValue'),
      patientId = patient.get('id');
    return this.store.query('visit', {
      options: {
        startkey: [patientId, null, null, null, 'visit_'],
        endkey: [patientId, maxValue, maxValue, maxValue, maxValue]
      },
      mapReduce: 'visit_by_patient',
      debug: true
    });
  }
});

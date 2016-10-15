import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
export default Ember.Mixin.create(PouchDbMixin, {
  getPatientVisits: function(patient) {
    let maxValue = this.get('maxValue');
    let patientId = patient.get('id');
    return this.store.query('visit', {
      options: {
        startkey: [patientId, null, null, null, 'visit_'],
        endkey: [patientId, maxValue, maxValue, maxValue, maxValue]
      },
      mapReduce: 'visit_by_patient',
      debug: true
    });
  },

  getNonDischargedVisitsByType: function(visitType) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let maxValue = this.get('maxValue');

      this.store.query('visit', {
        options: {
          startkey: [visitType, 'visit_'],
          endkey: [visitType, maxValue]
        },
        mapReduce: 'nondischarged_visit_by_type'
      }).then(resolve, reject);
    }.bind(this));
  }

});

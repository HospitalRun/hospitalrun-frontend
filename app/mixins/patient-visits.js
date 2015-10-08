import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
export default Ember.Mixin.create(PouchDbMixin, {
  getPatientVisits: function (patient) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      var maxValue = this.get('maxValue'),
        patientId = patient.get('id');
      this.store.find('visit', {
        options: {
          startkey: [patientId, null, null, null, 'visit_'],
          endkey: [patientId, maxValue, maxValue, maxValue, maxValue]
        },
        mapReduce: 'visit_by_patient'
      }).then(resolve, reject);
    }.bind(this));
  }
});

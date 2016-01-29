import Ember from 'ember';
export default Ember.Mixin.create({
  database: Ember.inject.service(),

  /**
   * Lazily load patient list so that it doesn't impact performance.
   */
  _fetchPatientList: function(controller) {
    var patientQuery = {
      startkey: 'patient_',
      endkey: 'patient_\uffff',
      include_docs: true
    };
    var database = this.get('database');
    database.queryMainDB(patientQuery).then(function(result) {
      if (result.rows) {
        var list = result.rows.map(function(row) {
          return row.doc;
        });
        controller.set('patientList', list);
      }
    });
  },

  actions: {
    returnToPatient: function() {
      this.controller.send('returnToPatient');
      this.controller.send('closeModal');
    }
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    this._fetchPatientList(controller);
  }
});

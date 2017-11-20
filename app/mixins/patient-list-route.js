import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
export default Mixin.create({
  database: service(),

  /**
   * Lazily load patient list so that it doesn't impact performance.
   */
  _fetchPatientList(controller) {
    let patientQuery = {
      startkey: 'patient_',
      endkey: 'patient_\uffff',
      include_docs: true
    };
    let database = this.get('database');
    database.queryMainDB(patientQuery).then(function(result) {
      if (result.rows) {
        let list = result.rows.map(function(row) {
          return row.doc;
        });
        controller.set('patientList', list);
      }
    });
  },

  actions: {
    returnToPatient() {
      this.controller.send('returnToPatient');
      this.controller.send('closeModal');
    },

    returnToVisit() {
      this.controller.send('returnToVisit');
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
    this._fetchPatientList(controller);
  }
});

<<<<<<< HEAD
import Ember from 'ember';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';

export default Ember.Mixin.create(PouchDbMixin, {
  getPatientInvoices(patient) {
    let patientId = patient.get('id');
    return this.store.query('invoice', {
      options: {
        key: patientId
      },
      mapReduce: 'invoice_by_patient'
    });
  }
});
=======
import Mixin from '@ember/object/mixin';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';

export default Mixin.create(PouchDbMixin, {
  getPatientInvoices(patient) {
    let patientId = patient.get('id');
    return this.store.query('invoice', {
      options: {
        key: patientId
      },
      mapReduce: 'invoice_by_patient'
    });
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea

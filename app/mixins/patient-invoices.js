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

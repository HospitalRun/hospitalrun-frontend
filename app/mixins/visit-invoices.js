import Mixin from '@ember/object/mixin';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';

export default Mixin.create(PouchDbMixin, {
  getVisitInvoices(visit) {
    let visitId = visit.get('id');
    return this.store.query('invoice', {
      options: {
        key: visitId
      },
      mapReduce: 'invoice_by_visit'
    });
  }
});

import Mixin from '@ember/object/mixin';
import { isEmpty } from '@ember/utils';
import { task, all } from 'ember-concurrency';

export default Mixin.create({

  deleteMany(manyArray) {
    return this.get('deleteManyTask').perform(manyArray);
  },

  deleteManyTask: task(function* (manyArray) {
    if (!manyArray) {
      return;
    }
    let resolvedArray = yield manyArray;
    if (isEmpty(resolvedArray)) {
      // empty array: no records to delete
      return;
    }
    let deleteRecordTask = this.get('deleteRecordTask');
    let archivePromises = [];
    resolvedArray.forEach((recordToDelete) => {
      archivePromises.push(deleteRecordTask.perform(recordToDelete));
    });
    return yield all(archivePromises, 'async array deletion');
  }).group('deleting'),

  deleteRecordTask: task(function* (recordToDelete) {
    recordToDelete.set('archived', true);
    yield recordToDelete.save();
    return yield recordToDelete.unloadRecord();
  }).group('deleting'),

  deleteVisitTask: task(function* (visit) {
    let invoices = yield this.getVisitInvoices(visit);

    let pendingTasks = [];
    let labs = visit.get('labs');
    let procedures = visit.get('procedures');
    let imaging =  visit.get('imaging');
    let procCharges = procedures.get('charges');
    let labCharges = labs.get('charges');
    let imagingCharges = imaging.get('charges');
    let visitCharges = visit.get('charges');
    pendingTasks.push(this.deleteMany(labCharges));
    pendingTasks.push(this.deleteMany(labs));
    pendingTasks.push(this.deleteMany(visit.get('patientNotes')));
    pendingTasks.push(this.deleteMany(visit.get('vitals')));
    pendingTasks.push(this.deleteMany(procCharges));
    pendingTasks.push(this.deleteMany(procedures));
    pendingTasks.push(this.deleteMany(visit.get('medication')));
    pendingTasks.push(this.deleteMany(imagingCharges));
    pendingTasks.push(this.deleteMany(imaging));
    pendingTasks.push(this.deleteMany(visitCharges));
    pendingTasks.push(this.deleteInvoices(invoices));

    // yield visit.destroyRecord();
    yield this.get('deleteRecordTask').perform(visit);
    return yield all(pendingTasks);
  }).group('deleting'),

  getVisitInvoices(visit) {
    let visitId = visit.get('id');
    return this.store.query('invoice', {
      options: {
        key: visitId
      },
      mapReduce: 'invoice_by_visit'
    });
  },

  deleteInvoices(invoices) {
    return this.get('deleteInvoicesTask').perform(invoices);
  },

  deleteInvoicesTask: task(function* (invoicesToDelete) {
    let pendingTasks = [];
    let invoices = yield invoicesToDelete;
    let lineItems = invoices.mapBy('lineItems');
    pendingTasks.push(this.deleteMany(invoices));
    lineItems.forEach((item) => {
      let itemDetails = item.mapBy('details');
      pendingTasks.push(this.deleteMany(item));
      itemDetails.forEach((detail) => {
        pendingTasks.push(this.deleteMany(detail));
      });
    });
    return yield all(pendingTasks);
  }).group('deleting')

});

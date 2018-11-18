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
    pendingTasks.push(this.deleteMany(labs));
    pendingTasks.push(this.deleteMany(labCharges));
    pendingTasks.push(this.deleteMany(visit.get('patientNotes')));
    pendingTasks.push(this.deleteMany(visit.get('vitals')));
    pendingTasks.push(this.deleteMany(procedures));
    pendingTasks.push(this.deleteMany(procCharges));
    pendingTasks.push(this.deleteMany(visit.get('medication')));
    pendingTasks.push(this.deleteMany(imaging));
    pendingTasks.push(this.deleteMany(imagingCharges));
    pendingTasks.push(this.deleteMany(visitCharges));
    pendingTasks.push(this.deleteInvoices(invoices));

    // this is to hide the visit's procedures/labs/imaging/medication details from being shown on the patient/edit template
    // which otherwise causes errors while deleting visit from patient/edit screen, due to attempting to calculate computed properties
    // on some of these records (which template refers to) while other records are being deleted
    visit.set('willBeDeleted', true);

    yield all(pendingTasks);
    return yield this.get('deleteRecordTask').perform(visit);
  }).group('deleting'),

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

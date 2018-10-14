import { isEmpty } from '@ember/utils';
import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import { translationMacro as t } from 'ember-i18n';
import { task, taskGroup, all } from 'ember-concurrency';

export default AbstractDeleteController.extend(PouchDbMixin, ProgressDialog, {

  // these should be added to translations
  title: 'Delete Visit',
  progressTitle: t('Delete Visit Record'),
  progressMessage: t('Deleting visit and all associated records'),
  deleting: taskGroup(),

  deleteMany(manyArray) {
    console.log('deleteMany: the things being deleted were: ');
    console.log(manyArray);
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

  // Override delete action on controller; we must delete
  // all related records before deleting visit record
  // otherwise errors will occur
  deleteVisit() {
    return this.get('deleteVisitTask').perform();
  },

  deleteVisitTask: task(function* () {
    let visit = this.get('model');
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

    yield all(pendingTasks);
    return yield visit.destroyRecord();
  }).group('deleting'),

  deleteInvoices(visitInvoices) {
    return this.get('deleteInvoicesTask').perform(visitInvoices);
  },

  getVisitInvoices(visit) {
    let visitId = visit.get('id');
    return this.store.query('invoice', {
      options: {
        key: visitId
      },
      mapReduce: 'invoice_by_visit'
    });
  },

  deleteInvoicesTask: task(function* (visitInvoices) {
    let pendingTasks = [];
    let invoices = yield visitInvoices;
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
  }).group('deleting'),

  deleteActionTask: task(function* (visit) {
    // delete related records without modal dialogs
    this.send('closeModal');
    this.showProgressModal();
    yield this.deleteVisit(visit);
    this.closeProgressModal();
    this.send(this.get('afterDeleteAction'), visit);
  }).drop(),

  afterDeleteAction: computed('model.deleteFromPatient', function() {
    let deleteFromPatient = this.get('model.deleteFromPatient');
    if (deleteFromPatient) {
      return 'visitDeleted';
    } else {
      return 'closeModal';
    }
  }),

  actions: {
    delete(visit) {
      this.get('deleteActionTask').perform(visit);
    }
  }
});

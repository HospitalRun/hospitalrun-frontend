import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PatientVisitsMixin from 'hospitalrun/mixins/patient-visits';
import PatientAppointmentsMixin from 'hospitalrun/mixins/patient-appointments';
import PatientInvoicesMixin from 'hospitalrun/mixins/patient-invoices';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
import { task, taskGroup, all } from 'ember-concurrency';

const MAX_CONCURRENCY = 5;

export default AbstractDeleteController.extend(PatientVisitsMixin, PatientInvoicesMixin, PouchDbMixin, ProgressDialog, PatientAppointmentsMixin, {
  title: t('patients.titles.delete'),
  progressTitle: t('patients.titles.deletePatientRecord'),
  progressMessage: t('patients.messages.deletingPatient'),
  deleting: taskGroup(),

  deleteMany(manyArray) {
    return this.get('deleteManyTask').perform(manyArray);
  },

  deleteManyTask: task(function* (manyArray) {
    if (!manyArray) {
      return;
    }
    let resolvedArray = yield manyArray;
    if (Ember.isEmpty(resolvedArray)) {
      // empty array: no records to delete
      return;
    }
    let deleteRecordTask = this.get('deleteRecordTask');
    let archivePromises = [];
    for (let recordToDelete of resolvedArray) {
      archivePromises.push(deleteRecordTask.perform(recordToDelete));
    }
    return yield all(archivePromises, 'async array deletion');
  }).group('deleting'),

  deleteRecordTask: task(function* (recordToDelete) {
    recordToDelete.set('archived', true);
    yield recordToDelete.save();
    return yield recordToDelete.unloadRecord();
  }).maxConcurrency(MAX_CONCURRENCY).enqueue().group('deleting'),

  // Override delete action on controller; we must delete
  // all related records before deleting patient record
  // otherwise errors will occur
  deletePatient() {
    return this.get('deletePatientTask').perform();
  },

  deletePatientTask: task(function* () {
    let patient = this.get('model');
    let visits = yield this.getPatientVisits(patient);
    let invoices = yield this.getPatientInvoices(patient);
    let appointments = yield this.getPatientAppointments(patient);
    let payments = yield patient.get('payments');
    yield all([
      this.deleteVisits(visits),
      this.deleteInvoices(invoices),
      this.deleteMany(appointments),
      this.deleteMany(payments)
    ]);
    return yield patient.destroyRecord();
  }).group('deleting'),

  deleteVisits(visits) {
    return this.get('deleteVisitsTask').perform(visits);
  },

  deleteVisitsTask: task(function* (visits) {
    let pendingTasks = [];
    for (let visit of visits) {
      let labs = yield visit.get('labs');
      let procedures = yield visit.get('procedures');
      let imaging = yield visit.get('imaging');
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
    }
    yield all(pendingTasks);
    return yield this.deleteMany(visits);
  }).group('deleting'),

  deleteInvoices(patientInvoices) {
    return this.get('deleteInvoicesTask').perform(patientInvoices);
  },

  deleteInvoicesTask: task(function* (patientInvoices) {
    let invoices = yield patientInvoices;
    let lineItems = yield all(invoices.mapBy('lineItems'));
    let lineItemDetails = yield all(lineItems.mapBy('details'));
    return yield all([
      this.deleteMany(invoices),
      this.deleteMany(lineItems),
      this.deleteMany(lineItemDetails)
    ]);
  }).group('deleting'),

  deleteActionTask: task(function* (patient) {
    // delete related records without modal dialogs
    this.send('closeModal');
    this.showProgressModal();
    yield this.deletePatient(patient);
    this.closeProgressModal();
    this.send(this.get('afterDeleteAction'), patient);
  }).drop(),

  actions: {
    delete(patient) {
      this.get('deleteActionTask').perform(patient);
    }
  }
});

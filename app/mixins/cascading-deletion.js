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

  deletePatient(patient) {
    return this.get('deletePatientTask').perform(patient);
  },

  deletePatientTask: task(function* (patient) {
    let pendingTasks = [];
    let visits = yield this.getPatientVisits(patient);
    let appointments = yield this.getPatientAppointments(patient);
    let payments = yield patient.get('payments');
    let diagnoses = yield patient.get('diagnoses');
    let allergies = yield patient.get('allergies');
    let operationReports = yield patient.get('operationReports');
    let operativePlans = yield patient.get('operativePlans');
    operationReports.forEach((operationReport) => {
      pendingTasks.push(this.deleteMany(operationReport.get('diagnoses')));
    });
    operationReports.forEach((operationReport) => {
      pendingTasks.push(this.deleteMany(operationReport.get('preOpDiagnoses')));
    });
    operativePlans.forEach((operativePlan) => {
      pendingTasks.push(this.deleteMany(operativePlan.get('diagnoses')));
    });
    pendingTasks.push(this.deleteVisits(visits));
    pendingTasks.push(this.deleteMany(appointments));
    pendingTasks.push(this.deleteMany(payments));
    pendingTasks.push(this.deleteMany(diagnoses));
    pendingTasks.push(this.deleteMany(allergies));
    pendingTasks.push(this.deleteMany(operationReports));
    pendingTasks.push(this.deleteMany(operativePlans));

    yield all(pendingTasks);
    return yield this.get('deleteRecordTask').perform(patient);
  }).group('deleting'),

  deleteVisits(visits) {
    return this.get('deleteVisitsTask').perform(visits);
  },

  deleteVisitsTask: task(function* (visits) {
    let deleteVisitTask = this.get('deleteVisitTask');
    let pendingTasks = [];
    visits.forEach((visit) => {
      pendingTasks.push(deleteVisitTask.perform(visit));
    });
    yield all(pendingTasks);
  }).group('deleting'),

  deleteVisit(visit) {
    return this.get('deleteVisitTask').perform(visit);
  },

  deleteVisitTask: task(function* (visit) {
    let invoices = yield this.getVisitInvoices(visit);
    let pendingTasks = [];
    let labs = visit.get('labs');
    let procedures = visit.get('procedures');
    let imaging =  visit.get('imaging');
    procedures.forEach((procedure) => {
      pendingTasks.push(this.deleteMany(procedure.get('charges')));
    });
    labs.forEach((lab) => {
      pendingTasks.push(this.deleteMany(lab.get('charges')));
    });
    imaging.forEach((imaging) => {
      pendingTasks.push(this.deleteMany(imaging.get('charges')));
    });
    pendingTasks.push(this.deleteMany(labs));
    pendingTasks.push(this.deleteMany(procedures));
    pendingTasks.push(this.deleteMany(imaging));
    pendingTasks.push(this.deleteMany(visit.get('charges')));
    pendingTasks.push(this.deleteMany(visit.get('reports')));
    pendingTasks.push(this.deleteMany(visit.get('patientNotes')));
    pendingTasks.push(this.deleteMany(visit.get('vitals')));
    pendingTasks.push(this.deleteMany(visit.get('medication')));
    pendingTasks.push(this.deleteMany(visit.get('diagnoses')));
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

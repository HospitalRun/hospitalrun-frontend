import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PatientVisitsMixin from 'hospitalrun/mixins/patient-visits';
import PatientAppointmentsMixin from 'hospitalrun/mixins/patient-appointments';
import VisitInvoicesMixin from 'hospitalrun/mixins/visit-invoices';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import CascadingDeletions from 'hospitalrun/mixins/cascading-deletion';
import { t } from 'hospitalrun/macro';
import { task, taskGroup, all } from 'ember-concurrency';

export default AbstractDeleteController.extend(PatientVisitsMixin, PouchDbMixin, ProgressDialog, PatientAppointmentsMixin, VisitInvoicesMixin, CascadingDeletions, {
  title: t('patients.titles.delete'),
  progressTitle: t('patients.titles.deletePatientRecord'),
  progressMessage: t('patients.messages.deletingPatient'),
  deleting: taskGroup(),

  deletePatient(patient) {
    return this.get('deletePatientTask').perform(patient);
  },

  deletePatientTask: task(function* (patient) {
    let visits = yield this.getPatientVisits(patient);
    let appointments = yield this.getPatientAppointments(patient);
    let payments = yield patient.get('payments');
    yield all([
      this.deleteVisits(visits),
      this.deleteMany(appointments),
      this.deleteMany(payments)
    ]);
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

  deleteActionTask: task(function* (patient) {
    // delete related records without modal dialogs
    this.send('closeModal');
    this.showProgressModal();
    yield this.deletePatient(patient);
    this.closeProgressModal();
    this.send(this.get('afterDeleteAction'), patient);
  }).drop(),

  actions: {
    delete() {
      let patient = this.get('model');
      this.get('deleteActionTask').perform(patient);
    }
  }
});

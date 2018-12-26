import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PatientVisitsMixin from 'hospitalrun/mixins/patient-visits';
import PatientAppointmentsMixin from 'hospitalrun/mixins/patient-appointments';
import VisitInvoicesMixin from 'hospitalrun/mixins/visit-invoices';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import CascadingDeletion from 'hospitalrun/mixins/cascading-deletion';
import { t } from 'hospitalrun/macro';
import { task, taskGroup } from 'ember-concurrency';

export default AbstractDeleteController.extend(PatientVisitsMixin, PouchDbMixin, ProgressDialog, PatientAppointmentsMixin, VisitInvoicesMixin, CascadingDeletion, {
  title: t('patients.titles.delete'),
  progressTitle: t('patients.titles.deletePatientRecord'),
  progressMessage: t('patients.messages.deletingPatient'),
  deleting: taskGroup(),

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

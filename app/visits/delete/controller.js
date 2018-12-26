import { computed } from '@ember/object';
import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import VisitInvoicesMixin from 'hospitalrun/mixins/visit-invoices';
import ProgressDialog from 'hospitalrun/mixins/progress-dialog';
import CascadingDeletion from 'hospitalrun/mixins/cascading-deletion';
import { t } from 'hospitalrun/macro';
import { task, taskGroup } from 'ember-concurrency';

export default AbstractDeleteController.extend(ProgressDialog, VisitInvoicesMixin, CascadingDeletion, {
  title: t('visits.titles.delete'),
  progressTitle: t('visits.titles.deleteVisitRecord'),
  progressMessage: t('visits.messages.deletingVisit'),
  deleting: taskGroup(),

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
    delete() {
      let visit = this.get('model');
      this.get('deleteActionTask').perform(visit);
    }
  }
});

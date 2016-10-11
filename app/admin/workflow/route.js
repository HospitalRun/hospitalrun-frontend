import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import { translationMacro as t } from 'ember-i18n';
export default AbstractEditRoute.extend({
  hideNewButton: true,
  editTitle: t('admin.workflow.editTitle'),

  model: function() {
    let store = this.get('store');
    return store.find('option', 'workflow_options').catch(function() {
      // create a new workflow_option if none exists
      return store.push(store.normalize('option', {
        id: 'workflow_options',
        value: {
          admissionDeposit: false,
          clinicPrepayment: false,
          followupPrepayment: false,
          outpatientLabPrepayment: false,
          outpatientImagingPrepayment: false,
          outpatientMedicationPrepayment: false
        }
      }));
    });
  }
});

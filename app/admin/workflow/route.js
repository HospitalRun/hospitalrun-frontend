import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractEditRoute.extend({
  hideNewButton: true,
  editTitle: t('admin.workflow.edit_title'),

  model: function() {
    var store = this.get('store');
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

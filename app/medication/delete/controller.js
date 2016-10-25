import { translationMacro as t } from 'ember-i18n';
import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
export default AbstractDeleteController.extend(PatientSubmodule, {
  title: t('labels.delete_request'),

  actions: {
    delete: function() {
      this.deleteChildFromVisit('medication');
    }
  }
});

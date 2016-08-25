import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import { translationMacro as t } from 'ember-i18n';

export default AbstractDeleteController.extend(PatientSubmodule, {
  title: t('labs.deleteTitle'),

  actions: {
    delete: function() {
      this.deleteChildFromVisit('labs');
    }
  }
});

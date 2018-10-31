import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import { translationMacro as t } from 'ember-intl';

export default AbstractDeleteController.extend(PatientSubmodule, {
  title: t('labs.deleteTitle'),

  actions: {
    delete() {
      this.deleteChildFromVisit('labs');
    }
  }
});

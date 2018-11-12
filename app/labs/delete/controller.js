import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import { t } from 'hospitalrun/macro';

export default AbstractDeleteController.extend(PatientSubmodule, {
  title: t('labs.deleteTitle'),

  actions: {
    delete() {
      this.deleteChildFromVisit('labs');
    }
  }
});

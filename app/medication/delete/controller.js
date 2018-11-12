import { t } from 'hospitalrun/macro';
import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
export default AbstractDeleteController.extend(PatientSubmodule, {
  title: t('labels.delete_request'),

  actions: {
    delete() {
      this.deleteChildFromVisit('medication');
    }
  }
});

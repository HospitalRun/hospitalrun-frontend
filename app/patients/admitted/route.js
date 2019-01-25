import { t } from 'hospitalrun/macro';
import PatientsIndexRoute from 'hospitalrun/patients/index/route';
export default PatientsIndexRoute.extend({
  pageTitle: t('patients.titles.admittedPatients'),

  _modelQueryParams() {
    return {
      mapReduce: 'patient_by_admission'
    };
  }
});

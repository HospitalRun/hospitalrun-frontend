import { translationMacro as t } from 'ember-i18n';
import PatientsIndexRoute from 'hospitalrun/patients/index/route';
export default PatientsIndexRoute.extend({
  pageTitle: t('patients.titles.admittedPatients'),

  _modelQueryParams: function() {
    return {
      mapReduce: 'patient_by_admission'
    };
  }
});

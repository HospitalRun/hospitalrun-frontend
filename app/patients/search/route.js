import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
import PatientSearch from 'hospitalrun/utils/patient-search';
export default AbstractSearchRoute.extend({
  moduleName: 'patients',
  searchKeys: [
    'friendlyId',
    'externalPatientId',
    'firstName',
    'lastName'
  ],
  searchIndex: PatientSearch,
  searchModel: 'patient'
});

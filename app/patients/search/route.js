import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
import PatientSearch from 'hospitalrun/utils/patient-search';
export default AbstractSearchRoute.extend({
  moduleName: 'patients',
  searchKeys: [
    'friendlyId',
    'externalPatientId',
    'firstName',
    'lastName',
    'phone'
  ],
  searchIndex: PatientSearch,
  searchModel: 'patient'
});

import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
  moduleName: 'patients',
  searchKeys: [{
    name: 'friendlyId',
    type: 'contains'
  }, {
    name: 'externalPatientId',
    type: 'contains'
  }, {
    name: 'firstName',
    type: 'fuzzy'
  }, {
    name: 'lastName',
    type: 'fuzzy'
  }, {
    name: 'phone',
    type: 'contains'
  }],
  searchModel: 'patient'
});

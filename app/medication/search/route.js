import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
  moduleName: 'medication',
  searchKeys: [{
    name: 'medicationTitle',
    type: 'fuzzy'
  }, {
    name: 'prescription',
    type: 'contains'
  }, {
    name: 'requestedBy',
    type: 'contains'
  }],
  searchModel: 'medication'
});

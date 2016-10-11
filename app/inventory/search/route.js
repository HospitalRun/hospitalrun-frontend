import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
  moduleName: 'inventory',
  searchKeys: [{
    name: 'crossReference',
    type: 'contains'
  }, {
    name: 'description',
    type: 'fuzzy'
  }, {
    name: 'friendlyId',
    type: 'contains'
  }, {
    name: 'name',
    type: 'fuzzy'
  }],
  searchModel: 'inventory'
});

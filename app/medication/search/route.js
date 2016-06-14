import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
  moduleName: 'medication',
  searchKeys: [{
    name: 'prescription',
    type: 'contains'
  }],
  searchModel: 'medication'
});

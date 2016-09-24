import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
  moduleName: 'pricing',
  searchKeys: [{
    'name': 'fuzzy'
  }],
  searchModel: 'pricing'
});

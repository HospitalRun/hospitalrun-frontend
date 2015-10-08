import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
  moduleName: 'visits',
  searchKeys: [
    '_id',
    'firstName',
    'lastName'
  ],
  searchModel: 'visit'
});

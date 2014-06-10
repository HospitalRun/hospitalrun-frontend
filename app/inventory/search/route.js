import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
    moduleName: 'inventory',
    searchKeys: [
        '_id',
        'description',
        'name',
        'crossreference'
    ],
    searchModel: 'inventory'
});

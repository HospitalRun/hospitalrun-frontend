import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
    moduleName: 'inventory',
    searchKeys: [
        '_id',
        'crossReference',
        'description',
        'friendlyId',
        'name'
    ],
    searchModel: 'inventory'
});

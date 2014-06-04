import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
    searchKeys: [
        '_id',
        'description',
        'name',
        'crossreference'
    ],
    searchModel: 'inventory'
});

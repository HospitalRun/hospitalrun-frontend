import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
	moduleName: 'medication',
    searchKeys: [
        'prescription'
    ],
    searchModel: 'medication'
});
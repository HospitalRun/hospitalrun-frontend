import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
    moduleName: 'patients',
    searchKeys: [
         '_id',
        'firstName',
        'lastName'
    ],
    searchModel: 'patient'
});

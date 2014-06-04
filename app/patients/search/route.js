import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
    searchKeys: [
        'firstName',
        'lastName'
    ],
    searchModel: 'patient'
});

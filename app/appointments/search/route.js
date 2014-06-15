import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
export default AbstractSearchRoute.extend({
    moduleName: 'appointments',
    searchKeys: [
        'patientId',
        'patientName',
        'locationName',
        'staffName'
    ],
    searchModel: 'appointment'
});

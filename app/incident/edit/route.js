import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
//import ChargeRoute from 'hospitalrun/mixins/charge-route';
export default AbstractEditRoute.extend({
    editTitle: 'Edit Incident',
    modelName: 'incident',
    newTitle: 'New Incident'
});
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
    editTitle: 'Edit Lab Request',
    modelName: 'lab',
    newTitle: 'New Lab Request',
    
    getNewData: function() {
        return {
            selectPatient: true,
            requestDate: moment().startOf('day').toDate()
        };
    }
});
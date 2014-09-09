import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
    editTitle: 'Edit Imaging Request',
    modelName: 'imaging',
    newTitle: 'New Imaging Request',
    
    getNewData: function() {
        return {
            selectPatient: true,
            requestDate: moment().startOf('day').toDate()
        };
    }
});
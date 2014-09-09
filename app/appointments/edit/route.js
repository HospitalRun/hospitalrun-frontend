import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
    editTitle: 'Edit Appointment',
    modelName: 'appointment',
    newTitle: 'New Appointment',
    
    getNewData: function() {
        return {
            selectPatient: true
        };
    },
});
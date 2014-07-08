import AbstractItemRoute from 'hospitalrun/routes/abstract-item-route';
export default AbstractItemRoute.extend({
    currentScreenTitle: 'Appointment List',
    editTitle: 'Edit Appointment',    
    newTitle: 'New Appointment',
    modelName: 'appointment',
    moduleName: 'appointments',
    newButtonText: '+ new appointment',
    sectionTitle: 'Appointments'
});
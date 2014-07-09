import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
    currentScreenTitle: 'Appointment List',
    editTitle: 'Edit Appointment',    
    newTitle: 'New Appointment',
    modelName: 'appointment',
    moduleName: 'appointments',
    newButtonText: '+ new appointment',
    sectionTitle: 'Appointments'
});
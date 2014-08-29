import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractModuleRoute.extend(UserSession,{
    addCapability: 'add_appointment',
    currentScreenTitle: 'Appointment List',
    editTitle: 'Edit Appointment',    
    newTitle: 'New Appointment',
    modelName: 'appointment',
    moduleName: 'appointments',
    newButtonText: '+ new appointment',
    sectionTitle: 'Appointments',
    
    additionalModels: [{ 
        name: 'physicianList',
        findArgs: ['lookup','physician_list']
    },  {
        name: 'locationList',
        findArgs: ['lookup','location_list']
    }, {
        name: 'patientList',
        findArgs: ['patient']
    }],    
    
    getNewData: function() {
        return {
            selectPatient: true
        };
    }
});
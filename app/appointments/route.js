import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractModuleRoute.extend(UserSession,{
    currentScreenTitle: 'Appointment List',
    editTitle: 'Edit Appointment',    
    newTitle: 'New Appointment',
    modelName: 'appointment',
    moduleName: 'appointments',
    newButtonText: '+ new appointment',
    sectionTitle: 'Appointments',
    
    newButtonAction: function() {
        if (this.currentUserCan('add_appointment')) {
            return 'newItem';
        } else {
            return null;
        }
    }.property(),
    
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
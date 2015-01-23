import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractModuleRoute.extend(UserSession,{
    addCapability: 'add_appointment',
    allowSearch: false,
    currentScreenTitle: 'Appointment List',
    editTitle: 'Edit Appointment',    
    newTitle: 'New Appointment',
    moduleName: 'appointments',
    newButtonText: '+ new appointment',
    sectionTitle: 'Appointments',
    
    actions: {
        createVisit: function(appointment) {
            var visitProps = appointment.getProperties('startDate', 'endDate', 'location', 'patient'),
                visit;            
            visitProps.visitType = appointment.get('appointmentType');
            visitProps.examiner = appointment.get('provider');
            visit = this.get('store').createRecord('visit', visitProps);
            this.transitionTo('visits.edit', visit);
        }        
    },
    
    additionalModels: [{ 
        name: 'physicianList',
        findArgs: ['lookup','physician_list']
    },  {
        name: 'locationList',
        findArgs: ['lookup','visit_location_list']
    }],    
    
    getNewData: function() {
        return {
            selectPatient: true
        };
    },
    
    subActions: [{
        text: 'This Week',
        linkTo: 'appointments.index'
    }, {
        text: 'Today',
        linkTo: 'appointments.today'
    }, {
        text: 'Search',
        linkTo: 'appointments.search'
    }]
});
import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractPagedController.extend(UserSession, {
    canAddVisit: function() {
        return this.currentUserCan('add_visit');
    }.property(),
    
    canEdit: function() {
        //Add and edit are the same capability
        return this.currentUserCan('add_appointment');
    }.property(),    

    canDelete: function() {
        return this.currentUserCan('delete_appointment');
    }.property(),
        
    sortProperties: ['startDate', 'endDate'],
    sortAscending: true,
    
    todaysAppointments: Ember.computed.filter('arrangedContent', function(appointment) {        
        var endDate = appointment.get('endDate'),
            startDate = appointment.get('startDate'),
            today = moment();    
        return today.isSame(endDate, 'day') || today.isSame(startDate, 'day');
    }),
    
    thisWeeksAppointments: Ember.computed.filter('arrangedContent', function(appointment) {
        var endDate = appointment.get('endDate'),
            startDate = appointment.get('startDate'),
            today = moment();    
        return today.isSame(endDate, 'week') || today.isSame(startDate, 'week');
    })
    
});
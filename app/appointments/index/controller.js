import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
export default AbstractPagedController.extend({
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
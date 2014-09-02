import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    pageTitle: 'Today\'s Appointments',
    
    actions: {
        editAppointment: function(appointment) {
            appointment.set('returnTo', 'appointments.today');
            this.send('editItem', appointment);
        },
    },
    
    model: function() {
        //Filter to only display today's appointments by default
        return this.store.filter('appointment', function(appointment) {
            var endDate = appointment.get('endDate'),
            startDate = appointment.get('startDate'),
            today = moment();    
            return today.isSame(endDate, 'day') || today.isSame(startDate, 'day');
        });
    }
});
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    pageTitle: 'Appointments This Week',
    
    actions: {
        createVisit: function(appointment) {
            var visitProps = appointment.getProperties('startDate', 'endDate', 'location', 'patient'),
                visit;            
            visitProps.visitType = appointment.get('appointmentType');
            visitProps.examiner = appointment.get('provider');
            visit = this.get('store').createRecord('visit', visitProps);
            this.transitionTo('visits.edit', visit);
        },
        editAppointment: function(appointment) {
            appointment.set('returnTo', 'appointments.index');
            this.send('editItem', appointment);
        },
    },
    
    model: function() {
        //Filter to only display this week's appointments by default
        return this.store.filter('appointment', function(appointment) {
            var endDate = appointment.get('endDate'),
            startDate = appointment.get('startDate'),
            today = moment();    
            return today.isSame(endDate, 'week') || today.isSame(startDate, 'week');
        });
    }
});
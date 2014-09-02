import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    pageTitle: 'Search Appointments',
    
    actions: {
        editAppointment: function(appointment) {
            appointment.set('returnTo', 'appointments.search');
            this.send('editItem', appointment);
        },
    },
    
    model: function() {
        return this.store.find('appointment');
    }
});
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    pageTitle: 'Upcoming',
    
    actions: {
        createVisit: function(appointment) {
            var visitProps = appointment.getProperties('startDate', 'endDate', 'location', 'patient'),
                visit;            
            visitProps.visitType = appointment.get('appointmentType');
            visitProps.examiner = appointment.get('provider');
            visit = this.get('store').createRecord('visit', visitProps);
            this.transitionTo('visits.edit', visit);
        }
    }
});
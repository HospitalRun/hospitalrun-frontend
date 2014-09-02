import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
export default AppointmentIndexController.extend({
    startingDate: null,
    _setup: function() {    
        this.set('startingDate', new Date());
    }.on('init'),
    
    matchingAppointments: function() {
        var arrangedContent = this.get('arrangedContent'),
            startingDate = moment(this.getWithDefault('startingDate', new Date()));
        return arrangedContent.filter(function (appointment) {
            var endDate = moment(appointment.get('endDate')),
                startDate = moment(appointment.get('startDate'));
            return startingDate.isSame(endDate, 'day') || startingDate.isSame(startDate, 'day') || endDate.isAfter(startingDate, 'day') || startDate.isAfter(startingDate, 'day');
        });
    }.property('content.@each', 'startingDate'),
    
});
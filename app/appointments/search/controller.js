import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
export default AppointmentIndexController.extend({
    startingDate: null,
    _setup: function() {    
        this.set('startingDate', new Date());
    }.on('init'),
    
    appointmentList: function() {
        var matchingAppointments = this.get('matchingAppointments');
        var limit = this.get('limit'),
            offset = this.get('offset');
        return matchingAppointments.slice(offset, offset+limit);
    }.property('matchingAppointments.@each.lastModified', 'offset', 'limit'),
    
    disableNextPage: function() {
    var limit = this.get('limit'),
        length = this.get('matchingAppointments.length'),
        offset = this.get('offset');
        return ((offset+limit) >= length);
    }.property('offset','limit','matchingAppointments.length'),
    
    showPagination: function() {
        var length = this.get('matchingAppointments.length'),
            limit = this.get('limit');
        return (length > limit);            
    }.property('matchingAppointments.length'),
    
    startingDateChanged: function() {
        this.set('offset', 0);
    }.observes('startingDate'),
    
    matchingAppointments: function() {
        var content = this.get('allArrangedContent'),
            startingDate = moment(this.getWithDefault('startingDate', new Date()));
        return content.filter(function (appointment) {
            var endDate = moment(appointment.get('endDate')),
                startDate = moment(appointment.get('startDate'));
            return startingDate.isSame(endDate, 'day') || startingDate.isSame(startDate, 'day') || endDate.isAfter(startingDate, 'day') || startDate.isAfter(startingDate, 'day');
        });
    }.property('allArrangedContent.@each', 'startingDate'),
    
});
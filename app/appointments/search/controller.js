import AppointmentIndexController from 'hospitalrun/appointments/index/controller';
export default AppointmentIndexController.extend({
    startingDate: null,
    _setup: function() {    
        this.set('startingDate', new Date());
    }.on('init'),
    
  arrangedContent: function() {
        var arrangedContent = this.get('matchingAppointments');
        var limit = this.get('limit'),
            offset = this.get('offset');
        return arrangedContent.slice(offset, offset+limit);
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
    
    
    matchingAppointments: function() {
        var content = this.get('content'),
            startingDate = moment(this.getWithDefault('startingDate', new Date()));
        this.set('offset', 0);
        return content.filter(function (appointment) {
            var endDate = moment(appointment.get('endDate')),
                startDate = moment(appointment.get('startDate'));
            return startingDate.isSame(endDate, 'day') || startingDate.isSame(startDate, 'day') || endDate.isAfter(startingDate, 'day') || startDate.isAfter(startingDate, 'day');
        });
    }.property('content.@each', 'startingDate'),
    
});
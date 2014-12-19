import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
export default AppointmentIndexRoute.extend({
    editReturn: 'appointments.today',
    modelName: 'appointment',
    pageTitle: 'Today\'s Appointments',
    
    _modelQueryParams: function() {
        var endOfDay = moment().endOf('day').toDate().getTime(),
            startOfDay= moment().startOf('day').toDate().getTime();
        return {
            options: {
                startkey: [startOfDay,],
                endkey: [endOfDay, endOfDay,'appointment_\uffff']
            },
            mapReduce: 'appointments_by_date'
        };
    }
});
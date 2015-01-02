import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
export default AppointmentIndexRoute.extend({
    editReturn: 'appointments.today',
    modelName: 'appointment',
    pageTitle: 'Today\'s Appointments',
    
    _modelQueryParams: function() {
        var endOfDay = moment().endOf('day').toDate().getTime(),
            maxValue = this.get('maxValue'),
            startOfDay= moment().startOf('day').toDate().getTime();
        return {
            options: {
                startkey: [startOfDay,,,'appointment_'],
                endkey: [endOfDay, endOfDay, 'patient_'+maxValue, 'appointment_'+maxValue]
            },
            mapReduce: 'appointments_by_date'
        };
    }
});
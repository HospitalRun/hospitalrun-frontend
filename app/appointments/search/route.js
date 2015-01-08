import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import Ember from 'ember';
export default AppointmentIndexRoute.extend({
    editReturn: 'appointments.search',    
    modelName: 'appointment',
    pageTitle: 'Search Appointments',
    
    _modelQueryParams: function(params) {
        var startDate,
            maxValue = this.get('maxValue'),
            startKey = params.startKey;
        if (Ember.isEmpty(startKey)) {
            startDate = moment();
        } else {
            startDate = moment(startKey[0]);
        }
        var startOfDay = startDate.startOf('day').toDate().getTime();
        var endTime = startDate.add(1, 'y').endOf('day').toDate().getTime();
        return {
            options: {
                startkey: [startOfDay,,'appointment_'],
                endkey: [endTime, endTime, 'appointment_'+maxValue]
            },
            mapReduce: 'appointments_by_date'
        };
    }
});
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
    editReturn: 'appointments.index',
    modelName: 'appointment',
    pageTitle: 'Appointments This Week',

    _getStartKeyFromItem: function(item) {
        var endDate = item.get('endDate'),
            startDate = item.get('startDate');
        if (endDate && endDate !== '') {
            endDate = new Date(endDate);
            if (endDate.getTime) {
                endDate = endDate.getTime();
            }
        }
        if (startDate && startDate !== '') {
            startDate = new Date(startDate);
            if (startDate.getTime) {
                startDate = startDate.getTime(); 
            }
        }
        return ['patient_'+item.get('patient.id'), startDate, endDate, 'appointment_'+item.get('id')];
    },

    _modelQueryParams: function() {
        var endOfWeek = moment().endOf('week').toDate().getTime(),
            maxValue = this.get('maxValue'),
            startOfWeek = moment().startOf('week').toDate().getTime();
        return {
            options: {
                startkey: ['patient_', startOfWeek,,'appointment_'],
                endkey: ['patient_'+maxValue, endOfWeek, endOfWeek, 'appointment_'+maxValue]
            },
            mapReduce: 'appointments_by_patient'
        };
    },
    
    actions: {
        editAppointment: function(appointment) {
            appointment.set('returnTo', this.get('editReturn'));
            this.send('editItem', appointment);
        }
    }
});
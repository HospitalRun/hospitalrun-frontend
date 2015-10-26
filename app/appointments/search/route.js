import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import DateFormat from 'hospitalrun/mixins/date-format';
import Ember from 'ember';
export default AppointmentIndexRoute.extend(DateFormat, {
  editReturn: 'appointments.search',
  filterParams: ['appointmentType', 'provider', 'status'],
  modelName: 'appointment',
  pageTitle: 'Search Appointments',

  queryParams: {
    appointmentType: { refreshModel: true },
    provider: { refreshModel: true },
    status: { refreshModel: true },
    startDate: { refreshModel: true },
    startKey: { refreshModel: true }
  },

  _modelQueryParams: function(params) {
    var startDate = params.startDate,
      maxValue = this.get('maxValue');
    if (Ember.isEmpty(startDate)) {
      startDate = moment();
    } else {
      startDate = moment(parseInt(startDate));
    }
    var startOfDay = startDate.startOf('day').toDate().getTime();
    var searchOptions = {
      startkey: [startOfDay, null, 'appointment_'],
      endkey: [maxValue, maxValue, 'appointment_' + maxValue]
    };
    return {
      options: searchOptions,
      mapReduce: 'appointments_by_date'
    };
  },

  model: function(params) {
    return this._super(params).then(function(model) {
      model.setProperties({
        selectedAppointmentType: params.appointmentType,
        selectedProvider: params.provider,
        selectedStatus: params.status
      });
      var startDate = params.startDate;
      startDate = new Date();
      if (!Ember.isEmpty(params.startDate)) {
        startDate.setTime(params.startDate);
      }
      model.set('selectedStartingDate', startDate);
      model.set('display_selectedStartingDate', this._dateFormat(startDate));
      return model;
    }.bind(this));
  }

});

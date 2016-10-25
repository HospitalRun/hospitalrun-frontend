import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import DateFormat from 'hospitalrun/mixins/date-format';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default AppointmentIndexRoute.extend(DateFormat, {
  editReturn: 'appointments.search',
  filterParams: ['appointmentType', 'provider', 'status'],
  modelName: 'appointment',
  pageTitle: t('appointments.searchTitle'),

  queryParams: {
    appointmentType: { refreshModel: true },
    provider: { refreshModel: true },
    status: { refreshModel: true },
    startDate: { refreshModel: true },
    startKey: { refreshModel: true }
  },

  _modelQueryParams: function(params) {
    let startDate = params.startDate;
    let maxValue = this.get('maxValue');
    if (Ember.isEmpty(startDate)) {
      startDate = moment();
    } else {
      startDate = moment(parseInt(startDate));
    }
    let startOfDay = startDate.startOf('day').toDate().getTime();
    let searchOptions = {
      startkey: [startOfDay, null, 'appointment_'],
      endkey: [maxValue, maxValue, `appointment_${maxValue}`]
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
      let startDate = params.startDate;
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

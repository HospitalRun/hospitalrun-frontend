import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import DateFormat from 'hospitalrun/mixins/date-format';
import moment from 'moment';
import { translationMacro as t } from 'ember-i18n';

export default AppointmentIndexRoute.extend(DateFormat, {
  editReturn: 'appointments.search',
  filterParams: ['appointmentType', 'provider', 'status'],
  modelName: 'appointment',
  pageTitle: computed('i18n.locale', () => {
    return t('appointments.searchTitle');
  }),

  queryParams: {
    appointmentType: { refreshModel: true },
    provider: { refreshModel: true },
    status: { refreshModel: true },
    startDate: { refreshModel: true },
    startKey: { refreshModel: true }
  },

  _modelQueryParams(params) {
    let { startDate } = params;
    let maxValue = this.get('maxValue');
    if (isEmpty(startDate)) {
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

  model(params) {
    return this._super(params).then(function(model) {
      model.setProperties({
        selectedAppointmentType: params.appointmentType,
        selectedProvider: params.provider,
        selectedStatus: params.status
      });
      let { startDate } = params;
      startDate = new Date();
      if (!isEmpty(params.startDate)) {
        startDate.setTime(params.startDate);
      }
      model.set('selectedStartingDate', startDate);
      model.set('display_selectedStartingDate', this._dateFormat(startDate));
      return model;
    }.bind(this));
  }

});

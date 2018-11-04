import { computed } from '@ember/object';
import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import moment from 'moment';
import { t } from 'hospitalrun/macro';

export default AppointmentIndexRoute.extend({
  editReturn: 'appointments.today',
  modelName: 'appointment',
  pageTitle: computed('intl.locale', () => {
    return t('appointments.todayTitle');
  }),

  _modelQueryParams() {
    let endOfDay = moment().endOf('day').toDate().getTime();
    let maxValue = this.get('maxValue');
    let startOfDay = moment().startOf('day').toDate().getTime();
    return {
      options: {
        startkey: [startOfDay, null, 'appointment_'],
        endkey: [endOfDay, endOfDay, `appointment_${maxValue}`]
      },
      mapReduce: 'appointments_by_date'
    };
  }
});

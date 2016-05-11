import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import { translationMacro as t } from 'ember-i18n';

export default AppointmentIndexRoute.extend({
  editReturn: 'appointments.missed',
  modelName: 'appointment',
  pageTitle: t('appointments.missed'),

  _modelQueryParams() {
    let queryParams = this._super(...arguments);
    queryParams.filterBy = [{
      name: 'status',
      value: 'Missed'
    }];
    return queryParams;
  }
});
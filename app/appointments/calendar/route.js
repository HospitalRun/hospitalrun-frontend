import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import { translationMacro as t } from 'ember-i18n';
export default AppointmentIndexRoute.extend({
  editReturn: 'appointments.calendar',
  modelName: 'appointment',
  pageTitle: t('appointments.calendarTitle')
});

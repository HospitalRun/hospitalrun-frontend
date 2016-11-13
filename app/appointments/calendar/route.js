import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import { translationMacro as t } from 'ember-i18n';
export default AppointmentIndexRoute.extend({
  editReturn: 'appointments.calendar',
  modelName: 'appointment',
  pageTitle: t('appointments.calendarTitle'),

  model() {
    function createCalendarEvent(appointment) {
      return {
        title: appointment.get("patient").get("displayName") + "\n" + appointment.get("provider"),
        start: appointment.get("startDate"),
        end: appointment.get("endDate")
      }
    }

    function createCalendarEvents(appointments) {
      return appointments.map(createCalendarEvent);
    }

    return this._super(...arguments)
      .then(createCalendarEvents);
  }
});

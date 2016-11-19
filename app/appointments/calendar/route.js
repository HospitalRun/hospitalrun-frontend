import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import { translationMacro as t } from 'ember-i18n';
import Ember from 'ember';

export default AppointmentIndexRoute.extend({
  editReturn: 'appointments.calendar',
  modelName: 'appointment',
  pageTitle: t('appointments.calendarTitle'),

  queryParams: {
    startDate: { refreshModel: true },
    endDate: { refreshModel: true }
  },

  _modelQueryParams(params) {
    let { startDate, endDate } = params;
    let maxValue = this.get('maxValue');

    if (Ember.isEmpty(startDate)) {
      startDate = moment().toDate().getTime();
    }

    if (Ember.isEmpty(endDate)) {
      endDate = startDate;
    }

    let searchOptions = {
      startkey: [parseInt(startDate), null, 'appointment_'],
      endkey: [parseInt(endDate), maxValue, `appointment_${maxValue}`]
    };

    return {
      options: searchOptions,
      mapReduce: 'appointments_by_date'
    };
  },

  model() {
    function createCalendarEvent(appointment) {
      return {
        title: `${appointment.get('patient').get('displayName')}\n${appointment.get('provider')}`,
        start: appointment.get('startDate'),
        end: appointment.get('endDate'),
        referencedAppointment: appointment
      };
    }

    function createCalendarEvents(appointments) {
      return appointments.map(createCalendarEvent);
    }

    return this._super(...arguments)
      .then(createCalendarEvents)
      .then(function(calendarEvents) {
        return {
          events: calendarEvents
        };
      });
  }
});

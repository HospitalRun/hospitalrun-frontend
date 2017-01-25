import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import moment from 'moment';
import { translationMacro as t } from 'ember-i18n';

export default AppointmentIndexRoute.extend({
  editReturn: 'appointments.calendar',
  modelName: 'appointment',
  pageTitle: t('appointments.calendarTitle'),

  filterParams: ['appointmentType', 'provider', 'status', 'location'],

  queryParams: {
    appointmentType: { refreshModel: true },
    provider: { refreshModel: true },
    status: { refreshModel: true },
    location: { refreshModel: true }
  },

  dateIntervalStart: null,
  dateIntervalEnd: null,

  _modelQueryParams(params) {
    let dateIntervalStart = this.get('dateIntervalStart');
    let dateIntervalEnd = this.get('dateIntervalEnd');

    if (dateIntervalStart === null || dateIntervalEnd === null) {
      return this._super(params);
    }

    let maxValue = this.get('maxValue');

    // To cater for times like 0:00 - investigate.
    let adjustedStart = moment(dateIntervalStart).subtract(1, 'days').startOf('day').toDate().getTime();
    let adjustedEnd = moment(dateIntervalEnd).add(1, 'days').endOf('day').toDate().getTime();

    let searchOptions = {
      startkey: [adjustedStart, null, 'appointment_'],
      endkey: [adjustedEnd, maxValue, `appointment_${maxValue}`]
    };

    return {
      options: searchOptions,
      mapReduce: 'appointments_by_date'
    };
  },

  model(params) {
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

    return this._super(params)
      .then(createCalendarEvents)
      .then(function(calendarEvents) {
        return {
          events: calendarEvents,

          selectedAppointmentType: params.appointmentType,
          selectedProvider: params.provider,
          selectedStatus: params.status,
          selectedLocation: params.location
        };
      });
  },

  actions: {
    updateDateInterval(start, end) {
      this.set('dateIntervalStart', start);
      this.set('dateIntervalEnd', end);
      this.refresh();
    }
  }
});

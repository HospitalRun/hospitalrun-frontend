import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

const {
  get,
  isEmpty
} = Ember;

export default AppointmentIndexRoute.extend({

  dateIntervalEnd: null,
  dateIntervalStart: null,
  editReturn: 'appointments.calendar',
  filterParams: ['appointmentType', 'provider', 'status', 'location'],
  modelName: 'appointment',
  pageTitle: t('appointments.calendarTitle'),

  queryParams: {
    appointmentType: { refreshModel: true },
    endDate: { refreshModel: true },
    provider: { refreshModel: true },
    status: { refreshModel: true },
    startDate: { refreshModel: true },
    location: { refreshModel: true },
    viewType: { refreshModel: false }
  },

  model(params) {
    function createCalendarEvent(appointment) {
      let title = get(appointment, 'patient.displayName');
      let provider = get(appointment, 'provider');
      if (!isEmpty(provider)) {
        title = `${title}\n${provider}`;
      }
      return {
        allDay: get(appointment, 'allDay'),
        title,
        start: get(appointment, 'startDate'),
        end: get(appointment, 'endDate'),
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

  _modelQueryParams(params) {
    let { endDate, startDate } = params;

    if (endDate === null || startDate === null) {
      return this._super(params);
    }
    let maxValue = get(this, 'maxValue');
    let searchOptions = {
      startkey: [parseInt(startDate), null, this._getMinPouchId()],
      endkey: [parseInt(endDate), maxValue, this._getMaxPouchId()]
    };

    return {
      options: searchOptions,
      mapReduce: 'appointments_by_date'
    };
  }
});

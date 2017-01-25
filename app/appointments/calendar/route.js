import AppointmentIndexRoute from 'hospitalrun/appointments/index/route';
import Ember from 'ember';
import moment from 'moment';
import { translationMacro as t } from 'ember-i18n';

const {
  get,
  isEmpty,
  set
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
    provider: { refreshModel: true },
    status: { refreshModel: true },
    location: { refreshModel: true }
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
    let dateIntervalStart = get(this, 'dateIntervalStart');
    let dateIntervalEnd = get(this, 'dateIntervalEnd');

    if (dateIntervalStart === null || dateIntervalEnd === null) {
      return this._super(params);
    }

    let maxValue = get(this, 'maxValue');

    // To cater for times like 0:00 - investigate.
    let adjustedStart = moment(dateIntervalStart).subtract(1, 'days').startOf('day').toDate().getTime();
    let adjustedEnd = moment(dateIntervalEnd).add(1, 'days').endOf('day').toDate().getTime();

    let searchOptions = {
      startkey: [adjustedStart, null, this._getMinPouchId()],
      endkey: [adjustedEnd, maxValue, this._getMaxPouchId()]
    };

    return {
      options: searchOptions,
      mapReduce: 'appointments_by_date'
    };
  },

  actions: {
    updateDateInterval(start, end) {
      set(this, 'dateIntervalStart', start);
      set(this, 'dateIntervalEnd', end);
      this.refresh();
    }
  }
});

import Ember from 'ember';
import moment from 'moment';

const {
  get,
  isEmpty,
  set
} = Ember;

export default Ember.Component.extend({
  calendarHeader: {
    center: 'agendaDay,agendaWeek,month',
    left: 'title',
    right: 'today prev,next'
  },
  defaultDate: null,
  defaultView: 'agendaWeek',
  height: 500,
  onDayClick: null,
  onEventClick: null,
  onEventDrop: null,
  onEventResize: null,
  userCanEdit: false,

  visualConfiguration: {
    endDate: null,
    startDate: null,
    viewType: null
  },

  /**
   * FullCalendar gives the start and end timestamps based on UTC (eg start at
   * midnight UTC and end at 11:59PM UTC), but for our purposes we want to show
   * users events that start at midnight their timezone and end at 11:59PM in
   * their timezone.  This function takes a UTC timestamps from fullcalendar
   * and returns the timestamp in the users timezone (eg midnight UTC is returned
   * as midnight EST for EST users).
   * @param timestamp A number representing the milliseconds elapsed between
   * 1 January 1970 00:00:00 UTC and the given date.
   * @return String timestamp in users timezone.
   */
  _convertDateFromUTCToLocal(date) {
    return moment(date.utc().format('YYYY-MM-DD HH:mm:ss')).valueOf();
  },

  actions: {
    handleRenderingComplete(view) {
      function configurationsDiffer(firstConfig, secondConfig) {
        return firstConfig.startDate !== secondConfig.startDate
          || firstConfig.endDate !== secondConfig.endDate
          || firstConfig.viewType !== secondConfig.viewType;
      }

      let currentConfiguration = get(this, 'visualConfiguration');

      let newConfiguration = {
        startDate: this._convertDateFromUTCToLocal(view.intervalStart),
        endDate: this._convertDateFromUTCToLocal(view.intervalEnd),
        viewType: view.name
      };

      if (isEmpty(currentConfiguration.startDate) && isEmpty(currentConfiguration.endDate)) {
        set(this, 'visualConfiguration', newConfiguration);
      } else if (configurationsDiffer(currentConfiguration, newConfiguration)) {
        set(this, 'visualConfiguration', newConfiguration);
        get(this, 'onVisualConfigurationChanged')(newConfiguration);
      }
    }
  }
});

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

  defaultView: 'agendaWeek',
  height: 500,
  onDayClick: null,
  onEventClick: null,
  onEventDrop: null,
  onEventResize: null,
  userCanEdit: false,

  visualConfiguration: {
    dateIntervalEnd: null,
    dateIntervalStart: null,
    viewType: null
  },

  visibleDateIntervalEnd: null,
  visibleDateIntervalStart: null,

  actions: {
    handleRenderingComplete(view) {
      function configurationsDiffer(firstConfig, secondConfig) {
        return firstConfig.dateIntervalStart !== secondConfig.dateIntervalStart
          || firstConfig.dateIntervalEnd !== secondConfig.dateIntervalEnd
          || firstConfig.viewType !== secondConfig.viewType;
      }

      let currentConfiguration = get(this, 'visualConfiguration');

      let newConfiguration = {
        dateIntervalStart: moment(view.intervalStart).startOf('day').toDate().getTime(),
        dateIntervalEnd: moment(view.intervalEnd).endOf('day').toDate().getTime(),
        viewType: view.name
      };

      if (isEmpty(currentConfiguration.dateIntervalStart) && isEmpty(currentConfiguration.dateIntervalEnd)) {
        set(this, 'visualConfiguration', newConfiguration);
      } else if (configurationsDiffer(currentConfiguration, newConfiguration)) {
        set(this, 'visualConfiguration', newConfiguration);
        get(this, 'onVisualConfigurationChanged')(newConfiguration);
      }
    }
  }
});

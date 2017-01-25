import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  visibleDateIntervalStart: null,
  visibleDateIntervalEnd: null,

  visualConfiguration: {
    dateIntervalStart: null,
    dateIntervalEnd: null,
    viewType: null
  },

  calendarHeader: {
    left: 'title',
    center: 'agendaDay,agendaWeek,month',
    right: 'today prev,next'
  },

  actions: {
    handleRenderingComplete(view) {
      function configurationsDiffer(firstConfig, secondConfig) {
        return firstConfig.dateIntervalStart !== secondConfig.dateIntervalStart
          || firstConfig.dateIntervalEnd !== secondConfig.dateIntervalEnd
          || firstConfig.viewType !== secondConfig.viewType;
      }

      let currentConfiguration = this.get('visualConfiguration');

      let newConfiguration = {
        dateIntervalStart: moment(view.intervalStart).startOf('day').toDate().getTime(),
        dateIntervalEnd: moment(view.intervalEnd).endOf('day').toDate().getTime(),
        viewType: view.name
      };

      if (configurationsDiffer(currentConfiguration, newConfiguration)) {
        this.set('visualConfiguration', newConfiguration);
        this.get('onVisualConfigurationChanged')(newConfiguration);
      }
    }
  }
});

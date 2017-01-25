import Ember from 'ember';
import moment from 'moment';

const { isEmpty } = Ember;

export default Ember.Component.extend({
  calendarHeader: {
    left: 'title',
    center: 'agendaDay,agendaWeek,month',
    right: 'today prev,next'
  },
  defaultView: 'agendaWeek',
  height: 500,
  visibleDateIntervalStart: null,
  visibleDateIntervalEnd: null,

  visualConfiguration: {
    dateIntervalStart: null,
    dateIntervalEnd: null,
    viewType: null
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

      if (isEmpty(currentConfiguration.dateIntervalStart) && isEmpty(currentConfiguration.dateIntervalEnd)) {
        this.set('visualConfiguration', newConfiguration);
      } else if (configurationsDiffer(currentConfiguration, newConfiguration)) {
        this.set('visualConfiguration', newConfiguration);
        this.get('onVisualConfigurationChanged')(newConfiguration);
      }
    }
  }
});

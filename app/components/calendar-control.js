import Ember from 'ember';

export default Ember.Component.extend({
  visibleDateIntervalStart: null,
  visibleDateIntervalEnd: null,

  calendarHeader: {
    left: 'title',
    center: 'agendaDay,agendaWeek,month',
    right: 'today prev,next'
  },

  actions: {
    handleRenderingComplete(view) {
      let newIntervalStart = moment(view.intervalStart).startOf("day").toDate().getTime();
      let newIntervalEnd = moment(view.intervalEnd).endOf("day").toDate().getTime();
      if (newIntervalStart !== this.get('visibleDateIntervalStart')
        || newIntervalEnd !== this.get('visibleDateIntervalEnd')) {
        this.setProperties({
          visibleDateIntervalStart: 0,
          visibleDateIntervalEnd: 0
        });
        this.get('onVisibleDateIntervalChanged')(newIntervalStart, newIntervalEnd);
      }
    }
  }
});

import { computed } from '@ember/object';
import AppointmenCalendarRoute from 'hospitalrun/appointments/calendar/route';
import { translationMacro as t } from 'ember-intl';

export default AppointmenCalendarRoute.extend({
  editReturn: 'appointments.theater',
  newButtonText: computed('intl.locale', () => {
    return t('appointments.buttons.scheduleSurgery');
  }),
  pageTitle: computed('intl.locale', () => {
    return t('appointments.titles.theaterSchedule');
  }),

  _modelQueryParams(params) {
    let queryParams = this._super(params);
    queryParams.mapReduce = 'surgical_appointments_by_date';
    return queryParams;
  },

  actions: {
    newItem() {
      this.transitionTo('appointments.edit', 'newsurgery');
    }
  }
});

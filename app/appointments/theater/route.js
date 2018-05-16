<<<<<<< HEAD
import AppointmenCalendarRoute from 'hospitalrun/appointments/calendar/route';
import { translationMacro as t } from 'ember-i18n';
import Ember from 'ember';

const { computed } = Ember;

export default AppointmenCalendarRoute.extend({
  editReturn: 'appointments.theater',
  newButtonText: computed('i18n.locale', () => {
    return t('appointments.buttons.scheduleSurgery');
  }),
  pageTitle: computed('i18n.locale', () => {
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
=======
import { computed } from '@ember/object';
import AppointmenCalendarRoute from 'hospitalrun/appointments/calendar/route';
import { translationMacro as t } from 'ember-i18n';

export default AppointmenCalendarRoute.extend({
  editReturn: 'appointments.theater',
  newButtonText: computed('i18n.locale', () => {
    return t('appointments.buttons.scheduleSurgery');
  }),
  pageTitle: computed('i18n.locale', () => {
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea

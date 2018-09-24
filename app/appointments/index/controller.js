import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from 'hospitalrun/mixins/user-session';
import { computed } from '@ember/object';

export default AbstractPagedController.extend(UserSession, {
  startKey: [],
  canAddVisit: computed(function() {
    return this.currentUserCan('add_visit');
  }),

  canEdit: computed(function() {
    // Add and edit are the same capability
    return this.currentUserCan('add_appointment');
  }),

  canDelete: computed(function() {
    return this.currentUserCan('delete_appointment');
  }),

  sortProperties: ['startDate', 'endDate'],
  sortAscending: true
});

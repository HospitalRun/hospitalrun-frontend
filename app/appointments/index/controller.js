import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractPagedController.extend(UserSession, {
  startKey: [],
  canAddVisit: function() {
    return this.currentUserCan('add_visit');
  }.property(),

  canEdit: function() {
    // Add and edit are the same capability
    return this.currentUserCan('add_appointment');
  }.property(),

  canDelete: function() {
    return this.currentUserCan('delete_appointment');
  }.property(),

  sortProperties: ['startDate', 'endDate'],
  sortAscending: true
});

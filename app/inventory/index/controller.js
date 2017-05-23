import Ember from 'ember';
import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from 'hospitalrun/mixins/user-session';

const { computed } = Ember;

export default AbstractPagedController.extend(UserSession, {
  startKey: [],
  canAdd: function() {
    return this.currentUserCan('add_inventory_request');
  }.property(),

  canFulfill: function() {
    return this.currentUserCan('fulfill_inventory');
  }.property(),

  currentUserName: computed('', function() {
    return this.getUserName();
  })
});

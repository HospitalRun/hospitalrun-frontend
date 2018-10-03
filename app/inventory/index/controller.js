import { computed } from '@ember/object';
import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from 'hospitalrun/mixins/user-session';

export default AbstractPagedController.extend(UserSession, {
  startKey: [],
  canAdd: computed(function() {
    return this.currentUserCan('add_inventory_request');
  }),

  canFulfill: computed(function() {
    return this.currentUserCan('fulfill_inventory');
  }),

  currentUserName: computed('', function() {
    return this.getUserName();
  })
});

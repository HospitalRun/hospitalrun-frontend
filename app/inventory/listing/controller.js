import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from 'hospitalrun/mixins/user-session';
import { computed } from '@ember/object';

export default AbstractPagedController.extend(UserSession, {
  canAddItem: computed(function() {
    return this.currentUserCan('add_inventory_item');
  }),

  canAddPurchase: computed(function() {
    return this.currentUserCan('add_inventory_purchase');
  }),

  canDeleteItem: computed(function() {
    return this.currentUserCan('delete_inventory_item');
  }),

  startKey: []
});

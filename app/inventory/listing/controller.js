import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractPagedController.extend(UserSession, {
  canAddItem: function() {
    return this.currentUserCan('add_inventory_item');
  }.property(),

  canAddPurchase: function() {
    return this.currentUserCan('add_inventory_purchase');
  }.property(),

  canDeleteItem: function() {
    return this.currentUserCan('delete_inventory_item');
  }.property(),

  startKey: []
});

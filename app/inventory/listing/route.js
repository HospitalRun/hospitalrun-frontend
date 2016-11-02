import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-i18n';
export default AbstractIndexRoute.extend(UserSession, {
  modelName: 'inventory',
  newButtonAction: function() {
    if (this.currentUserCan('add_inventory_item')) {
      return 'newItem';
    } else {
      return null;
    }
  }.property(),
  newButtonText: t('buttons.newItem'),
  pageTitle: t('inventory.labels.items'),

  _modelQueryParams: function() {
    return {
      mapReduce: 'inventory_by_name'
    };
  },

  _getStartKeyFromItem: function(item) {
    let inventoryId = this._getPouchIdFromItem(item);
    return [item.get('name'), inventoryId];
  }

});

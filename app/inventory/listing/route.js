import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from 'hospitalrun/mixins/user-session';
import { t } from 'hospitalrun/macro';
import { computed } from '@ember/object';

export default AbstractIndexRoute.extend(UserSession, {
  modelName: 'inventory',
  newButtonAction: computed(function() {
    if (this.currentUserCan('add_inventory_item')) {
      return 'newItem';
    } else {
      return null;
    }
  }),
  newButtonText: t('buttons.newItem'),
  pageTitle: t('inventory.labels.items'),

  _modelQueryParams() {
    return {
      mapReduce: 'inventory_by_name'
    };
  },

  _getStartKeyFromItem(item) {
    let inventoryId = this._getPouchIdFromItem(item);
    return [item.get('name'), inventoryId];
  }

});

import InventoryEditController from 'hospitalrun/inventory/edit/controller';
import { t } from 'hospitalrun/macro';
export default InventoryEditController.extend({
  title: t('inventory.titles.inventoryItem'),

  updateCapability: 'add_inventory_item',

  actions: {
    cancel() {
      this.send('closeModal');
    }
  },

  beforeUpdate() {
    if (this.get('model.skipSavePurchase')) {
      this.set('model.quantity', null);
    }
    return this._super();
  },

  afterUpdate(record) {
    this.send('addedNewInventoryItem', record);
  }
});

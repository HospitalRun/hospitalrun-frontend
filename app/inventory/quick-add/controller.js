import InventoryEditController from 'hospitalrun/inventory/edit/controller';
export default InventoryEditController.extend({
    title: 'New Inventory Item',
    
    updateCapability: 'add_inventory_item',
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        }
    },
    
    afterUpdate: function(record) {
        this.send('addedNewInventoryItem', record);
    }
});
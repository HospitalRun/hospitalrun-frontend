import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';    
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(InventoryTypeList, {
    title: function() {
        if (this.get('isNew')) {
            return 'New Item';
        } else {
            return 'Edit Item';
        }
    }.property('isNew'),

    afterUpdate: function(record) {
        this.transitionToRoute('/inventory/search/'+record.get('id'));
    }
});

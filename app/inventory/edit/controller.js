import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';    
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(InventoryTypeList, {
    afterUpdate: function(record) {
        this.transitionToRoute('/inventory/search/'+record.get('id'));
    }
});

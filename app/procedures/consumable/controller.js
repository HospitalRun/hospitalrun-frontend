import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import InventorySelection from 'hospitalrun/mixins/inventory-selection';
import Ember from "ember";

export default AbstractEditController.extend(InventorySelection, {
    needs: ['procedures/edit'],
    cancelAction: 'closeModal',
    
    procedureController: Ember.computed.alias('controllers.procedures/edit'),
    inventoryList: Ember.computed.alias('controllers.procedures/edit.inventoryList'),
    
    updateCapability: 'add_procedure',

    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Consumable';
        }
        return 'Edit Consumable';
	}.property('isNew'),
    
    beforeUpdate: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            this.set('newConsumable', true);         
        }
        return Ember.RSVP.Promise.resolve();
    },
    
    afterUpdate: function(record) {
        if (this.get('newConsumable')) {            
            this.get('procedureController').send('addConsumable', record);
        } else {
            this.send('closeModal');
        }
    }
});

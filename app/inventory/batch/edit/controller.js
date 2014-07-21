import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';

export default AbstractEditController.extend({
    needs: 'inventory',
    canEditQuantity: function() {
        var originalQuantity = this.get('originalQuantity'),
            currentQuantity = this.get('currentQuantity');
        if (currentQuantity < originalQuantity) {
            return false;
        }
        return true;
    }.property('currentQuantity'),
    
    warehouseList: Ember.computed.alias('controllers.inventory.warehouseList'),
    aisleLocationList: Ember.computed.alias('controllers.inventory.aisleLocationList'),
    
    lookupListsToUpdate: [{
        name: 'aisleLocationList', //Name of property containing lookup list
        property: 'aisleLocation', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'aisle_location_list' //Id of the lookup list to update
     }, {
        name: 'warehouseList', //Name of property containing lookup list
        property: 'location', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'warehouse_list' //Id of the lookup list to update
     }],
    
    newBatch: false,
    
    updateQuantity: false,

    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Batch';
        }
        return 'Edit Batch';
	}.property('isNew'),
    
    actions: {
        cancel: function() {
            var cancelledItem = this.get('model');
            if (this.get('isNew')) {
                cancelledItem.deleteRecord();
            } else {
                cancelledItem.rollback();
            }
            this.send('closeModal');
        },
    },
    
    beforeUpdate: function() {
        var isNew = this.get('isNew'),
             changedAttributes = this.get('model').changedAttributes();
        if (changedAttributes.originalQuantity) {
            this.set('currentQuantity',this.get('originalQuantity'));
            if (!isNew) {
                this.set('updateQuantity', true);                
            }
        }
        if (isNew) {
            this.set('newBatch', true);
            this.set('dateAdded', new Date());            
        }
        Ember.RSVP.Promise.resolve();
    },
    
    afterUpdate: function(record) {
        if (this.get('newBatch')) {            
            this.send('addBatch', record);
        } else {
            this.send('updateBatch', record, true);
        }
    }
});

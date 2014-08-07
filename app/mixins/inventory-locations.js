export default Ember.Mixin.create({
    aisleToFind: null,
    locationToFind: null,
    
    _addQuantityToLocation: function(inventoryItem, quantity, location, aisle) {
        var foundLocation = false,
            locations = inventoryItem.get('locations');
        this.set('aisleToFind', aisle);
        this.set('locationToFind', location);
        
        foundLocation = locations.find(this.findLocation, this);
        if (foundLocation) {
            foundLocation.incrementProperty('quantity', quantity);
            foundLocation.save();
        } else {
            var locationRecord = this.get('store').createRecord('inv-location', {
                aisleLocation: aisle,
                location: location,
                quantity: quantity,
            });
            locationRecord.save();
            locations.addObject(locationRecord);
        }        
    },
    
    adjustLocation: function(inventoryItem, inventoryLocation) {
        var adjustmentType = inventoryLocation.get('adjustmentType'),
            adjustmentQuantity = parseInt(inventoryLocation.get('adjustmentQuantity'));
        if (adjustmentType === 'Adjustment (Add)') {
            inventoryLocation.incrementProperty('quantity', adjustmentQuantity);
        } else if (adjustmentType === 'Adjustment (Remove)') {
            inventoryLocation.decrementProperty('quantity', adjustmentQuantity);
        }
        this.saveLocation(inventoryLocation, inventoryItem);
    },
    
    findLocation: function(inventoryLocation) {
        var aisleLocation = inventoryLocation.get('aisleLocation'),
            aisleToFind = this.get('aisleToFind'),
            itemLocation = inventoryLocation.get('location'),
            locationToFind = this.get('locationToFind');
        if ((Ember.isEmpty(aisleLocation) && Ember.isEmpty(aisleToFind) || aisleLocation === aisleToFind) && 
                (Ember.isEmpty(itemLocation) && Ember.isEmpty(locationToFind) || itemLocation === locationToFind)) {            
            return true;
        }
    },
    
    /**
     * Process a new purchase, updating the corresponding location
     * with the number of items available
     */
    newPurchaseAdded: function(inventoryItem, newPurchase) {
        var aisle = newPurchase.get('aisleLocation'),
            location = newPurchase.get('location'),
            quantity = parseInt(newPurchase.get('originalQuantity'));
        this._addQuantityToLocation(inventoryItem, quantity, location, aisle);
    },
    
    /**
     * Save the location if the quantity is greater than zero, otherwise remove the empty location.
     * @param {Object} location the location to update or remove.
     * @param {Object} inventoryItem the inventory item the location belongs to.
     */
    saveLocation: function(location, inventoryItem) {
        if (location.get('quantity') === 0) {
            var locations = inventoryItem.get('locations');
            locations.removeObject(location);
            location.destroyRecord();
        } else {
            location.save();
        }        
    },        
    
    /**
     * Transfer items from the current location to the specified location.
     * @param {Object} inventoryItem the inventory item that items are being transferred from
     * @param {Object} transferLocation the inventory location to transfer from (also includes
     * attributes about where to transfer to.
     */
    transferToLocation: function(inventoryItem, transferLocation) {
        var aisle = transferLocation.get('transferAisleLocation'),
            location = transferLocation.get('transferLocation'),
            quantity = parseInt(transferLocation.get('transferQuantity'));
        this._addQuantityToLocation(inventoryItem, quantity, location, aisle);
        transferLocation.decrementProperty('quantity', quantity);
        this.saveLocation(transferLocation, inventoryItem);
    }
});
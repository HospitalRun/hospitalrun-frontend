export default Ember.Mixin.create({
    aisleToFind: null,
    locationToFind: null,
    quantityToIncrementBy: null,
    
    _addQuantityToLocation: function(inventoryItem, quantity, location, aisle) {
        var foundLocation = false,
            locations = inventoryItem.get('locations');
        this.set('aisleToFind', aisle);
        this.set('locationToFind', location);
        this.set('quantityToIncrementBy', quantity);
        foundLocation = locations.any(this._findLocation, this);
        if (!foundLocation) {
            var locationRecord = this.get('store').createRecord('inv-location', {
                aisleLocation: aisle,
                location: location,
                quantity: quantity,
            });
            locationRecord.save();
            locations.addObject(locationRecord);
        }        
    },
    
    _findLocation: function(inventoryLocation) {
        var aisleLocation = inventoryLocation.get('aisleLocation'),
            aisleToFind = this.get('aisleToFind'),
            itemLocation = inventoryLocation.get('location'),
            locationToFind = this.get('locationToFind'),
            quantityToIncrementBy = this.get('quantityToIncrementBy');
        if (aisleLocation === aisleToFind && itemLocation === locationToFind) {
            inventoryLocation.incrementProperty('quantity', quantityToIncrementBy);
            inventoryLocation.save();
        }
    },
    
    /**
     * Process a new purchase, updating the corresponding location
     * with the number of items available
     */
    newPurchaseAdded: function(inventoryItem, newPurchase) {
        var aisle = newPurchase.get('aisleLocation'),
            location = newPurchase.get('location'),
            quantity = newPurchase.get('originalQuantity');        
        this._addQuantityToLocation(inventoryItem, quantity, location, aisle);
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
            quantity = transferLocation.get('transferQuantity');
        this._addQuantityToLocation(inventoryItem, quantity, location, aisle);
        transferLocation.decrementProperty('quantity', quantity);
        transferLocation.save();
    }
});
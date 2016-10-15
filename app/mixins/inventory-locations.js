import Ember from 'ember';
export default Ember.Mixin.create({
  aisleToFind: null,
  locationToFind: null,

  _addQuantityToLocation: function(inventoryItem, quantity, location, aisle) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      this._findOrCreateLocation(inventoryItem, location, aisle).then(function(foundLocation) {
        foundLocation.incrementProperty('quantity', quantity);
        foundLocation.save().then(resolve, reject);
      });
    }.bind(this));
  },

  _findOrCreateLocation: function(inventoryItem, location, aisle) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let foundLocation = false;
      let locations = inventoryItem.get('locations');
      this.set('aisleToFind', aisle);
      this.set('locationToFind', location);

      foundLocation = locations.find(this.findLocation, this);
      if (foundLocation) {
        resolve(foundLocation);
      } else {
        let locationRecord = this.get('store').createRecord('inv-location', {
          id: uuid.v4(),
          aisleLocation: aisle,
          location: location,
          quantity: 0
        });
        locations.addObject(locationRecord);
        locationRecord.save().then(function() {
          resolve(locationRecord);
        }, reject);
      }
    }.bind(this));
  },

  findLocation: function(inventoryLocation) {
    let aisleLocation = inventoryLocation.get('aisleLocation');
    let aisleToFind = this.get('aisleToFind');
    let itemLocation = inventoryLocation.get('location');
    let locationToFind = this.get('locationToFind');
    if ((Ember.isEmpty(aisleLocation) && Ember.isEmpty(aisleToFind) || aisleLocation === aisleToFind) &&
      (Ember.isEmpty(itemLocation) && Ember.isEmpty(locationToFind) || itemLocation === locationToFind)) {
      return true;
    }
  },

  /**
   * Process a new purchase, updating the corresponding location
   * with the number of items available.
   * @returns {Promise} a promise that fulfills once location has been updated.
   */
  newPurchaseAdded: function(inventoryItem, newPurchase) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let aisle = newPurchase.get('aisleLocation');
      let location = newPurchase.get('location');
      let quantity = parseInt(newPurchase.get('originalQuantity'));
      this._addQuantityToLocation(inventoryItem, quantity, location, aisle).then(resolve, reject);
    }.bind(this));
  },

  /**
   * Save the location if the quantity is greater than zero, otherwise remove the empty location.
   * @param {Object} location the location to update or remove.
   * @param {Object} inventoryItem the inventory item the location belongs to.
   * @return {Promise} promise for save or remove
   */
  saveLocation: function(location, inventoryItem) {
    if (location.get('quantity') === 0) {
      let locations = inventoryItem.get('locations');
      locations.removeObject(location);
      return location.destroyRecord();
    } else {
      return location.save();
    }
  },

  /**
   * Transfer items from the current location to the specified location.
   * @param {Object} inventoryItem the inventory item that items are being transferred from
   * @param {Object} transferLocation the inventory location to transfer from (also includes
   * attributes about where to transfer to.
   * @returns {Promise} a promise that fulfills once the transfer to location has been saved.
   */
  transferToLocation: function(inventoryItem, transferLocation) {
    let aisle = transferLocation.get('transferAisleLocation');
    let location = transferLocation.get('transferLocation');
    let quantity = parseInt(transferLocation.get('adjustmentQuantity'));
    return new Ember.RSVP.Promise(function(resolve, reject) {
      this._addQuantityToLocation(inventoryItem, quantity, location, aisle).then(function() {
        transferLocation.decrementProperty('quantity', quantity);
        transferLocation.save().then(resolve, reject);
      }, reject);
    }.bind(this));
  }
});

import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import LocationName from 'hospitalrun/mixins/location-name';
var validateIfNewItem = {
  if: function validateNewItem(object) {
    var skipSavePurchase = object.get('skipSavePurchase');
    // Only validate on new items and only if we are saving a purchase.
    return (!skipSavePurchase && object.get('isNew'));
  }
};
export default AbstractModel.extend(LocationName, {
  purchases: DS.hasMany('inv-purchase', {
    async: false
  }),
  locations: DS.hasMany('inv-location', {
    async: false
  }),
  description: DS.attr('string'),
  friendlyId: DS.attr('string'),
  keywords: DS.attr(),
  name: DS.attr('string'),
  quantity: DS.attr('number'),
  crossReference: DS.attr('string'),
  inventoryType: DS.attr('string'),
  price: DS.attr('number'),
  reorderPoint: DS.attr('number'),
  distributionUnit: DS.attr('string'),

  availableLocations: function() {
    var locations = this.get('locations').filter(function(location) {
      return location.get('quantity') > 0;
    });
    return locations;
  }.property('locations.[].lastModified'),

  displayLocations: function() {
    var locations = this.get('availableLocations'),
      returnLocations = [];
    locations.forEach(function(currentLocation) {
      var aisleLocationName = currentLocation.get('aisleLocation'),
        locationName = currentLocation.get('location'),
        displayLocationName = this.formatLocationName(locationName, aisleLocationName);
      if (!Ember.isEmpty(displayLocationName)) {
        returnLocations.push(displayLocationName);
      }
    }.bind(this));
    return returnLocations.toString();
  }.property('availableLocations'),

  validations: {
    distributionUnit: {
      presence: true
    },
    purchaseCost: {
      numericality: validateIfNewItem
    },
    name: {
      presence: true
    },
    quantity: {
      numericality: validateIfNewItem
    },
    price: {
      numericality: {
        allowBlank: true
      }
    },
    originalQuantity: {
      presence: validateIfNewItem
    },
    reorderPoint: {
      numericality: {
        allowBlank: true
      }
    },
    inventoryType: {
      presence: true
    },
    vendor: {
      presence: validateIfNewItem
    }
  },

  updateQuantity: function() {
    var purchases = this.get('purchases');
    var newQuantity = purchases.reduce(function(previousItem, currentItem) {
      var currentQuantity = 0;
      if (!currentItem.get('expired')) {
        currentQuantity = currentItem.get('currentQuantity');
      }
      return previousItem + currentQuantity;
    }, 0);
    this.set('quantity', newQuantity);
  }

});

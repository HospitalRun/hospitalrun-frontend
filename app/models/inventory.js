import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import computed from 'ember-computed';
import LocationName from 'hospitalrun/mixins/location-name';
import { rankToMultiplier, getCondition } from 'hospitalrun/utils/item-condition';

let validateIfNewItem = {
  if: function validateNewItem(object) {
    let skipSavePurchase = object.get('skipSavePurchase');
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
  rank: DS.attr('string'),

  // TODO: this value should be server calcuated property on model!
  estimatedDaysOfStock: 14,

  availableLocations: computed('locations.@each.quantity', function() {
    let locations = this.get('locations').filter((location) => {
      return location.get('quantity') > 0;
    });
    return locations;
  }),

  displayLocations: computed('availableLocations', function() {
    let locations = this.get('availableLocations');
    let returnLocations = [];
    locations.forEach((currentLocation) => {
      let aisleLocationName = currentLocation.get('aisleLocation');
      let locationName = currentLocation.get('location');
      let displayLocationName = this.formatLocationName(locationName, aisleLocationName);
      if (!Ember.isEmpty(displayLocationName)) {
        returnLocations.push(displayLocationName);
      }
    });
    return returnLocations.toString();
  }),

  condition: computed('rank', 'estimatedDaysOfStock', function() {
    let estimatedDaysOfStock = this.get('estimatedDaysOfStock');
    let multiplier = rankToMultiplier(this.get('rank'));

    return getCondition(estimatedDaysOfStock, multiplier);
  }),

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
    let purchases = this.get('purchases');
    let newQuantity = purchases.reduce((previousItem, currentItem) => {
      let currentQuantity = 0;
      if (!currentItem.get('expired')) {
        currentQuantity = currentItem.get('currentQuantity');
      }
      return previousItem + currentQuantity;
    }, 0);
    this.set('quantity', newQuantity);
  }
});

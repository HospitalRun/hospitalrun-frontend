import { isEmpty } from '@ember/utils';
import { set, get } from '@ember/object';
import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import computed from 'ember-computed';
import LocationName from 'hospitalrun/mixins/location-name';
import { rankToMultiplier, getCondition } from 'hospitalrun/utils/item-condition';

let validateIfNewItem = {
  if: function validateNewItem(object) {
    let skipSavePurchase = get(object, 'skipSavePurchase');
    // Only validate on new items and only if we are saving a purchase.
    return (!skipSavePurchase && get(object, 'isNew'));
  }
};

export default AbstractModel.extend(LocationName, {
  // Attributes
  crossReference: DS.attr('string'),
  description: DS.attr('string'),
  distributionUnit: DS.attr('string'),
  friendlyId: DS.attr('string'),
  inventoryType: DS.attr('string'),
  keywords: DS.attr(),
  name: DS.attr('string'),
  price: DS.attr('number'),
  quantity: DS.attr('number'),
  rank: DS.attr('string'),
  reorderPoint: DS.attr('number'),

  // Associations
  locations: DS.hasMany('inv-location', { async: false }),
  purchases: DS.hasMany('inv-purchase', { async: false }),

  // TODO: this value should be server calcuated property on model!
  estimatedDaysOfStock: 14,

  availableLocations: computed('locations.@each.quantity', function() {
    let locations = get(this, 'locations').filter((location) => {
      return get(location, 'quantity') > 0;
    });
    return locations;
  }),

  displayLocations: computed('availableLocations', function() {
    let locations = get(this, 'availableLocations');
    let returnLocations = [];
    locations.forEach((currentLocation) => {
      let aisleLocationName = get(currentLocation, 'aisleLocation');
      let locationName = get(currentLocation, 'location');
      let displayLocationName = this.formatLocationName(locationName, aisleLocationName);
      if (!isEmpty(displayLocationName)) {
        returnLocations.push(displayLocationName);
      }
    });
    return returnLocations.toString();
  }),

  condition: computed('rank', 'estimatedDaysOfStock', function() {
    let estimatedDaysOfStock = get(this, 'estimatedDaysOfStock');
    let multiplier = rankToMultiplier(get(this, 'rank'));

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
      numericality: {
        validateIfNewItem,
        greaterThanOrEqualTo: 0
      }
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

  updateQuantity() {
    let purchases = get(this, 'purchases');
    let newQuantity = purchases.reduce((previousItem, currentItem) => {
      let currentQuantity = 0;
      if (!currentItem.get('expired')) {
        currentQuantity = currentItem.get('currentQuantity');
      }
      return previousItem + currentQuantity;
    }, 0);
    set(this, 'quantity', newQuantity);
  }
});

import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
var validateIfNewItem = {
    if: function validateNewItem(object) {
        var skipSavePurchase = object.get('skipSavePurchase');
        //Only validate on new items and only if we are saving a purchase.        
        return (!skipSavePurchase && object.get('isNew'));
    }
};
export default AbstractModel.extend({
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
    type: DS.attr('string'),
    price: DS.attr('number'),
    reorderPoint: DS.attr('number'),
    distributionUnit: DS.attr('string'),
    
    availableLocations: function() {
        var locations = this.get('locations').filter(function(location) {
            return location.get('quantity') > 0;
        });
        return locations;
    }.property('locations@each.lastModified'),
    
    validations: {
        distributionUnit: {
            presence: true,
        },
        purchaseCost: {
            numericality: validateIfNewItem
        },
        name: {
            presence: true,
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
        type: {
            presence: true,
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

import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    purchases: DS.hasMany('inv-purchase'),
    locations: DS.hasMany('inv-location'),
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
        purchaseCost: {
            numericality: {
                if: function(object) {
                    //Only validate on new items
                    return (object.get('isNew'));
                }
            }
        },
        name: {
            presence: true,
        },
        quantity: {
            numericality: true
        },
        price: {
            numericality: {
                allowBlank: true
            }
        },
        reorderPoint: {
            numericality: {
                allowBlank: true
            }
        },
        type: {
            presence: true,
        },
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

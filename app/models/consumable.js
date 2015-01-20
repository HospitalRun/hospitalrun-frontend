import AbstractModel from 'hospitalrun/models/abstract';
import Ember from 'ember';

export default AbstractModel.extend({
    inventoryItem: DS.belongsTo('inventory'),
    quantity: DS.attr('number'),
    
    validations: {
        inventoryItemTypeAhead: {
            acceptance: {
                accept: true,
                if: function(object) {
                    if (!object.get('isDirty')) {
                        return false;
                    }
                    var itemName = object.get('inventoryItem.name'),
                        itemTypeAhead = object.get('inventoryItemTypeAhead');
                    if (Ember.isEmpty(itemName) || Ember.isEmpty(itemTypeAhead)) {
                        //force validation to fail
                        return true;
                    } else {
                        var typeAheadName = itemTypeAhead.substr(0, itemName.length);
                        if (itemName !== typeAheadName) {
                            return true;
                        }
                    }
                    //Inventory item is properly selected; don't do any further validation
                    return false;
                }, 
                message: 'Please select a valid inventory item'
            }
        },    
        
        quantity: {
            numericality: {
                greaterThan: 0,
            }
        }
    }
});
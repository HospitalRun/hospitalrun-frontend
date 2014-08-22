import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    dose: DS.attr('string'),
    duration: DS.attr('number'),
    durationType: DS.attr('string'),
    frequency: DS.attr('string'),
    inventoryItem: DS.belongsTo('inventory'),
    notes: DS.attr('string'),
    patient: DS.belongsTo('patient'),
    prescriptionDate: DS.attr('date'),
    quantity: DS.attr('number'),
    refills: DS.attr('number'),
    status: DS.attr('string'),
    visit: DS.belongsTo('visit'),
    
    prescription: function() {
        var dose = this.get('dose'),
            duration = this.get('duration'),
            durationType = this.get('durationType'),
            frequency = this.get('frequency');
        return '%@ %@ for %@ %@'.fmt(dose, frequency, duration, durationType);
    }.property('dose','duration','durationType', 'frequency'),
    
    validations: {
        dose: {
            presence: true
        },
        
        duration: {
            numericality: true
        },

        durationType: {
            presence: true
        },
        
        frequency: {
            presence: true            
        },
        
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
                message: 'Please select a valid medication'
            }
        },
        
        patient: {
            presence: true
        },
        
        quantity: {
            numericality: {
                allowBlank: true
            }
        },
        
        refills: {
            numericality: {
                allowBlank: true
            }
        }
    }
});
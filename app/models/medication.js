import AbstractModel from "hospitalrun/models/abstract";
import DateFormat from "hospitalrun/mixins/date-format";
import Ember from "ember";
import PatientValidation from "hospitalrun/utils/patient-validation";

export default AbstractModel.extend(DateFormat, {
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
    requestedDate: DS.attr('date'),
    requestedBy: DS.attr('string'),
    status: DS.attr('string'),
    visit: DS.belongsTo('visit'),
        
    prescription: function() {
        var dose = this.get('dose'),
            duration = this.get('duration'),
            durationType = this.get('durationType'),
            frequency = this.get('frequency');
        return '%@ %@ for %@ %@'.fmt(dose, frequency, duration, durationType);
    }.property('dose','duration','durationType', 'frequency'),
    
    prescriptionDateAsTime: function() {        
        return this.dateToTime(this.get('prescriptionDate'));
    }.property('prescriptionDate'),
    
    requestedDateAsTime: function() {
        return this.dateToTime(this.get('requestedDate'));
    }.property('requestedDate'),
    
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
        
        patientTypeAhead: PatientValidation.patientTypeAhead,        
        
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
import AbstractModel from "hospitalrun/models/abstract";
import Ember from "ember";

export default AbstractModel.extend({
    anesthesiaType: DS.attr('string'),
    anesthesiologist: DS.attr('string'),
    assistant: DS.attr('string'),
    billingId: DS.attr('string'),
    description: DS.attr('string'),
    equipmentUsed: DS.attr(), //Array of items
    itemsConsumed: DS.hasMany('consumable'),
    location: DS.attr('string'),
    notes: DS.attr('string'),
    oxygenHours: DS.attr('number'),
    pacuHours: DS.attr('number'),
    physician: DS.attr('string'),
    procedureDate: DS.attr('date'),
    timeStarted: DS.attr('string'),
    timeEnded: DS.attr('string'),
    visit: DS.belongsTo('visit'),
    
    validations: {
        description: {
            acceptance: {
                /***
                 * Validate that a procedure has been specified and that it
                 * is a valid procedure.
                 */
                accept: true,
                if: function(object) {
                        var description = object.get('description'),
                            billingId = object.get('billingId');
                        if (Ember.isEmpty(description) || Ember.isEmpty(billingId)) {
                            //force validation to fail
                            return true;
                        } else {
                            //procedure is properly set; don't do any further validation
                            return false;
                        }
                }, 
                message: 'Please select a valid procedure'         
            }
        },
        oxygenHours: {
            numericality: {
                allowBlank: true
            }                
        },
        pacuHours: {
            numericality: {
                allowBlank: true
            }
        },
        physician: {
            presence: true            
        },
        procedureDate: {
            presence: true,
        },
        display_procedureDate: {
            presence: {
                message: 'Please select a valid date' 
            }
        },
    }
});
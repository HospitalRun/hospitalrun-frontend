import AbstractModel from "hospitalrun/models/abstract";
import Ember from "ember";

export default AbstractModel.extend({
    procedureDate: DS.attr('date'),
    billingId: DS.attr('string'),
    description: DS.attr('string'),
    physician: DS.attr('string'),
    assistant: DS.attr('string'),
    notes: DS.attr('string'),
    visit: DS.belongsTo('visit'),
    equipmentUsed: DS.attr(), //Array of items
    itemsConsumed: DS.hasMany('consumable'),
    
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
        }
    }
});
import AbstractModel from "hospitalrun/models/abstract";
import Ember from "ember";

export default AbstractModel.extend({
    anesthesiaType: DS.attr('string'),
    anesthesiologist: DS.attr('string'),
    assistant: DS.attr('string'),
    icd10PCSId: DS.attr('string'),
    icd10PCS: DS.attr('string'),
    description: DS.attr('string'),
    charges: DS.hasMany('proc-charge'),
    cptCode: DS.attr('string'),
    location: DS.attr('string'),
    notes: DS.attr('string'),
    physician: DS.attr('string'),
    procedureDate: DS.attr('date'),
    timeStarted: DS.attr('string'),
    timeEnded: DS.attr('string'),
    visit: DS.belongsTo('visit'),
    
    validations: {
        icd10PCS: {
            acceptance: {
                /***
                 * Validate that a procedure has been specified and that it
                 * is a valid procedure.
                 */
                accept: true,
                if: function(object) {
                        var icd10PCS = object.get('icd10PCS'),
                            icd10PCSId = object.get('icd10PCSId');
                        if (!Ember.isEmpty(icd10PCS) && Ember.isEmpty(icd10PCSId)) {
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
        
        description: {
            presence: true
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
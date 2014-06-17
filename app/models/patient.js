import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    address: DS.attr(),
    clinic: DS.attr('string'),
    country: DS.attr('string'),
    bloodType: DS.attr('string'),
    dateOfBirth: DS.attr('string'),
    email: DS.attr('string'),
    firstName: DS.attr('string'),
    gender:  DS.attr('string'),
    history: DS.attr('string'),
    lastName:  DS.attr('string'),
    parent: DS.attr('string'),
    phone:  DS.attr('string'),
    primaryDiagnosis: DS.attr('string'),
    primaryDiagnosisId: DS.attr('string'),
    addtionalDiagnosis: DS.attr(),
    
    validations: {
        firstName: {
            presence: true
        },
        lastName: {
            presence: true
        },

        primaryDiagnosis: {
            acceptance: {
                /***
                 * Hack to get validation to fire if primaryDiagnosis is not empty 
                 * but a corresponding diagnosisId has not been set meaning the user
                 * didn't select a valid diagnosis
                 */
                accept: true,
                if: function(object) {
                    var primaryDiagnosis = object.get('primaryDiagnosis'),
                        primaryDiagnosisId = object.get('primaryDiagnosisId');                                      
                    if (!Ember.isEmpty(primaryDiagnosis) && Ember.isEmpty(primaryDiagnosisId)) {
                        //force validation to fail
                        return true;
                    } else {
                        //Diagnosis is properly set; don't do any further validation
                        return false;
                    }
                }, 
                message: 'Please select a valid diagnosis'                                    
            }
        }
        
    }

});

export default {
    diagnosisValidation: {
        acceptance: {
            /***
             * Hack to get validation to fire if diagnosis is not empty 
             * but a corresponding diagnosisId has not been set meaning the user
             * didn't select a valid diagnosis
             */
            accept: true,
            if: function(object, validator) {
                    var diagnosis = object.get(validator),
                        diagnosisId = object.get(validator+'Id');
                    if (!Ember.isEmpty(diagnosis) && Ember.isEmpty(diagnosisId)) {
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
};
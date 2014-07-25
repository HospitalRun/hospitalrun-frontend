import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    patient: DS.belongsTo('patient'),
    provider: DS.attr('string'),
    location: DS.attr('string'),
    appointmentType: DS.attr('string'),
    startDate: DS.attr('date'),
    endDate: DS.attr('date'),
    notes: DS.attr('string'),
    validations: {
        patientTypeAhead: {
            acceptance: {
                accept: true,
                if: function(object) {
                    if (!object.get('isDirty')) {
                        return false;
                    }
                    var patientName = object.get('patient.displayName'),
                        patientTypeAhead = object.get('patientTypeAhead');
                    if (Ember.isEmpty(patientName) || Ember.isEmpty(patientTypeAhead)) {
                        //force validation to fail
                        return true;
                    } else {
                        var typeAheadName = patientTypeAhead.substr(0, patientName.length);
                        if (patientName !== typeAheadName) {
                            return true;
                        }
                    }
                    //patient is properly selected; don't do any further validation
                    return false;

                }, 
                message: 'Please select a patient'
            }
        },        
        
        patient: {
            presence: true
        },
        appointmentType: {
            presence: true
        },
        location: {
            presence: true
        },
        startDate: {
            presence: true
        },
        endDate: {
            presence: true            
        }
    }
});

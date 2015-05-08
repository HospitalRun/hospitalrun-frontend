import AbstractModel from "hospitalrun/models/abstract";
import PatientValidation from "hospitalrun/utils/patient-validation";
import Ember from "ember";

export default AbstractModel.extend({
    allDay: DS.attr(),
    patient: DS.belongsTo('patient'),
    provider: DS.attr('string'),
    location: DS.attr('string'),
    appointmentType: DS.attr('string'),
    startDate: DS.attr('date'),
    endDate: DS.attr('date'),
    notes: DS.attr('string'),
    validations: {
        appointmentDate: {
            presence: {
                if: function(object) {
                    var appointmentType = object.get('appointmentType');
                    return appointmentType !== 'Admission';
                }
            }
        },
        
        patientTypeAhead: PatientValidation.patientTypeAhead,        
        
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
             acceptance: {
                accept: true,
                if: function(object) {
                    if (!object.get('isDirty')) {
                        return false;
                    }
                    var allDay = object.get('allDay'),
                        startDate = object.get('startDate'),
                        endDate = object.get('endDate');
                    if (Ember.isEmpty(endDate) || Ember.isEmpty(startDate)) {
                        //force validation to fail
                        return true;
                    } else {
                        if (allDay) {
                            if (endDate.getTime() < startDate.getTime()) {
                                return true;
                            }
                        } else {
                            if (endDate.getTime() <=  startDate.getTime()) {
                                return true;
                            }
                        }
                    }
                    //patient is properly selected; don't do any further validation
                    return false;

                }, 
                message: 'Please select an end date later than the start date'
            }
        }
    }
});

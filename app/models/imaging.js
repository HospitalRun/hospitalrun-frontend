import AbstractModel from "hospitalrun/models/abstract";
import DateFormat from "hospitalrun/mixins/date-format";
import PatientValidation from "hospitalrun/utils/patient-validation";
import ResultValidation from 'hospitalrun/mixins/result-validation';

export default AbstractModel.extend(DateFormat, ResultValidation, {
    charges: DS.hasMany('proc-charge'),
    imagingDate: DS.attr('date'),
    imagingType: DS.belongsTo('pricing'),
    notes: DS.attr('string'),
    patient: DS.belongsTo('patient'),
    requestedBy: DS.attr('string'),
    requestedDate: DS.attr('date'),
    result: DS.attr('string'),
    status: DS.attr('string'),
    visit: DS.belongsTo('visit'),
    
    imagingDateAsTime: function() {        
        return this.dateToTime(this.get('imagingDate'));
    }.property('imagingDate'),
    
    requestedDateAsTime: function() {
        return this.dateToTime(this.get('requestedDate'));
    }.property('requestedDate'),
    
    validations: {
        imagingTypeName: {
            presence: true
        },        
        patientTypeAhead: PatientValidation.patientTypeAhead,
        patient: {
            presence: true
        },
    }
});
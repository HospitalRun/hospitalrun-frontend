import AbstractModel from "hospitalrun/models/abstract";
import DateFormat from "hospitalrun/mixins/date-format";
import PatientValidation from "hospitalrun/utils/patient-validation";

export default AbstractModel.extend(DateFormat,{
    labDate: DS.attr('date'),
    labType: DS.attr('string'),
    notes: DS.attr('string'),
    patient: DS.belongsTo('patient'),
    requestedBy: DS.attr('string'),
    requestedDate: DS.attr('date'),
    result: DS.attr('string'),
    status: DS.attr('string'),
    visit: DS.belongsTo('visit'),
    
    labDateAsTime: function() {        
        return this.dateToTime(this.get('labDate'));
    }.property('labDate'),
    
    requestedDateAsTime: function() {
        return this.dateToTime(this.get('requestedDate'));
    }.property('requestedDate'),
    
    validations: {
        patientTypeAhead: PatientValidation.patientTypeAhead,        
        
        patient: {
            presence: true
        }
    }
});
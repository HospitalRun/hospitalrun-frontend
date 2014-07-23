import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    patient: DS.belongsTo('patient'),
    examiner: DS.attr('string'),
    location: DS.attr('string'),
    visitType: DS.attr(),        
    clinic: DS.attr('string'),
    startDate:  DS.attr('date'),
    endDate:  DS.attr('date'),  //if visit type is outpatient, startDate and endDate are equal 
    history: DS.attr('string'),
    notes: DS.attr('string'),
    vitals: DS.hasMany('vital'),
    procedures: DS.hasMany('procedure'),
    validations: {
        startDate: {
            presence: true
        },
        visitType: {
            presence: true
        }
    }

});

import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    clinic: DS.attr('string'),
    endDate:  DS.attr('date'),  //if visit type is outpatient, startDate and endDate are equal 
    examiner: DS.attr('string'),
    history: DS.attr('string'),
    location: DS.attr('string'),
    medication: DS.hasMany('medication', {async: true}),
    notes: DS.attr('string'),
    patient: DS.belongsTo('patient'),
    procedures: DS.hasMany('procedure', {async: true}),
    startDate:  DS.attr('date'),
    visitType: DS.attr(),        
    vitals: DS.hasMany('vital', {async: true}),
    
    visitDate: function() {
        var endDate = moment(this.get('endDate')),
            startDate = moment(this.get('startDate')),
            visitDate = startDate.format('l');
        if (!startDate.isSame(endDate, 'day')) {
            visitDate += ' - ' + endDate.format('l');                                                
        }
        return visitDate;
    }.property('startDate', 'endDate'),
    
    validations: {
        startDate: {
            presence: true
        },
        visitType: {
            presence: true
        }
    }

});
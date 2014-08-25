import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    imagingDate: DS.attr('date'),
    imagingType: DS.attr('string'),
    notes: DS.attr('string'),
    patient: DS.belongsTo('patient'),
    requestedBy: DS.attr('string'),
    requestedDate: DS.attr('date'),
    result: DS.attr('string'),
    status: DS.attr('string'),
    visit: DS.belongsTo('visit')    
});
import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    medicationId: DS.attr('string'),
    medicationName: DS.attr('string'),
    patientId: DS.attr('string'),
    prescription: DS.attr('string'),
    quantity: DS.attr('number'),    
    status: DS.attr('string')
});
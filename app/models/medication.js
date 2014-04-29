export default DS.Model.extend({
    medicationId: DS.attr('string'),
    patientId: DS.attr('string'),
    prescription: DS.attr('string'),
    quantity: DS.attr('number'),    
    status: DS.attr('string')
});
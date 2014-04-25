export default DS.Model.extend({
    patientId: DS.attr('string'),
    medicationId: DS.attr('string'),    
    quantity: DS.attr('number'),
    prescription: DS.attr('string'),
    status: DS.attr('string')
});
import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    patientId: DS.attr('string'),
    staffId: DS.attr('string'),
    locationId: DS.attr('string'),
    appointmentType: DS.attr('string'),
    appointmentDate: DS.attr('date'),
    note: DS.attr('string'),
    validations: {
        patientId: {
            presence: true
        },
        appointmentType: {
            presence: true
        },
        locationId: {
            presence: true
        },
        appointmentDate: {
            presence: true
        }                  
    }
});

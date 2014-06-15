import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    address: DS.attr(),
    clinic: DS.attr('string'),
    country: DS.attr('string'),
    bloodType: DS.attr('string'),
    dateOfBirth: DS.attr('date'),
    email: DS.attr('string'),
    firstName: DS.attr('string'),
    gender:  DS.attr('string'),
    history: DS.attr('string'),
    lastName:  DS.attr('string'),
    parent: DS.attr('string'),
    phone:  DS.attr('string'),
    primaryDiagnosis: DS.attr('string'),
    
    validations: {
        firstName: {
            presence: true
        },
        lastName: {
            presence: true
        }
    }

});

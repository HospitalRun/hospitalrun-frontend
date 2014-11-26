import AbstractModel from "hospitalrun/models/abstract";
import EmailValidation from "hospitalrun/utils/email-validation";

export default AbstractModel.extend({
    additionalContacts: DS.attr(),
    additionalData: DS.attr(), //Additional data will be used to store custom data per install.
    address: DS.attr('string'),
    address2: DS.attr('string'),
    address3: DS.attr('string'),
    address4: DS.attr('string'),
    bloodType: DS.attr('string'),
    clinic: DS.attr('string'),
    country: DS.attr('string'),
    dateOfBirth: DS.attr('date'),
    economicClassification: DS.attr('string'),
    email: DS.attr('string'),
    expenses: DS.attr(),
    externalPatientId: DS.attr('string'),
    familyInfo: DS.attr(),
    firstName: DS.attr('string'),
    gender:  DS.attr('string'),
    history: DS.attr('string'),
    lastName:  DS.attr('string'),
    notes: DS.attr('string'),  
    otherIncome: DS.attr('string'),
    parent: DS.attr('string'),
    phone:  DS.attr('string'),
    placeOfBirth: DS.attr('string'),
    referredDate: DS.attr('date'),
    referredBy: DS.attr('string'),    
    religion: DS.attr('string'),  

    displayName: function() {
        var firstName = this.get('firstName'),
            lastName = this.get('lastName'),
            returnName = '';
        if (!Ember.isEmpty(firstName)) {
            returnName += firstName;
        }
        if (!Ember.isEmpty(returnName) && !Ember.isEmpty(lastName)) {
            returnName += ' ';
        }
        if (!Ember.isEmpty(lastName)) {
            returnName += lastName;
        }        
        return returnName;
    }.property('firstName', 'lastName'),
    
    displayPatientId: function() {
        var externalPatientId = this.get('externalPatientId'),
            id = this.get('id');
        if (Ember.isEmpty(externalPatientId)) {
            return id;
        } else {
            return externalPatientId;
        }
    }.property('id', 'externalPatientId'),
    
    validations: {
        email: {
            format: { 
                with: EmailValidation.emailRegex, 
                allowBlank: true, 
                message: 'please enter a valid email address'
            }
        },
        firstName: {
            presence: true
        },
        lastName: {
            presence: true
        }
    }

});
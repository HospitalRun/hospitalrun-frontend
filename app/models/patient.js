import AbstractModel from "hospitalrun/models/abstract";
import DOBDays from 'hospitalrun/mixins/dob-days';
import EmailValidation from "hospitalrun/utils/email-validation";
import Ember from "ember";
import PatientName from 'hospitalrun/mixins/patient-name';

export default AbstractModel.extend(DOBDays, PatientName, {
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
    friendlyId: DS.attr('string'),
    familyInfo: DS.attr(),
    firstName: DS.attr('string'),
    gender:  DS.attr('string'),
    history: DS.attr('string'),
    lastName:  DS.attr('string'),
    notes: DS.attr('string'),  
    otherIncome: DS.attr('string'),
    patientType: DS.attr('string'),
    parent: DS.attr('string'),
    paymentProfile: DS.belongsTo('price-profile'),
    phone:  DS.attr('string'),
    placeOfBirth: DS.attr('string'),
    referredDate: DS.attr('date'),
    referredBy: DS.attr('string'),    
    religion: DS.attr('string'),
    
    age: function() {
        var dob = this.get('dateOfBirth');
        return this.convertDOBToText(dob);
    }.property('dateOfBirth'),
    
    displayAddress: function() {
        var addressFields = this.getProperties('address', 'address2', 'address3', 'address4'),
            displayAddress = '';
        for (var prop in addressFields) {
            if (!Ember.isEmpty(addressFields[prop])) {
                if (!Ember.isEmpty(displayAddress)) {
                    displayAddress += ', ';
                }
                displayAddress += addressFields[prop];
            }
        }
        return displayAddress;
    }.property('address', 'address2', 'address3', 'address4'),
    
    displayName: function() {
        return this.getPatientDisplayName(this);
    }.property('firstName', 'lastName'),
    
    displayPatientId: function() {
        var externalPatientId = this.get('externalPatientId'),
            friendlyId = this.get('friendlyId'),
            id = this.get('id');
        if (!Ember.isEmpty(friendlyId)) {
            return friendlyId;
        } else if (!Ember.isEmpty(externalPatientId)) {
            return externalPatientId;
        } else {
            return id;
        }
    }.property('id', 'externalPatientId', 'friendlyId'),
    
    validations: {
        email: {
            format: { 
                with: EmailValidation.emailRegex, 
                allowBlank: true, 
                message: 'please enter a valid email address'
            }
        },
        friendlyId: {
            presence: true
        },
        firstName: {
            presence: true
        },
        lastName: {
            presence: true
        }
    }

});
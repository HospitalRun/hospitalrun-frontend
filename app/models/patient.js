import AbstractModel from "hospitalrun/models/abstract";
import EmailValidation from "hospitalrun/utils/email-validation";

export default AbstractModel.extend({
    address: DS.attr(),
    bloodType: DS.attr('string'),
    clinic: DS.attr('string'),
    country: DS.attr('string'),
    dateOfBirth: DS.attr('date'),
    email: DS.attr('string'),
    firstName: DS.attr('string'),
    gender:  DS.attr('string'),
    history: DS.attr('string'),
    lastName:  DS.attr('string'),    
    parent: DS.attr('string'),
    phone:  DS.attr('string'),

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
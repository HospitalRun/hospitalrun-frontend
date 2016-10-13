import AbstractModel from 'hospitalrun/models/abstract';
import DOBDays from 'hospitalrun/mixins/dob-days';
import EmailValidation from 'hospitalrun/utils/email-validation';
import Ember from 'ember';
import DS from 'ember-data';
import PatientName from 'hospitalrun/mixins/patient-name';

export default AbstractModel.extend(DOBDays, PatientName, {
  admitted: DS.attr('boolean', { defaultValue: false }),
  additionalContacts: DS.attr(),
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
  familySupport1: DS.attr('string'),
  familySupport2: DS.attr('string'),
  familySupport3: DS.attr('string'),
  familySupport4: DS.attr('string'),
  familySupport5: DS.attr('string'),
  friendlyId: DS.attr('string'),
  familyInfo: DS.attr(),
  firstName: DS.attr('string'),
  sex: DS.attr('string'),
  occupation: DS.attr('string'),
  history: DS.attr('string'),
  insurance: DS.attr('string'),
  lastName: DS.attr('string'),
  livingArrangement: DS.attr('string'),
  middleName: DS.attr('string'),
  notes: DS.attr('string'),
  otherIncome: DS.attr('string'),
  payments: DS.hasMany('payment', {
    async: true
  }),
  patientType: DS.attr('string'),
  parent: DS.attr('string'),
  paymentProfile: DS.belongsTo('price-profile', {
    async: false
  }),
  phone: DS.attr('string'),
  placeOfBirth: DS.attr('string'),
  referredDate: DS.attr('date'),
  referredBy: DS.attr('string'),
  religion: DS.attr('string'),
  socialActionTaken: DS.attr('string'),
  socialRecommendation: DS.attr('string'),
  status: DS.attr('string'),

  age: function() {
    let dob = this.get('dateOfBirth');
    return this.convertDOBToText(dob);
  }.property('dateOfBirth'),

  displayAddress: function() {
    let addressFields = this.getProperties('address', 'address2', 'address3', 'address4');
    let displayAddress = '';
    for (let prop in addressFields) {
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
  }.property('firstName', 'lastName', 'middleName'),

  displayPatientId: function() {
    return this.getPatientDisplayId(this);
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

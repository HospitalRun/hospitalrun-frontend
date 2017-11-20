import { isEmpty } from '@ember/utils';
import { get, computed } from '@ember/object';
import AbstractModel from 'hospitalrun/models/abstract';
import DOBDays from 'hospitalrun/mixins/dob-days';
import EmailValidation from 'hospitalrun/utils/email-validation';
import DS from 'ember-data';
import PatientName from 'hospitalrun/mixins/patient-name';

export default AbstractModel.extend(DOBDays, PatientName, {
  // Attributes
  admitted: DS.attr('boolean', { defaultValue: false }),
  additionalContacts: DS.attr(),
  address: DS.attr('string'),
  address2: DS.attr('string'),
  address3: DS.attr('string'),
  address4: DS.attr('string'),
  bloodType: DS.attr('string'),
  clinic: DS.attr('string'),
  country: DS.attr('string'),
  checkedIn: DS.attr('boolean', { defaultValue: false }),
  customForms: DS.attr('custom-forms'),
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
  history: DS.attr('string'), // No longer used
  insurance: DS.attr('string'),
  lastName: DS.attr('string'),
  livingArrangement: DS.attr('string'),
  middleName: DS.attr('string'),
  notes: DS.attr('string'),
  otherIncome: DS.attr('string'),
  patientType: DS.attr('string'),
  parent: DS.attr('string'),
  phone: DS.attr('string'),
  placeOfBirth: DS.attr('string'),
  referredDate: DS.attr('date'),
  referredBy: DS.attr('string'),
  religion: DS.attr('string'),
  socialActionTaken: DS.attr('string'),
  socialRecommendation: DS.attr('string'),
  status: DS.attr('string'),
  // Associations
  allergies: DS.hasMany('allergy', { async: true }),
  diagnoses: DS.hasMany('diagnosis', { async: false }),
  operationReports: DS.hasMany('operation-report', { async: true }),
  operativePlans: DS.hasMany('operative-plan', { async: true }),
  payments: DS.hasMany('payment', { async: true }),
  paymentProfile: DS.belongsTo('price-profile', { async: false }),

  age: computed('dateOfBirth', function() {
    let dob = get(this, 'dateOfBirth');
    return this.convertDOBToText(dob);
  }),

  displayAddress: computed('address', 'address2', 'address3', 'address4', function() {
    let addressFields = this.getProperties('address', 'address2', 'address3', 'address4');
    let displayAddress = '';
    for (let prop in addressFields) {
      if (!isEmpty(addressFields[prop])) {
        if (!isEmpty(displayAddress)) {
          displayAddress += ', ';
        }
        displayAddress += addressFields[prop];
      }
    }
    return displayAddress;
  }),

  displayName: computed('firstName', 'lastName', 'middleName', function() {
    return this.getPatientDisplayName(this);
  }),

  displayPatientId: computed('id', 'externalPatientId', 'friendlyId', function() {
    return this.getPatientDisplayId(this);
  }),

  shortAge: computed('dateOfBirth', function() {
    let dob = get(this, 'dateOfBirth');
    return this.convertDOBToText(dob, true);
  }),

  shortDisplayName: computed('firstName', 'lastName', function() {
    return this.getPatientDisplayName(this, true);
  }),

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

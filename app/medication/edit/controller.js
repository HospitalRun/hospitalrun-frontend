import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AddNewPatient from 'hospitalrun/mixins/add-new-patient';
import Ember from 'ember';
import FulfillRequest from 'hospitalrun/mixins/fulfill-request';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations'; // inventory-locations mixin is needed for fulfill-request mixin!
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import UserSession from 'hospitalrun/mixins/user-session';

export default AbstractEditController.extend(AddNewPatient, FulfillRequest, InventoryLocations, PatientSubmodule, UserSession, {
  medicationController: Ember.inject.controller('medication'),
  expenseAccountList: Ember.computed.alias('medicationController.expenseAccountList'),

  canFulfill: function() {
    return this.currentUserCan('fulfill_medication');
  }.property(),

  isFulfilled: function() {
    let status = this.get('model.status');
    return (status === 'Fulfilled');
  }.property('model.status'),

  isFulfilling: function() {
    let canFulfill = this.get('canFulfill');
    let isRequested = this.get('model.isRequested');
    let fulfillRequest = this.get('model.shouldFulfillRequest');
    let isFulfilling = canFulfill && (isRequested || fulfillRequest);
    this.get('model').set('isFulfilling', isFulfilling);
    return isFulfilling;
  }.property('canFulfill', 'model.isRequested', 'model.shouldFulfillRequest'),

  isFulfilledOrRequested: function() {
    return (this.get('isFulfilled') || this.get('model.isRequested'));
  }.property('isFulfilled', 'model.isRequested'),

  prescriptionClass: function() {
    let quantity = this.get('model.quantity');
    if (Ember.isEmpty(quantity)) {
      return 'required test-medication-prescription';
    }
  }.property('model.quantity'),

  quantityClass: function() {
    let prescription = this.get('model.prescription');
    let returnClass = 'col-xs-3';
    let isFulfilling = this.get('isFulfilling');
    if (isFulfilling || Ember.isEmpty(prescription)) {
      returnClass += ' required';
    }
    return `${returnClass} test-quantity-input`;
  }.property('isFulfilling', 'model.prescription'),

  quantityLabel: function() {
    let i18n = this.get('i18n');
    let returnLabel = i18n.t('medication.labels.quantityRequested');
    let isFulfilled = this.get('isFulfilled');
    let isFulfilling = this.get('isFulfilling');
    if (isFulfilling) {
      returnLabel = i18n.t('medication.labels.quantityDispensed');
    } else if (isFulfilled) {
      returnLabel = i18n.t('medication.labels.quantityDistributed');
    }
    return returnLabel;
  }.property('isFulfilled'),

  medicationList: [],
  updateCapability: 'add_medication',

  afterUpdate() {
    let i18n = this.get('i18n');
    let alertTitle, alertMessage;
    let isFulfilled = this.get('isFulfilled');
    if (isFulfilled) {
      alertTitle = i18n.t('medication.alerts.fulfilledTitle');
      alertMessage = 'The medication request has been fulfilled.';
      this.set('model.selectPatient', false);
    } else {
      alertTitle = i18n.t('medication.alerts.savedTitle');
      alertMessage = i18n.t('medication.alerts.savedMessage');
    }
    this.saveVisitIfNeeded(alertTitle, alertMessage);
  },

  beforeUpdate() {
    let isFulfilling = this.get('isFulfilling');
    let isNew = this.get('model.isNew');
    if (isNew || isFulfilling) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        let newMedication = this.get('model');
        newMedication.validate().then(function() {
          if (newMedication.get('isValid')) {
            if (isNew) {
              if (Ember.isEmpty(newMedication.get('patient'))) {
                this.addNewPatient();
                reject({
                  ignore: true,
                  message: 'creating new patient first'
                });
              } else {
                newMedication.set('medicationTitle', newMedication.get('inventoryItem.name'));
                newMedication.set('priceOfMedication', newMedication.get('inventoryItem.price'));
                newMedication.set('status', 'Requested');
                newMedication.set('requestedBy', newMedication.getUserName());
                newMedication.set('requestedDate', new Date());
                this.addChildToVisit(newMedication, 'medication', 'Pharmacy').then(function() {
                  this.finishBeforeUpdate(isFulfilling, resolve);
                }.bind(this), reject);
              }
            } else {
              this.finishBeforeUpdate(isFulfilling, resolve);
            }
          } else {
            this.send('showDisabledDialog');
            reject('invalid model');
          }
        }.bind(this)).catch(function() {
          this.send('showDisabledDialog');
          reject('invalid model');
        }.bind(this));
      }.bind(this));
    } else {
      return Ember.RSVP.resolve();
    }
  },

  finishBeforeUpdate(isFulfilling, resolve) {
    if (isFulfilling) {
      let inventoryLocations = this.get('model.inventoryLocations');
      let inventoryRequest = this.get('store').createRecord('inv-request', {
        expenseAccount: this.get('model.expenseAccount'),
        dateCompleted: new Date(),
        inventoryItem: this.get('model.inventoryItem'),
        inventoryLocations,
        quantity: this.get('model.quantity'),
        transactionType: 'Fulfillment',
        patient: this.get('model.patient'),
        markAsConsumed: true
      });
      this.performFulfillRequest(inventoryRequest, false, false, true).then(function() {
        this.set('model.status', 'Fulfilled');
        resolve();
      }.bind(this));
    } else {
      resolve();
    }
  },

  showUpdateButton: function() {
    let isFulfilled = this.get('isFulfilled');
    if (isFulfilled) {
      return false;
    } else {
      return this._super();
    }
  }.property('updateCapability', 'isFulfilled'),

  updateButtonText: function() {
    let i18n = this.get('i18n');
    if (this.get('model.hideFulfillRequest')) {
      return i18n.t('buttons.dispense');
    } else if (this.get('isFulfilling')) {
      return i18n.t('labels.fulfill');
    }
    return this._super();

  }.property('model.isNew', 'isFulfilling', 'model.hideFulfillRequest')

});

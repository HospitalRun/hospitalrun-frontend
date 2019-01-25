import { Promise as EmberPromise, resolve } from 'rsvp';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AddNewPatient from 'hospitalrun/mixins/add-new-patient';
import FulfillRequest from 'hospitalrun/mixins/fulfill-request';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations'; // inventory-locations mixin is needed for fulfill-request mixin!
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import UserSession from 'hospitalrun/mixins/user-session';

export default AbstractEditController.extend(AddNewPatient, FulfillRequest, InventoryLocations, PatientSubmodule, UserSession, {
  medicationController: controller('medication'),
  expenseAccountList: alias('medicationController.expenseAccountList'),

  canFulfill: computed(function() {
    return this.currentUserCan('fulfill_medication');
  }),

  isFulfilled: computed('model.status', function() {
    let status = this.get('model.status');
    return (status === 'Fulfilled');
  }),

  isFulfilling: computed('canFulfill', 'model.isRequested', 'model.shouldFulfillRequest', function() {
    let canFulfill = this.get('canFulfill');
    let isRequested = this.get('model.isRequested');
    let fulfillRequest = this.get('model.shouldFulfillRequest');
    let isFulfilling = canFulfill && (isRequested || fulfillRequest);
    this.get('model').set('isFulfilling', isFulfilling);
    return isFulfilling;
  }),

  isFulfilledOrRequested: computed('isFulfilled', 'model.isRequested', function() {
    return (this.get('isFulfilled') || this.get('model.isRequested'));
  }),

  prescriptionClass: computed('model.quantity', function() {
    let quantity = this.get('model.quantity');
    if (isEmpty(quantity)) {
      return 'required test-medication-prescription';
    }
  }),

  quantityClass: computed('isFulfilling', 'model.prescription', function() {
    let prescription = this.get('model.prescription');
    let returnClass = 'col-xs-3';
    let isFulfilling = this.get('isFulfilling');
    if (isFulfilling || isEmpty(prescription)) {
      returnClass += ' required';
    }
    return `${returnClass} test-quantity-input`;
  }),

  quantityLabel: computed('isFulfilled', function() {
    let intl = this.get('intl');
    let returnLabel = intl.t('medication.labels.quantityRequested');
    let isFulfilled = this.get('isFulfilled');
    let isFulfilling = this.get('isFulfilling');
    if (isFulfilling) {
      returnLabel = intl.t('medication.labels.quantityDispensed');
    } else if (isFulfilled) {
      returnLabel = intl.t('medication.labels.quantityDistributed');
    }
    return returnLabel;
  }),

  medicationList: [],
  updateCapability: 'add_medication',

  afterUpdate() {
    let intl = this.get('intl');
    let alertTitle, alertMessage;
    let isFulfilled = this.get('isFulfilled');
    if (isFulfilled) {
      alertTitle = intl.t('medication.alerts.fulfilledTitle');
      alertMessage = 'The medication request has been fulfilled.';
      this.set('model.selectPatient', false);
    } else {
      alertTitle = intl.t('medication.alerts.savedTitle');
      alertMessage = intl.t('medication.alerts.savedMessage');
    }
    this.saveVisitIfNeeded(alertTitle, alertMessage);
  },

  beforeUpdate() {
    let isFulfilling = this.get('isFulfilling');
    let isNew = this.get('model.isNew');
    if (isNew || isFulfilling) {
      return new EmberPromise(function(resolve, reject) {
        let newMedication = this.get('model');
        newMedication.validate().then(function() {
          if (newMedication.get('isValid')) {
            if (isNew) {
              if (isEmpty(newMedication.get('patient'))) {
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
      return resolve();
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

  showUpdateButton: computed('updateCapability', 'isFulfilled', function() {
    let isFulfilled = this.get('isFulfilled');
    if (isFulfilled) {
      return false;
    } else {
      return this._super();
    }
  }),

  updateButtonText: computed('model.isNew', 'isFulfilling', 'model.hideFulfillRequest', function() {
    let intl = this.get('intl');
    if (this.get('model.hideFulfillRequest')) {
      return intl.t('buttons.dispense');
    } else if (this.get('isFulfilling')) {
      return intl.t('labels.fulfill');
    }
    return this._super();

  })

});

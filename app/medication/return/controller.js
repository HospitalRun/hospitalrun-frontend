import { later } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import { translationMacro as t } from 'ember-i18n';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import FulfillRequest from 'hospitalrun/mixins/fulfill-request';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations'; // inventory-locations mixin is needed for fulfill-request mixin!
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import SelectValues from 'hospitalrun/utils/select-values';

export default AbstractEditController.extend(FulfillRequest, InventoryLocations, PatientSubmodule, {
  medicationController: controller('medication'),
  medicationList: [],

  lookupListsToUpdate: [{
    name: 'aisleLocationList', // Name of property containing lookup list
    property: 'model.aisleLocation', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'aisle_location_list' // Id of the lookup list to update
  }, {
    name: 'expenseAccountList', // Name of property containing lookup list
    property: 'model.expenseAccount', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'expense_account_list' // Id of the lookup list to update
  }, {
    name: 'warehouseList', // Name of property containing lookup list
    property: 'model.location', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'warehouse_list' // Id of the lookup list to update
  }],

  patientMedicationList: [],
  setNewMedicationList: false,

  aisleLocationList: alias('medicationController.aisleLocationList'),
  expenseAccountList: alias('medicationController.expenseAccountList'),
  warehouseList: alias('medicationController.warehouseList'),
  updateCapability: 'add_medication',

  medicationChanged: function() {
    let medication = this.get('model.medication');
    if (!isEmpty(medication)) {
      let inventoryItem = medication.get('inventoryItem');
      this.set('model.inventoryItemTypeAhead', `${inventoryItem.get('name')} - ${inventoryItem.get('friendlyId')}`);
      this.set('model.inventoryItem', inventoryItem);
    } else {
      this.set('model.inventoryItem');
    }
    later(function() {
      this.get('model').validate().catch(function() {});
    }.bind(this));
  }.observes('model.medication'),

  patientVisitsChanged: function() {
    let patientVisits = this.get('patientVisits');
    if (!isEmpty(patientVisits)) {
      this.set('model.visit', patientVisits.get('firstObject'));
    }
  }.observes('patientVisits'),

  showPatientMedicationList: function() {
    let patientMedicationList = this.get('patientMedicationList');
    this.get('patientMedication'); // Request patient medication be updated
    return !isEmpty(patientMedicationList);
  }.property('patientMedicationList', 'model.patient', 'model.visit'),

  patientMedication: function() {
    let setNewMedicationList = this.get('setNewMedicationList');
    let visit = this.get('model.visit');
    if (setNewMedicationList) {
      this.set('setNewMedicationList', false);
    } else if (!isEmpty(visit)) {
      visit.get('medication').then(function(medication) {
        medication = medication.filterBy('status', 'Fulfilled');
        this.set('model.medication', medication.get('firstObject'));
        this.set('patientMedicationList', medication.map(SelectValues.selectObjectMap));
        this.set('setNewMedicationList', true);
      }.bind(this));
    }
    return this.get('patientMedicationList');
  }.property('setNewMedicationList', 'model.patient', 'model.visit'),

  _finishUpdate() {
    let aisle = this.get('model.deliveryAisle');
    let location = this.get('model.deliveryLocation');
    let inventoryItem = this.get('model.inventoryItem');

    // find location on inventoryItem
    this._findOrCreateLocation(inventoryItem, location, aisle).then(function(inventoryLocation) {
      this.set('model.adjustPurchases', true);
      this.set('model.inventoryLocations', [inventoryLocation]);
      this.set('model.markAsConsumed', true);
      // Make sure inventory item is resolved first.
      this.get('model.inventoryItem').then(function() {
        this.send('fulfillRequest', this.get('model'), false, true, true);
      }.bind(this));
    }.bind(this));
  },

  actions: {
    doneFulfillRequest() {
      let i18n = this.get('i18n');
      this.updateLookupLists();
      this.displayAlert(i18n.t('medication.alerts.returnedTitle'), i18n.t('medication.alerts.returnedMessage'), 'allItems');
    },
    update() {
      let medication = this.get('model.medication');
      let quantity = this.get('model.quantity');
      if (!isEmpty(medication)) {
        medication.reload().then(function() {
          medication.decrementProperty('quantity', quantity);
          if (medication.get('quantity') < 0) {
            medication.set('quantity', 0);
          }
          medication.save().then(this._finishUpdate.bind(this));
        }.bind(this));
      } else {
        this._finishUpdate();
      }
    }
  },

  updateButtonText: t('medication.returnMedication')
});

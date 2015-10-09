import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import FulfillRequest from 'hospitalrun/mixins/fulfill-request';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations'; // inventory-locations mixin is needed for fulfill-request mixin!
import InventorySelection from 'hospitalrun/mixins/inventory-selection';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import SelectValues from 'hospitalrun/utils/select-values';

export default AbstractEditController.extend(FulfillRequest, InventoryLocations, InventorySelection, PatientSubmodule, {
  needs: ['medication'],

  lookupListsToUpdate: [{
    name: 'aisleLocationList', // Name of property containing lookup list
    property: 'aisleLocation', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'aisle_location_list' // Id of the lookup list to update
  }, {
    name: 'expenseAccountList', // Name of property containing lookup list
    property: 'expenseAccount', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'expense_account_list' // Id of the lookup list to update
  }, {
    name: 'warehouseList', // Name of property containing lookup list
    property: 'location', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'warehouse_list' // Id of the lookup list to update
  }],

  patientMedicationList: [],
  setNewMedicationList: false,

  aisleLocationList: Ember.computed.alias('controllers.medication.aisleLocationList'),
  expenseAccountList: Ember.computed.alias('controllers.medication.expenseAccountList'),
  warehouseList: Ember.computed.alias('controllers.medication.warehouseList'),
  updateCapability: 'add_medication',

  medicationChanged: function () {
    var medication = this.get('medication');
    if (!Ember.isEmpty(medication)) {
      var inventoryItem = medication.get('inventoryItem');
      this.set('inventoryItemTypeAhead', '%@ - %@'.fmt(inventoryItem.get('name'), inventoryItem.get('friendlyId')));
      this.set('inventoryItem', inventoryItem);
    } else {
      this.set('inventoryItem');
    }
    Ember.run.later(function () {
      this.get('model').validate();
    }.bind(this));
  }.observes('medication'),

  patientVisitsChanged: function () {
    var patientVisits = this.get('patientVisits');
    if (!Ember.isEmpty(patientVisits)) {
      this.set('visit', patientVisits.get('firstObject'));
    }
  }.observes('patientVisits'),

  showPatientMedicationList: function () {
    var patientMedicationList = this.get('patientMedicationList');
    this.get('patientMedication'); //Request patient medication be updated
    return !Ember.isEmpty(patientMedicationList);
  }.property('patientMedicationList','model.patient', 'model.visit'),

  patientMedication: function () {
    var setNewMedicationList = this.get('setNewMedicationList'),
      visit = this.get('model.visit');
    if (setNewMedicationList) {
      this.set('setNewMedicationList', false);
    } else if (!Ember.isEmpty(visit)) {
      visit.get('medication').then(function (medication) {
        medication = medication.filterBy('status', 'Fulfilled');
        this.set('medication', medication.get('firstObject'));
        //if (!Ember.isEmpty(medication)) {
          this.set('patientMedicationList', medication.map(SelectValues.selectObjectMap));
          this.set('setNewMedicationList', true);
        //}
      }.bind(this));
    }
    return this.get('patientMedicationList');
  }.property('setNewMedicationList','model.patient', 'model.visit'),

  _finishUpdate: function () {
    var aisle = this.get('deliveryAisle'),
      location = this.get('deliveryLocation'),
      inventoryItem = this.get('inventoryItem');

    // find location on inventoryItem
    this._findOrCreateLocation(inventoryItem, location, aisle).then(function (inventoryLocation) {
      this.set('adjustPurchases', true);
      this.set('inventoryLocations', [inventoryLocation]);
      this.set('markAsConsumed', true);
      // Make sure inventory item is resolved first.
      this.get('inventoryItem').then(function () {
        this.send('fulfillRequest', this.get('model'), false, true, true);
      }.bind(this));
    }.bind(this));
  },

  actions: {
    doneFulfillRequest: function () {
      this.updateLookupLists();
      this.displayAlert('Medication Returned', 'The medication has been marked as returned.', 'allItems');
    },
    update: function () {
      var medication = this.get('medication'),
        quantity = this.get('quantity');
      if (!Ember.isEmpty(medication)) {
        medication.reload().then(function () {
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

  updateButtonText: 'Return Medication'
});

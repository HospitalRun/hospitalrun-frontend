import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
  visitsController: Ember.inject.controller('visits'),

  canAddProcedure: function() {
    return this.currentUserCan('add_procedure');
  }.property(),

  chargePricingCategory: 'Procedure',
  chargeRoute: 'procedures.charge',

  anesthesiaTypes: Ember.computed.alias('visitsController.anesthesiaTypes'),
  anesthesiologistList: Ember.computed.alias('visitsController.anesthesiologistList'),
  cptCodeList: Ember.computed.alias('visitsController.cptCodeList'),
  medicationList: null,
  physicianList: Ember.computed.alias('visitsController.physicianList'),
  procedureList: Ember.computed.alias('visitsController.procedureList'),
  procedureLocations: Ember.computed.alias('visitsController.procedureLocations'),
  lookupListsToUpdate: [{
    name: 'anesthesiaTypes',
    property: 'model.anesthesiaType',
    id: 'anesthesia_types'
  }, {
    name: 'anesthesiologistList',
    property: 'model.anesthesiologist',
    id: 'anesthesiologists'
  }, {
    name: 'cptCodeList',
    property: 'model.cptCode',
    id: 'cpt_code_list'
  }, {
    name: 'physicianList',
    property: 'model.assistant',
    id: 'physician_list'
  }, {
    name: 'physicianList',
    property: 'model.physician',
    id: 'physician_list'
  }, {
    name: 'procedureList',
    property: 'model.description',
    id: 'procedure_list'
  }, {
    name: 'procedureLocations',
    property: 'model.location',
    id: 'procedure_locations'
  }],

  editController: Ember.inject.controller('visits/edit'),
  pricingList: null, // This gets filled in by the route
  pricingTypes: Ember.computed.alias('visitsController.procedurePricingTypes'),
  newProcedure: false,

  title: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return 'Add Procedure';
    }
    return 'Edit Procedure';
  }.property('model.isNew'),

  updateCapability: 'add_charge',

  actions: {
    showAddMedication: function() {
      var newCharge = this.get('store').createRecord('proc-charge', {
        dateCharged: new Date(),
        newMedicationCharge: true,
        quantity: 1
      });
      this.send('openModal', 'procedures.medication', newCharge);
    },

    showEditMedication: function(charge) {
      this.send('openModal', 'procedures.medication', charge);
    },

    showDeleteMedication: function(charge) {
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deleteCharge',
        title: 'Delete Medication Used',
        message: 'Are you sure you want to delete this medication?',
        chargeToDelete: charge,
        updateButtonAction: 'confirm',
        updateButtonText: 'Ok'
      }));
    }
  },

  beforeUpdate: function() {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      this.updateCharges().then(function() {
        if (this.get('model.isNew')) {
          this.addChildToVisit(this.get('model'), 'procedures').then(resolve, reject);
        } else {
          resolve();
        }
      }.bind(this), reject);
    }.bind(this));
  },

  afterUpdate: function() {
    var alertTitle = 'Procedure Saved',
      alertMessage = 'The procedure record has been saved.';
    this.saveVisitIfNeeded(alertTitle, alertMessage);
  }
});

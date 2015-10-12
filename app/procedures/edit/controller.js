import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
  needs: ['visits', 'visits/edit'],

  canAddProcedure: function() {
    return this.currentUserCan('add_procedure');
  }.property(),

  chargePricingCategory: 'Procedure',
  chargeRoute: 'procedures.charge',

  anesthesiaTypes: Ember.computed.alias('controllers.visits.anesthesiaTypes'),
  anesthesiologistList: Ember.computed.alias('controllers.visits.anesthesiologistList'),
  cptCodeList: Ember.computed.alias('controllers.visits.cptCodeList'),
  physicianList: Ember.computed.alias('controllers.visits.physicianList'),
  procedureList: Ember.computed.alias('controllers.visits.procedureList'),
  procedureLocations: Ember.computed.alias('controllers.visits.procedureLocations'),
  lookupListsToUpdate: [{
    name: 'anesthesiaTypes',
    property: 'anesthesiaType',
    id: 'anesthesia_types'
  }, {
    name: 'anesthesiologistList',
    property: 'anesthesiologist',
    id: 'anesthesiologists'
  }, {
    name: 'cptCodeList',
    property: 'cptCode',
    id: 'cpt_code_list'
  }, {
    name: 'physicianList',
    property: 'assistant',
    id: 'physician_list'
  }, {
    name: 'physicianList',
    property: 'physician',
    id: 'physician_list'
  }, {
    name: 'procedureList',
    property: 'description',
    id: 'procedure_list'
  }, {
    name: 'procedureLocations',
    property: 'location',
    id: 'procedure_locations'
  }],

  editController: Ember.computed.alias('controllers.visits/edit'),
  pricingList: null, // This gets filled in by the route
  pricingTypes: Ember.computed.alias('controllers.visits.procedurePricingTypes'),
  newProcedure: false,

  title: function() {
    var isNew = this.get('isNew');
    if (isNew) {
      return 'Add Procedure';
    }
    return 'Edit Procedure';
  }.property('isNew'),

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
        if (this.get('isNew')) {
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

import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
  visitsController: Ember.inject.controller('visits'),

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
    let isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('procedures.titles.add');
    }
    return this.get('i18n').t('procedures.titles.edit');
  }.property('model.isNew'),

  updateCapability: 'add_procedure',

  actions: {
    showAddMedication: function() {
      let newCharge = this.get('store').createRecord('proc-charge', {
        dateCharged: new Date(),
        newMedicationCharge: true,
        quantity: 1
      });
      this.send('openModal', 'procedures.medication', newCharge);
    },

    showEditMedication: function(charge) {
      let medicationList = this.get('medicationList');
      let selectedMedication = medicationList.findBy('id', charge.get('medication.id'));
      charge.set('itemName', selectedMedication.name);
      this.send('openModal', 'procedures.medication', charge);
    },

    showDeleteMedication: function(charge) {
      this.send('openModal', 'dialog', Ember.Object.create({
        confirmAction: 'deleteCharge',
        title: this.get('i18n').t('procedures.titles.deleteMedicationUsed'),
        message: this.get('i18n').t('procedures.messages.deleteMedication'),
        chargeToDelete: charge,
        updateButtonAction: 'confirm',
        updateButtonText: this.get('i18n').t('buttons.ok')
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
    let alertTitle = this.get('i18n').t('procedures.titles.saved');
    let alertMessage = this.get('i18n').t('procedures.messages.saved');
    this.saveVisitIfNeeded(alertTitle, alertMessage);
  }
});

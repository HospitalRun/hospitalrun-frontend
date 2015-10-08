import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import Ember from 'ember';
export default AbstractModuleRoute.extend({
  addCapability: 'add_medication',
  moduleName: 'medication',
  newButtonText: '+ new request',
  sectionTitle: 'Medication',

  additionalButtons: function () {
    var additionalButtons = [];
    if (this.currentUserCan('fulfill_medication')) {
      additionalButtons.push({
        buttonIcon: 'octicon octicon-checklist',
        buttonAction: 'dispenseMedication',
        buttonText: 'dispense medication',
        class: 'btn btn-primary'
      });
    }
    if (this.currentUserCan(this.get('addCapability'))) {
      additionalButtons.push({
        buttonIcon: 'octicon octicon-mail-reply',
        buttonAction: 'returnMedication',
        buttonText: 'return medication',
        class: 'btn btn-primary'
      });
    }
    if (!Ember.isEmpty(additionalButtons)) {
      return additionalButtons;
    }
  }.property(),

  additionalModels: [{
    name: 'aisleLocationList',
    findArgs: ['lookup', 'aisle_location_list']
  }, {
    name: 'expenseAccountList',
    findArgs: ['lookup', 'expense_account_list']
  }, {
    name: 'warehouseList',
    findArgs: ['lookup', 'warehouse_list']
  }],

  subActions: [{
    text: 'Requests',
    linkTo: 'medication.index'
  }, {
    text: 'Completed',
    linkTo: 'medication.completed'
  }],

  actions: {
    dispenseMedication: function () {
      if (this.currentUserCan('fulfill_medication')) {
        this.transitionTo('medication.edit', 'dispense');
      }
    },

    returnMedication: function () {
      if (this.currentUserCan(this.get('addCapability'))) {
        this.transitionTo('medication.return', 'new');
      }
    }
  }
});

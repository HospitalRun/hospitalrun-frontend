import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AdjustmentTypes from 'hospitalrun/mixins/inventory-adjustment-types';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractEditController.extend(AdjustmentTypes, {
  inventoryController: Ember.inject.controller('inventory'),

  expenseAccountList: Ember.computed.alias('inventoryController.expenseAccountList'),

  title: t('inventory.titles.adjustment'),

  transactionTypeChanged: function() {
    Ember.run.once(this, function() {
      this.get('model').validate().catch(Ember.K);
    });
  }.observes('transactionType'),

  updateButtonText: function() {
    return this.get('model.transactionType');
  }.property('model.transactionType'),

  updateButtonAction: 'adjust',

  updateCapability: 'adjust_inventory_location',

  actions: {
    cancel: function() {
      this.send('closeModal');
    },

    adjust: function() {
      this.send('adjustItems', this.get('model'), true);
    }
  }
});

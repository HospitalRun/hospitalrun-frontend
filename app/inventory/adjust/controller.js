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
    let transactionType = this.get('model.transactionType');
    let adjustmentType = this.get('adjustmentTypes').findBy('type', transactionType);
    return adjustmentType.name;
  }.property('model.transactionType'),

  updateButtonAction: 'adjust',

  updateCapability: 'adjust_inventory_location',

  actions: {
    cancel() {
      this.send('closeModal');
    },

    adjust() {
      this.send('adjustItems', this.get('model'), true);
    }
  }
});

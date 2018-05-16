<<<<<<< HEAD
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
=======
import { once } from '@ember/runloop';
import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import AdjustmentTypes from 'hospitalrun/mixins/inventory-adjustment-types';
import { translationMacro as t } from 'ember-i18n';
export default AbstractEditController.extend(AdjustmentTypes, {
  inventoryController: controller('inventory'),

  expenseAccountList: alias('inventoryController.expenseAccountList'),

  title: t('inventory.titles.adjustment'),

  transactionTypeChanged: function() {
    once(this, function() {
      this.get('model').validate().catch(function() {});
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea

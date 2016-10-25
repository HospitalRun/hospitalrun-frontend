import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import LabPricingTypes from 'hospitalrun/mixins/lab-pricing-types';
import ImagingPricingTypes from 'hospitalrun/mixins/imaging-pricing-types';
import ReturnTo from 'hospitalrun/mixins/return-to';
import SelectValues from 'hospitalrun/utils/select-values';
export default AbstractEditController.extend(LabPricingTypes, ImagingPricingTypes, ReturnTo, {
  pricingController: Ember.inject.controller('pricing'),

  actions: {
    addOverride: function(override) {
      let pricingOverrides = this.get('model.pricingOverrides');
      pricingOverrides.addObject(override);
      this.send('update', true);
      this.send('closeModal');
    },
    deleteOverride: function(model) {
      let overrideToDelete = model.overrideToDelete;
      let pricingOverrides = this.get('model.pricingOverrides');
      pricingOverrides.removeObject(overrideToDelete);
      overrideToDelete.destroyRecord().then(function() {
        this.send('update', true);
        this.send('closeModal');
      }.bind(this));
    },
    editOverride: function(overrideToEdit) {
      if (Ember.isEmpty(overrideToEdit)) {
        overrideToEdit = this.store.createRecord('override-price');
      }
      this.send('openModal', 'pricing.override', overrideToEdit);
    },
    showDeleteOverride: function(overrideToDelete) {
      let message = 'Are you sure you want to delete this override?';
      let model = Ember.Object.create({
        overrideToDelete: overrideToDelete
      });
      let title = 'Delete Override';
      this.displayConfirm(title, message, 'deleteOverride', model);
    }
  },

  categories: [
    'Imaging',
    'Lab',
    'Procedure',
    'Ward'
  ].map(SelectValues.selectValuesMap),
  expenseAccountList: Ember.computed.alias('pricingController.expenseAccountList'),
  imagingPricingTypes: Ember.computed.alias('pricingController.imagingPricingTypes'),
  labPricingTypes: Ember.computed.alias('pricingController.labPricingTypes'),
  procedurePricingTypes: Ember.computed.alias('pricingController.procedurePricingTypes'),
  wardPricingTypes: Ember.computed.alias('pricingController.wardPricingTypes'),

  lookupListsToUpdate: function() {
    let category = this.get('model.category').toLowerCase();
    let listsToUpdate = [{
      name: 'expenseAccountList',
      property: 'model.expenseAccount',
      id: 'expense_account_list'
    }];
    listsToUpdate.push({
      name: `${category}PricingTypes`,
      property: 'model.pricingType',
      id: `${category}_pricing_types`
    });
    return listsToUpdate;
  }.property('model.category'),

  pricingTypes: function() {
    let category = this.get('model.category');
    if (!Ember.isEmpty(category)) {
      let typesList = this.get(`${category.toLowerCase()}PricingTypes`);
      if (Ember.isEmpty(typesList) || Ember.isEmpty(typesList.get('value'))) {
        if (category === 'Lab') {
          return Ember.Object.create({ value: this.defaultLabPricingTypes });
        } else if (category === 'Imaging') {
          return Ember.Object.create({ value: this.defaultImagingPricingTypes });
        }
      }
      return typesList;
    }
  }.property('model.category'),

  updateCapability: 'add_pricing',

  afterUpdate: function(record) {
    let message = `The pricing record for ${record.get('name')} has been saved.`;
    this.displayAlert('Pricing Item Saved', message);
  }
});

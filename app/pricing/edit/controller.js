import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import LabPricingTypes from 'hospitalrun/mixins/lab-pricing-types';
import ImagingPricingTypes from 'hospitalrun/mixins/imaging-pricing-types';
import ReturnTo from 'hospitalrun/mixins/return-to';
import SelectValues from 'hospitalrun/utils/select-values';
export default AbstractEditController.extend(LabPricingTypes, ImagingPricingTypes, ReturnTo, {
  needs: ['pricing'],

  actions: {
    addOverride: function (override) {
      var pricingOverrides = this.get('pricingOverrides');
      pricingOverrides.addObject(override);
      this.send('update', true);
      this.send('closeModal');
    },
    deleteOverride: function (model) {
      var overrideToDelete = model.overrideToDelete,
        pricingOverrides = this.get('pricingOverrides');
      pricingOverrides.removeObject(overrideToDelete);
      overrideToDelete.destroyRecord().then(function () {
        this.send('update', true);
        this.send('closeModal');
      }.bind(this));
    },
    editOverride: function (overrideToEdit) {
      if (Ember.isEmpty(overrideToEdit)) {
        overrideToEdit = this.store.createRecord('override-price');
      }
      this.send('openModal', 'pricing.override', overrideToEdit);
    },
    showDeleteOverride: function (overrideToDelete) {
      var message = 'Are you sure you want to delete this override?',
        model = Ember.Object.create({
          overrideToDelete: overrideToDelete
        }),
        title = 'Delete Override';
      this.displayConfirm(title, message, 'deleteOverride', model);
    }
  },

  categories: [
    'Imaging',
    'Lab',
    'Procedure',
    'Ward'
  ].map(SelectValues.selectValuesMap),
  expenseAccountList: Ember.computed.alias('controllers.pricing.expenseAccountList'),
  imagingPricingTypes: Ember.computed.alias('controllers.pricing.imagingPricingTypes'),
  labPricingTypes: Ember.computed.alias('controllers.pricing.labPricingTypes'),
  procedurePricingTypes: Ember.computed.alias('controllers.pricing.procedurePricingTypes'),
  wardPricingTypes: Ember.computed.alias('controllers.pricing.wardPricingTypes'),

  lookupListsToUpdate: function () {
    var category = this.get('category').toLowerCase(),
      listsToUpdate = [{
        name: 'expenseAccountList',
        property: 'expenseAccount',
        id: 'expense_account_list'
      }];
    listsToUpdate.push({
      name: category + 'PricingTypes',
      property: 'pricingType',
      id: category + '_pricing_types'
    });
    return listsToUpdate;
  }.property('category'),

  pricingTypes: function () {
    var category = this.get('category');
    if (!Ember.isEmpty(category)) {
      var typesList = this.get(category.toLowerCase() + 'PricingTypes');
      if (Ember.isEmpty(typesList) || Ember.isEmpty(typesList.get('value'))) {
        if (category === 'Lab') {
          return Ember.Object.create({value: this.defaultLabPricingTypes});
        } else if (category === 'Imaging') {
          return Ember.Object.create({value: this.defaultImagingPricingTypes});
        }
      }
      return typesList;
    }
  }.property('category'),

  updateCapability: 'add_pricing',

  afterUpdate: function (record) {
    var message = 'The pricing record for %@ has been saved.'.fmt(record.get('name'));
    this.displayAlert('Pricing Item Saved', message);
  }
});

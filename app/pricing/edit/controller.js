import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import ReturnTo from 'hospitalrun/mixins/return-to';
import SelectValues from 'hospitalrun/utils/select-values';

const {
  computed,
  isEmpty
} = Ember;

const IMAGING_PRICING_TYPE = 'Imaging Procedure';
const LAB_PRICING_TYPE = 'Lab Procedure';

export default AbstractEditController.extend(ReturnTo, {
  pricingController: Ember.inject.controller('pricing'),

  actions: {
    addOverride(override) {
      let pricingOverrides = this.get('model.pricingOverrides');
      pricingOverrides.addObject(override);
      this.send('update', true);
      this.send('closeModal');
    },
    categoryChanged(category) {
      let model = this.get('model');
      let pricingType = model.get('pricingType');
      model.set('category', category);
      if (!isEmpty(category)) {
        if (category === 'Imaging') {
          model.set('pricingType', IMAGING_PRICING_TYPE);
        } else if (category === 'Lab') {
          model.set('pricingType', LAB_PRICING_TYPE);
        } else {
          let pricingTypeValues = this.get('pricingTypes.value');
          if (isEmpty(pricingTypeValues) || !pricingTypeValues.includes(pricingType)) {
            model.set('pricingType');
          }
        }
      }
    },
    deleteOverride(model) {
      let { overrideToDelete } = model;
      let pricingOverrides = this.get('model.pricingOverrides');
      pricingOverrides.removeObject(overrideToDelete);
      overrideToDelete.destroyRecord().then(function() {
        this.send('update', true);
        this.send('closeModal');
      }.bind(this));
    },
    editOverride(overrideToEdit) {
      if (isEmpty(overrideToEdit)) {
        overrideToEdit = this.store.createRecord('override-price');
      }
      this.send('openModal', 'pricing.override', overrideToEdit);
    },
    showDeleteOverride(overrideToDelete) {
      let message = 'Are you sure you want to delete this override?';
      let model = Ember.Object.create({
        overrideToDelete
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
  expenseAccountList: computed.alias('pricingController.expenseAccountList'),
  procedurePricingTypes: computed.alias('pricingController.procedurePricingTypes'),
  wardPricingTypes: computed.alias('pricingController.wardPricingTypes'),

  lookupListsToUpdate: computed('model.category', function() {
    let category = this.get('model.category').toLowerCase();
    let listsToUpdate = [{
      name: 'expenseAccountList',
      property: 'model.expenseAccount',
      id: 'expense_account_list'
    }];
    let showPricingType = this.get('showPricingType');
    if (showPricingType) {
      listsToUpdate.push({
        name: `${category}PricingTypes`,
        property: 'model.pricingType',
        id: `${category}_pricing_types`
      });
    }
    return listsToUpdate;
  }),

  pricingTypes: computed('model.category', function() {
    let category = this.get('model.category');
    if (!isEmpty(category)) {
      let typesList = this.get(`${category.toLowerCase()}PricingTypes`);
      return typesList;
    }
  }),

  showPricingType: computed('model.category', function() {
    let model = this.get('model');
    let category = model.get('category');
    if (category === 'Imaging' || category === 'Lab') {
      return false;
    } else {
      return true;
    }
  }),

  updateCapability: 'add_pricing',

  afterUpdate(record) {
    let message = `The pricing record for ${record.get('name')} has been saved.`;
    this.displayAlert('Pricing Item Saved', message);
  }
});

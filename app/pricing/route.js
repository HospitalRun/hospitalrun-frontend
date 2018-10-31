import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default AbstractModuleRoute.extend({
  addCapability: 'add_pricing',
  additionalModels: [{
    name: 'expenseAccountList',
    findArgs: ['lookup', 'expense_account_list']
  }, {
    name: 'procedurePricingTypes',
    findArgs: ['lookup', 'procedure_pricing_types']
  }, {
    name: 'pricingProfiles',
    findArgs: ['price-profile']
  }, {
    name: 'wardPricingTypes',
    findArgs: ['lookup', 'ward_pricing_types']
  }],
  allowSearch: true,
  moduleName: 'pricing',
  newButtonText: t('buttons.newItem'),
  sectionTitle: t('pricing.sectionTitle'),
  subActions: Ember.computed(function() {
    return [{
      text: this.get('intl').t('pricing.navigation.allPricingItems'),
      linkTo: 'pricing.index'
    }, {
      text: this.get('intl').t('pricing.navigation.imagePricing'),
      linkTo: 'pricing.imaging'
    }, {
      text: this.get('intl').t('pricing.navigation.labPricing'),
      linkTo: 'pricing.lab'
    }, {
      text: this.get('intl').t('pricing.navigation.procedurePricing'),
      linkTo: 'pricing.procedure'
    }, {
      text: this.get('intl').t('pricing.navigation.wardPricing'),
      linkTo: 'pricing.ward'
    }, {
      text: this.get('intl').t('pricing.navigation.pricingProfiles'),
      linkTo: 'pricing.profiles'
    }];
  })
});

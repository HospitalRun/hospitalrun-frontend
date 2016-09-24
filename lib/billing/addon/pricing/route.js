import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
  addCapability: 'add_pricing',
  additionalModels: [{
    name: 'expenseAccountList',
    findArgs: ['lookup', 'expense_account_list']
  }, {
    name: 'imagingPricingTypes',
    findArgs: ['lookup', 'imaging_pricing_types']
  }, {
    name: 'labPricingTypes',
    findArgs: ['lookup', 'lab_pricing_types']
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
  newButtonText: '+ new item',
  sectionTitle: 'Pricing',
  subActions: [{
    text: 'All Pricing Items',
    linkTo: 'pricing.index'
  }, {
    text: 'Imaging Pricing',
    linkTo: 'pricing.imaging'
  }, {
    text: 'Lab Pricing',
    linkTo: 'pricing.lab'
  }, {
    text: 'Procedure Pricing',
    linkTo: 'pricing.procedure'
  }, {
    text: 'Ward Pricing',
    linkTo: 'pricing.ward'
  }, {
    text: 'Pricing Profiles',
    linkTo: 'pricing.profiles'
  }]
});

import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
  addCapability: 'add_imaging',
  additionalModels: [{
    name: 'imagingPricingTypes',
    findArgs: ['lookup', 'imaging_pricing_types']
  }, {
    name: 'radiologistList',
    findArgs: ['lookup', 'radiologists'],
  }],
  allowSearch: false,
  moduleName: 'imaging',
  newButtonText: '+ new imaging',
  sectionTitle: 'Imaging',
  subActions: [{
    text: 'Requests',
    linkTo: 'imaging.index'
  }, {
    text: 'Completed',
    linkTo: 'imaging.completed'
  }],

});

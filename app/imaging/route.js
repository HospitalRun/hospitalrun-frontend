import { translationMacro as t } from 'ember-i18n';
import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
  addCapability: 'add_imaging',
  additionalModels: [{
    name: 'imagingPricingTypes',
    findArgs: ['lookup', 'imaging_pricing_types']
  }, {
    name: 'radiologistList',
    findArgs: ['lookup', 'radiologists']
  }],
  allowSearch: false,
  moduleName: 'imaging',
  newButtonText: t('imaging.buttons.new_button'),
  sectionTitle: t('imaging.section_title'),
  subActions: function() {
    let i18n = this.get('i18n');

    return [{
      text: i18n.t('labels.requests'),
      linkTo: 'imaging.index'
    }, {
      text: i18n.t('labels.completed'),
      linkTo: 'imaging.completed'
    }];

  }.property()

});

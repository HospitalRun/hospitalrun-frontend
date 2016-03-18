import Ember from 'ember';
import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import { translationMacro as t } from 'ember-i18n';

const { computed } = Ember;

export default AbstractModuleRoute.extend({
  addCapability: 'add_lab',
  additionalModels: [{
    name: 'labPricingTypes',
    findArgs: ['lookup', 'lab_pricing_types']
  }],
  allowSearch: false,
  moduleName: 'labs',
  newButtonText: t('labs.buttons.new_button'),
  sectionTitle: t('labs.section_title'),

  subActions: computed(function() {
    let i18n = this.get('i18n');
    return [{
      text: i18n.t('labels.requests'),
      linkTo: 'labs.index'
    }, {
      text: i18n.t('labels.completed'),
      linkTo: 'labs.completed'
    }];
  })
});

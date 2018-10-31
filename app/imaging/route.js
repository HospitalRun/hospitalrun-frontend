import { translationMacro as t } from 'ember-intl';
import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
  addCapability: 'add_imaging',
  additionalModels: [{
    name: 'radiologistList',
    findArgs: ['lookup', 'radiologists']
  }],
  allowSearch: false,
  moduleName: 'imaging',
  newButtonText: t('imaging.buttons.newButton'),
  sectionTitle: t('imaging.sectionTitle')
});

import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import { translationMacro as t } from 'ember-i18n';
export default AbstractModuleRoute.extend({
  addCapability: 'add_lab',
  allowSearch: false,
  moduleName: 'labs',
  newButtonText: t('labs.buttons.newButton'),
  sectionTitle: t('labs.sectionTitle')
});

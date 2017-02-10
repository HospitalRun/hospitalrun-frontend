import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import { translationMacro as t } from 'ember-i18n';

export default AbstractModuleRoute.extend({
  addCapability: 'add_incident',
  additionalModels: [{
    name: 'incidentDepartmentList',
    findArgs: ['lookup', 'incident_departments']
  }, {
    name: 'incidentCategoryList',
    findArgs: ['inc-category']
  }],
  moduleName: 'incident',
  newButtonText: t('incident.buttons.newIncident'),
  sectionTitle: t('incident.titles.incidents')
});


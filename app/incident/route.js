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
  allowSearch: false,
  currentScreenTitle: t('incidents.titles.incidents'),
  editTitle: t('incidents.titles.editIncident'),
  newTitle: t('incidents.titles.newIncident'),
  moduleName: 'incident',
  newButtonText: t('incident.buttons.newIncident'),
  sectionTitle: t('incident.titles.incidents')
});


import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import IncidentId from 'hospitalrun/mixins/incident-id';
import { translationMacro as t } from 'ember-i18n';
export default AbstractModuleRoute.extend(IncidentId, {
  addCapability: 'add_incident',
  additionalModels: [{
    name: 'userList',
    findArgs: ['user']
  },{
    name: 'incidentLocationsList',
    findArgs: ['lookup','incident_locations']
  },{
    name: 'harmScoreList',
    findArgs: ['lookup','harm_scores']
  },{
    name: 'incidentCategoryList',
    findArgs: ['inc-category']
  }],
  moduleName: 'incident',
  newButtonText: t('incident.buttons.new_incident'),
  sectionTitle: t('incident.titles.incidents')
});


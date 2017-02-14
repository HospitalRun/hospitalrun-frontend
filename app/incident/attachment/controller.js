import PatientPhotoController from 'hospitalrun/patients/photo/controller';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

const { inject } = Ember;

export default PatientPhotoController.extend({
  addAction: 'addAttachment',
  editTitle: t('incident.titles.addAttachment'),
  modelName: 'attachment',
  newTitle: t('incident.titles.editAttachment'),

  editController: inject.controller('incident/edit')

});

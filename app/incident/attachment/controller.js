import PatientPhotoController from 'hospitalrun/patients/photo/controller';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

const { inject } = Ember;

export default PatientPhotoController.extend({
  addAction: 'addAttachment',
  editTitle: t('incident.titles.editAttachment'),
  modelName: 'attachment',
  newTitle: t('incident.titles.addAttachment'),
  fileRequiredMessage: t('incident.messages.attachmentFileRequired'),

  editController: inject.controller('incident/edit')

});

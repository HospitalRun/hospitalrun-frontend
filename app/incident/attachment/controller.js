<<<<<<< HEAD
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
=======
import { inject as controller } from '@ember/controller';
import PatientPhotoController from 'hospitalrun/patients/photo/controller';
import { translationMacro as t } from 'ember-i18n';

export default PatientPhotoController.extend({
  addAction: 'addAttachment',
  editTitle: t('incident.titles.editAttachment'),
  modelName: 'attachment',
  newTitle: t('incident.titles.addAttachment'),
  fileRequiredMessage: t('incident.messages.attachmentFileRequired'),

  editController: controller('incident/edit')

});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea

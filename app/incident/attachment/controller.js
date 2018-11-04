import { inject as controller } from '@ember/controller';
import PatientPhotoController from 'hospitalrun/patients/photo/controller';
import { t } from 'hospitalrun/macro';

export default PatientPhotoController.extend({
  addAction: 'addAttachment',
  editTitle: t('incident.titles.editAttachment'),
  modelName: 'attachment',
  newTitle: t('incident.titles.addAttachment'),
  fileRequiredMessage: t('incident.messages.attachmentFileRequired'),

  editController: controller('incident/edit')

});

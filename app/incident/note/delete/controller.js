import { inject as controller } from '@ember/controller';
import { get } from '@ember/object';
import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import { t } from 'hospitalrun/macro';

export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyNoteDelete',
  editController: controller('incident/edit'),

  title: t('incident.titles.deleteNote'),

  actions: {
    notifyNoteDelete() {
      get(this, 'editController').send('deleteNote', get(this, 'model'));
      this.send('closeModal');
    }
  }
});

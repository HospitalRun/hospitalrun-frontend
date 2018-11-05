import { translationMacro as t } from 'ember-i18n';
import { inject as controller } from '@ember/controller';
import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
export default AbstractDeleteController.extend({
  title: t('inventory.labels.deleteItem'),
  editController: controller('inventory/edit'),
  afterDeleteAction: 'updateAndCloseModal',

  actions: {
    updateAndCloseModal() {
      this.get('editController').send('update', true);
      this.send('closeModal');
    }
  }
});

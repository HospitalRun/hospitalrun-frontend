import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import { t } from 'hospitalrun/macro';
export default AbstractDeleteController.extend({
  title: t('labels.deleteUser'),

  actions: {
    delete() {
      let recordToDelete = this.get('model');
      this.get('model').destroyRecord().then(() => {
        this.send('closeModal', recordToDelete);
      });
    }
  }
});

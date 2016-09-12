import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import { translationMacro as t } from 'ember-i18n';
export default AbstractDeleteController.extend({
  title: t('labels.deleteUser'),

  actions: {
    delete: function() {
      var recordToDelete = this.get('model');
      this.get('model').destroyRecord().then(() => {
        this.send('closeModal', recordToDelete);
      });
    }
  }
});

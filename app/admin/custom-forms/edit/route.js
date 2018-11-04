import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import { t } from 'hospitalrun/macro';
export default AbstractEditRoute.extend({
  hideNewButton: true,
  newTitle: t('admin.customForms.titles.newCustomForm'),
  editTitle: t('admin.customForms.titles.editCustomForm'),
  modelName: 'custom-form',

  actions: {
    allItems() {
      this.transitionTo('admin.custom-forms');
    }
  }
});

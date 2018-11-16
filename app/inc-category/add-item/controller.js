import Controller, { inject as controller } from '@ember/controller';
import { alias } from '@ember/object/computed';
import { get } from '@ember/object';
import { t } from 'hospitalrun/macro';

export default Controller.extend({
  showUpdateButton: true,
  title: t('incident.titles.addCategoryItem'),
  updateButtonAction: 'add',
  updateButtonText: 'Add',

  incidentCategoryEdit: controller('inc-category/edit'),
  editController: alias('incidentCategoryEdit'),

  actions: {
    add() {
      let newItem = get(this, 'model');
      get(this, 'editController').send('addItem', newItem);
    },

    cancel() {
      this.send('closeModal');
    }
  }
});

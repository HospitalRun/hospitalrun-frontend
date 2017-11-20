import { isEmpty } from '@ember/utils';
import Controller, { inject as controller } from '@ember/controller';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
export default Controller.extend(IsUpdateDisabled, {
  editController: controller('admin/lookup'),
  showUpdateButton: true,

  updateButtonAction: 'update',
  updateButtonText: function() {
    let i18n = this.get('i18n');
    if (this.get('model.isNew')) {
      return i18n.t('buttons.add');
    } else {
      return i18n.t('buttons.update');
    }
  }.property('model.isNew'),

  actions: {
    cancel() {
      this.send('closeModal');
    },

    update() {
      if (!isEmpty(this.get('model.value'))) {
        this.get('editController').send('updateValue', this.get('model'));
        this.send('closeModal');
      }
    }
  }
});

import { isEmpty } from '@ember/utils';
import Controller, { inject as controller } from '@ember/controller';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import { computed } from '@ember/object';

export default Controller.extend(IsUpdateDisabled, {
  editController: controller('admin/lookup'),
  showUpdateButton: true,

  updateButtonAction: 'update',
  updateButtonText: computed('model.isNew', function() {
    let intl = this.get('intl');
    if (this.get('model.isNew')) {
      return i18n.t('buttons.add');
    } else {
      return i18n.t('buttons.update');
    }
  }),

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

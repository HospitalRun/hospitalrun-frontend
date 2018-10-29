import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import { computed } from '@ember/object';

export default AbstractEditController.extend({
  actions: {
    cancel() {
      this.send('closeModal');
    }
  },

  afterUpdate(record) {
    let message = `The pricing profile ${record.get('name')} has been saved.`;
    this.displayAlert('Pricing Profile Saved', message, 'refreshProfiles');
  },

  title: computed('model.isNew', function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return 'New Pricing Profile';
    } else {
      return 'Edit Pricing Profile';
    }
  })
});

import { inject as controller } from '@ember/controller';
import RSVP from 'rsvp';
import { set, get, computed } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';

export default AbstractEditController.extend({
  cancelAction: 'closeModal',
  newNote: false,
  updateCapability: 'manage_incidents',

  editController: controller('incident/edit'),

  title: computed('model.isNew', function() {
    let intl = get(this, 'intl');
    let isNew = get(this, 'model.isNew');
    if (isNew) {
      return intl.t('incident.titles.addNote');
    }
    return intl.t('incident.titles.editNote');
  }),

  afterUpdate(note) {
    if (get(this, 'newNote')) {
      get(this, 'editController').send('addNote', note);
    } else {
      this.send('closeModal');
    }
  },

  beforeUpdate() {
    set(this, 'newNote', get(this, 'model.isNew'));
    return RSVP.resolve();
  }

});

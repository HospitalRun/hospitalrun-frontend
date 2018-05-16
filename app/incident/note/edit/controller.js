<<<<<<< HEAD
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';

const { computed, get, inject, RSVP, set } = Ember;

export default AbstractEditController.extend({
  cancelAction: 'closeModal',
  newNote: false,
  updateCapability: 'manage_incidents',

  editController: inject.controller('incident/edit'),

  title: computed('model.isNew', function() {
    let i18n = get(this, 'i18n');
    let isNew = get(this, 'model.isNew');
    if (isNew) {
      return i18n.t('incident.titles.addNote');
    }
    return i18n.t('incident.titles.editNote');
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
=======
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
    let i18n = get(this, 'i18n');
    let isNew = get(this, 'model.isNew');
    if (isNew) {
      return i18n.t('incident.titles.addNote');
    }
    return i18n.t('incident.titles.editNote');
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea

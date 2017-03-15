import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

const { get, inject } = Ember;

export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyNoteDelete',
  editController: inject.controller('incident/edit'),

  title: t('incident.titles.deleteNote'),

  actions: {
    notifyNoteDelete() {
      get(this, 'editController').send('deleteNote', get(this, 'model'));
      this.send('closeModal');
    }
  }
});

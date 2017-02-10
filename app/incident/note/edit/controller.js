import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
export default AbstractEditController.extend({
  cancelAction: 'closeModal',
  editController: Ember.inject.controller('incident/edit'),
  newNote: false,

  title: function() {
    let i18n = this.get('i18n');
    let isNew = this.get('model.isNew');
    if (isNew) {
      return i18n.t('incident.titles.addNote');
    }
    return i18n.t('incident.titles.editNote');
  }.property('model.isNew'),

  updateCapability: 'manage_incidents',

  beforeUpdate() {
    this.set('newNote', this.get('model.isNew'));
    return Ember.RSVP.Promise.resolve();
  },

  afterUpdate(note) {
    if (this.get('newNote')) {
      this.get('editController').send('addNote', note);
    } else {
      this.send('closeModal');
    }
  }
});

import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
export default AbstractEditController.extend({
  cancelAction: 'closeModal',
  editController: Ember.inject.controller('incident/edit'),
  newFeedback: false,

  title: function() {
    let i18n = this.get('i18n');
    var isNew = this.get('model.isNew');
    if (isNew) {
      return i18n.t('incident.titles.addFeedback');
    }
    return i18n.t('incident.titles.editFeedback');
  }.property('model.isNew'),

  updateCapability: 'add_feedback',

  beforeUpdate: function() {
    if (this.get('model.isNew')) {
      this.set('newFeedback', true);
    }
    return Ember.RSVP.Promise.resolve();
  },

  afterUpdate: function(feedback) {
    if (this.get('newFeedback')) {
      this.get('editController').send('addFeedback', feedback);
    } else {
      this.send('closeModal');
    }
  }
});

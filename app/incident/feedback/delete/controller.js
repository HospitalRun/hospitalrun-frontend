import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyFeedbackDelete',
  editController: Ember.inject.controller('incident/edit'),
  title: t('incident.titles.delete_feedback'),

  actions: {
    notifyFeedbackDelete: function() {
      this.get('model').destroyRecord().then(function() {
        this.send('closeModal');
      }.bind(this));
      this.get('editController').send('deleteFeedback', this.get('model'));
    }
  }
});
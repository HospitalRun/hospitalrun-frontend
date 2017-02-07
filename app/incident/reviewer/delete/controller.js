import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyReviewerDelete',
  editController: Ember.inject.controller('incident/edit'),

  title: t('incident.titles.deleteReviewer'),

  actions: {
    notifyReviewerDelete() {
      this.get('editController').send('deleteReviewer', this.get('model'));
      this.send('closeModal');
    }
  }
});

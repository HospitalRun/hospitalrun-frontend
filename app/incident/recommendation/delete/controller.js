import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
import { tranlsationMacro as t } from 'ember-i18n';
export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyRecommendationDelete',
  editController: Ember.inject.controller('incident/edit'),

  title: t('incident.titles.deleteRecommendation'),

  actions: {
    notifyRecommendationDelete() {
      this.get('editController').send('deleteRecommendation', this.get('model'));
      this.send('closeModal');
    }
  }
});

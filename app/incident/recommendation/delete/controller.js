import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
import { tranlsationMacro as t } from 'ember-i18n';
export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyRecommendationDelete',
  editController: Ember.inject.controller('incident/edit'),
  title: t('incident.titles.delete_recommendation'),

  actions: {
    notifyRecommendationDelete: function() {
      this.get('model').destroyRecord().then(function() {
        this.send('closeModal');
      }.bind(this));
      this.get('editController').send('deleteRecommendation', this.get('model'));
    }
  }
});
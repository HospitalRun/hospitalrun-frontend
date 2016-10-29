import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';

export default AbstractEditController.extend({
  cancelAction: 'closeModal',

  editController: Ember.inject.controller('incident/edit'),

  newRecommendation: false,

  recommendationStatusTypes: [
     'In-progress',
     'Completed'
  ].map(SelectValues.selectValuesMap),

  title: function() {
    var isNew = this.get('model.isNew');
    let i18n = this.get('i18n');
    if (isNew) {
      return i18n.t('incident.titles.addRecommendation');
    }
    return i18n.t('incident.titles.editRecommendation');
  }.property('model.isNew'),

  updateCapability: 'add_recommendation',

  beforeUpdate: function() {
    if (this.get('model.isNew')) {
      this.set('newRecommendation', true);
    }
    return Ember.RSVP.Promise.resolve();
  },

  afterUpdate: function(recommendation) {
    if (this.get('newRecommendation')) {
      this.get('editController').send('addRecommendation', recommendation);
    } else {
      this.send('closeModal');
    }
  }
});

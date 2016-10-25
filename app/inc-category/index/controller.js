import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import Ember from 'ember';
export default AbstractPagedController.extend({
  startKey: [],

  canDeleteIncidentCategory: Ember.computed(function() {
    return this.currentUserCan('delete_incident_category');
  }),

  actions: {

    showDeleteIncidentCategory: function(category) {
      this.send('openModal', 'inc-category.delete', category);
    }
  }
});

import { computed } from '@ember/object';
import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
export default AbstractPagedController.extend({
  startKey: [],

  canDeleteIncidentCategory: computed(function() {
    return this.currentUserCan('delete_incident_category');
  }),

  actions: {
    showDeleteIncidentCategory(category) {
      this.send('openModal', 'inc-category.delete', category);
    }
  }
});

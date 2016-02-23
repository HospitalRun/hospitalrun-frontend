import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
export default AbstractPagedController.extend({
  startKey: [],

  actions: {

    showDeleteIncidentCategory: function(category) {
      this.send('openModal', 'admin.inc-category.delete', category);
    }
  }
});

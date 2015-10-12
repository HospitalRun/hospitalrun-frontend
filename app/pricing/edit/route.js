import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
  editTitle: 'Edit Pricing Item',
  modelName: 'pricing',
  newTitle: 'New Pricing Item',

  actions: {
    deleteOverride: function(overrideToDelete) {
      this.controller.send('deleteOverride', overrideToDelete);
    }
  }
});

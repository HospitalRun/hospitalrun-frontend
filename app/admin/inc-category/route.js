import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
  modelName: 'inc-category',
  pageTitle: 'Incident Categories',

  newButtonAction: function() {
    return 'newItem';
  }.property(),
  newButtonText: '+ new category',

  actions: {
    newItem: function() {
        this.transitionTo('admin.inc-category.edit', 'new');
      },

    editItem: function(category) {
      this.transitionTo('admin.inc-category.edit', category);
    }
  }
});

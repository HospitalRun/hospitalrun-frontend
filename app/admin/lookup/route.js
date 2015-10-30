import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
  hideNewButton: true,
  pageTitle: 'Lookup Lists',
  model: function() {
    return this.store.find('lookup');
  },

  afterModel: function(model) {
    model.set('lookupType', 'anesthesia_types');
  },

  actions: {
    refreshLookupLists: function() {
      this.refresh();
    }
  }
});

import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-i18n';
export default AbstractIndexRoute.extend({
  hideNewButton: true,
  pageTitle: t('admin.lookup.pageTitle'),
  model: function() {
    return this.store.findAll('lookup');
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

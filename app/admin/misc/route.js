import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';

import { translationMacro as t } from 'ember-i18n';
export default AbstractIndexRoute.extend({
  pageTitle: t('admin.misc.page_title'),
  hideNewButton: true,

  model: function() {
    const store = this.get('store');
    store.findAll('text-expansion');
    return store.findAll('text-expansion').then(result => {
      return result.filter(model => {
        const isNew = model.get('isNew');
        console.log(`${model.get('from')} ${isNew}`);
        return !isNew;
      });
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.createExpansion();
  },

  actions: {
    addExpansion: function(newExpansion) {
      newExpansion.save()
        .then(() => {
          this.refresh();
        })
        .catch(() => {
          this.refresh();
        });
    },

    deleteExpansion: function(expansion) {
      expansion.deleteRecord();
      expansion.save()
        .then(() => {
          this.refresh();
        })
        .catch(() => {
          this.refresh();
        });
    }
  }
});

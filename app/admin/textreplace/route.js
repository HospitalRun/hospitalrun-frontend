import { computed } from '@ember/object';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-intl';

export default AbstractIndexRoute.extend({
  pageTitle: computed('intl.locale', () => {
    return t('admin.textReplacements.pageTitle');
  }),
  hideNewButton: true,

  model() {
    let store = this.get('store');
    return store.findAll('text-expansion').then((result) => {
      return result.filter((model) => {
        let isNew = model.get('isNew');
        return !isNew;
      });
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.createExpansion();
  },

  actions: {
    addExpansion(newExpansion) {
      newExpansion.save()
        .then(() => {
          this.refresh();
        })
        .catch(() => {
          this.refresh();
        });
    },

    deleteExpansion(expansion) {
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

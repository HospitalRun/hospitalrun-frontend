import { computed } from '@ember/object';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { t } from 'hospitalrun/macro';

export default AbstractIndexRoute.extend({
  hideNewButton: true,
  pageTitle: computed('intl.locale', () => {
    return t('admin.lookup.pageTitle');
  }),
  model() {
    return this.store.findAll('lookup').catch((error) => this.send('error', error));
  },

  actions: {
    deleteValue(value) {
      this.controller.send('deleteValue', value);
    }
  }
});

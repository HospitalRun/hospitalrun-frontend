import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';

import Ember from 'ember';
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
  }
});

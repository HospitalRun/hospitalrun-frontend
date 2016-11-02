import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractEditRoute.extend({
  hideNewButton: true,
  editTitle: t('admin.customForms.titles.customForms'),
  newTitle: Ember.computed.alias('editTitle'),
  model() {
    let store = this.get('store');
    return store.findAll('custom-form');
  }
});

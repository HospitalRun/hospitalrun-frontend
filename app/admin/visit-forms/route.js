import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractEditRoute.extend({
  hideNewButton: true,
  editTitle: t('admin.visitForms.titles.visitForms'),
  newTitle: Ember.computed.alias('editTitle'),
  model() {
    let store = this.get('store');
    let promiseHash = {
      visitFormsOption: store.find('option', 'visit_forms'),
      visitTypes: store.find('lookup', 'visit_types')
    };
    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.RSVP.hashSettled(promiseHash).then((results) => {
        let model = Ember.Object.create();
        if (results.visitTypes.state === 'fulfilled') {
          model.set('visitTypesList', results.visitTypes.value);
        }
        if (results.visitFormsOption.state === 'fulfilled') {
          model.set('visitForms', results.visitFormsOption.value);
        } else {
          model.set('visitForms', {});
        }
        resolve(model);
      }, reject);
    });
  }
});

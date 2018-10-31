import EmberObject from '@ember/object';
import {
  Promise as EmberPromise,
  hashSettled
} from 'rsvp';
import { alias } from '@ember/object/computed';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import { translationMacro as t } from 'ember-intl';
export default AbstractEditRoute.extend({
  hideNewButton: true,
  editTitle: t('admin.visitForms.titles.visitForms'),
  newTitle: alias('editTitle'),
  model() {
    let store = this.get('store');
    let promiseHash = {
      visitFormsOption: store.find('option', 'visit_forms'),
      visitTypes: store.find('lookup', 'visit_types')
    };
    return new EmberPromise((resolve, reject) => {
      hashSettled(promiseHash).then((results) => {
        let model = EmberObject.create();
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

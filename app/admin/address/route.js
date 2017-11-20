import { computed } from '@ember/object';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import { task } from 'ember-concurrency';
import { translationMacro as t } from 'ember-i18n';
import UnauthorizedError from 'hospitalrun/utils/unauthorized-error';

export default AbstractEditRoute.extend({
  hideNewButton: true,
  newTitle: t('admin.address.newTitle'),
  editTitle: t('admin.address.editTitle'),

  model() {
    return this.get('fetchAddressOptions').perform();
  },

  fetchAddressOptions: task(function* () {
    let store = this.get('store');
    try {
      return yield store.find('option', 'address_options');
    } catch(err) {
      if (err instanceof UnauthorizedError) {
        throw err;
      }
      return store.push(this.get('defaultAddressOption'));
    }
  }).keepLatest().cancelOn('deactivate'),

  defaultAddressOption: computed(function() {
    return this.get('store').normalize('option', {
      id: 'address_options',
      value: {
        address1Label: this.get('i18n').t('admin.address.addressLabel'),
        address1Include: true
      }
    });
  })
});

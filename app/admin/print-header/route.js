import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
import UnauthorizedError from 'hospitalrun/utils/unauthorized-error';

export default AbstractEditRoute.extend({
  hideNewButton: true,
  newTitle: t('admin.header.newTitle'),
  editTitle: t('admin.header.editTitle'),
  model() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('store').find('option', 'print_header').then((headerOptions) => {
        resolve(headerOptions);
      }, (err) => {
        if (err instanceof UnauthorizedError) {
          reject(err);
        } else {
          let store = this.get('store');
          let newConfig = store.push(store.normalize('option', {
            id: 'print_header',
            value: {
              facilityName: this.get('i18n').t('admin.header.facilityName'),
              headerLine1: this.get('i18n').t('admin.header.headerLine1')
            }
          }));
          resolve(newConfig);
        }
      });
    });
  }
});

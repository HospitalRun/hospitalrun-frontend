import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractEditRoute.extend({
  hideNewButton: true,
  newTitle: t('admin.address.new_title'),
  editTitle: t('admin.address.edit_title'),
  model: function() {
    return new Ember.RSVP.Promise(function(resolve) {
      this.get('store').find('option', 'address_options').then(function(addressOptions) {
        resolve(addressOptions);
      }, function() {
        var store = this.get('store');
        var newConfig = store.push(store.normalize('option', {
          id: 'address_options',
          value: {
            address1Label: this.get('i18n').t('admin.address.address_label'),
            address1Include: true
          }
        }));
        resolve(newConfig);
      }.bind(this));
    }.bind(this));
  }
});

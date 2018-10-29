import { isEmpty } from '@ember/utils';
import { Promise as EmberPromise } from 'rsvp';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';

export default AbstractEditController.extend({
  cancelAction: 'closeModal',
  newCharge: false,
  newPricingItem: false,
  requestingController: controller('procedures/edit'),
  database: service(),
  pricingList: alias('requestingController.pricingList'),
  selectedItem: null,
  updateCapability: 'add_charge',

  title: computed('model.isNew', function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('procedures.titles.addChargeItem');
    }
    return this.get('i18n').t('procedures.titles.editChargeItem');
  }),

  beforeUpdate() {
    this.set('newCharge', this.get('model.isNew'));
    return new EmberPromise((resolve, reject) => {
      let model = this.get('model');
      let pricingItem = model.get('pricingItem');
      let selectedItem = this.get('selectedItem');
      if (!isEmpty(selectedItem) && (isEmpty(pricingItem) || selectedItem.id !== pricingItem.get('id'))) {
        this.store.find('pricing', selectedItem.id).then((item) => {
          model.set('pricingItem', item);
          resolve();
        });
      } else {
        let newItem = false;
        let saveItem = false;
        if (isEmpty(pricingItem)) {
          pricingItem = this.store.createRecord('pricing', {
            name: model.get('itemName'),
            category: model.get('pricingCategory')
          });
          newItem = true;
          saveItem = true;
        } else {
          if (pricingItem.get('name') !== model.get('itemName')) {
            pricingItem.set('name', model.get('itemName'));
            saveItem = true;
          }
        }
        if (saveItem) {
          pricingItem.save().then(() => {
            let pricingList = this.get('pricingList');
            if (newItem) {
              pricingList.addObject({
                id: pricingItem.get('id'),
                name: pricingItem.get('name')
              });
              model.set('pricingItem', pricingItem);
            } else {
              let itemToUpdate = pricingList.findBy('id', pricingItem.get('id'));
              itemToUpdate.name = pricingItem.get('name');
            }
            resolve();
          }, reject);
        } else {
          resolve();
        }
      }
    });
  },

  afterUpdate(record) {
    if (this.get('newCharge') === true) {
      this.get('requestingController').send('addCharge', record);
    } else {
      this.send('closeModal');
    }
  }
});

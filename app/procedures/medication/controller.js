import { Promise as EmberPromise } from 'rsvp';
import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';

export default AbstractEditController.extend({
  cancelAction: 'closeModal',
  newCharge: false,
  requestingController: controller('procedures/edit'),
  medicationList: alias('requestingController.medicationList'),

  updateCapability: 'add_charge',

  title: computed('model.isNew', function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('intl').t('procedures.titles.addMedicationUsed');
    }
    return this.get('intl').t('procedures.titles.editMedicationUsed');
  }),

  beforeUpdate() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      this.set('newCharge', true);
      let model = this.get('model');
      let inventoryItem = model.get('inventoryItem');
      model.set('medication', inventoryItem);
      model.set('medicationTitle', inventoryItem.get('name'));
      model.set('priceOfMedication', inventoryItem.get('price'));
    }
    return EmberPromise.resolve();
  },

  afterUpdate(record) {
    if (this.get('newCharge')) {
      this.get('requestingController').send('addCharge', record);
    } else {
      this.send('closeModal');
    }
  }
});

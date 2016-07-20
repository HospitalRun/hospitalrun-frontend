import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';

export default AbstractEditController.extend({
  cancelAction: 'closeModal',
  newCharge: false,
  newPricingItem: false,
  requestingController: Ember.inject.controller('procedures/edit'),
  database: Ember.inject.service(),
  pricingList: Ember.computed.alias('requestingController.pricingList'),
  selectedItem: null,
  updateCapability: 'add_charge',

  itemChanged: function() {
    var model = this.get('model'),
      selectedItem = this.get('selectedItem');
    if (!Ember.isEmpty(selectedItem)) {
      this.store.find('pricing', selectedItem.id).then(function(item) {
        model.set('pricingItem', item);
      }.bind(this));
    }
  }.observes('selectedItem'),

  pricingItemChanged: function() {
    var model = this.get('model'),
      itemName = model.get('itemName'),
      pricingItem = model.get('pricingItem');
    if (!Ember.isEmpty(pricingItem)) {
      this.set('newPricingItem', false);
      if (pricingItem.get('name') !== itemName) {
        model.set('itemName', pricingItem.get('name'));
      }
    } else {
      this.set('newPricingItem', true);
    }
  }.observes('model.pricingItem'),

  title: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('procedures.titles.addChargeItem');
    }
    return this.get('i18n').t('procedures.titles.edit_charge_item');
  }.property('model.isNew'),

  beforeUpdate: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      this.set('newCharge', true);
    }
    if (this.get('newPricingItem')) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        var model = this.get('model'),
          newPricing = this.store.createRecord('pricing', {
            name: model.get('itemName'),
            category: model.get('pricingCategory')
          });
        newPricing.save().then(function() {
          this.get('pricingList').addObject({
            id: newPricing.get('id'),
            name: newPricing.get('name')
          });
          model.set('pricingItem', newPricing);
          resolve();
        }.bind(this), reject);
      }.bind(this));
    } else {
      return Ember.RSVP.Promise.resolve();
    }
  },

  afterUpdate: function(record) {
    if (this.get('newCharge')) {
      this.get('requestingController').send('addCharge', record);
    } else {
      this.send('closeModal');
    }
  }
});

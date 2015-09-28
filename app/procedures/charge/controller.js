import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';

export default AbstractEditController.extend({
    needs: ['procedures/edit'],
    cancelAction: 'closeModal',
    newPricingItem: false,
    requestingController: Ember.computed.alias('controllers.procedures/edit'),
    pouchdb: Ember.inject.service(),
    pricingList: Ember.computed.alias('controllers.procedures/edit.pricingList'),
    
    updateCapability: 'add_charge',

    itemChanged: function() {
        var selectedItem = this.get('selectedItem');
        if (!Ember.isEmpty(selectedItem)) {
            var pricingId = this.get('pouchdb').getEmberId(selectedItem._id);
            this.store.find('pricing', pricingId).then(function(item) {
                this.set('pricingItem', item);
            }.bind(this));
        }
    }.observes('selectedItem'),
    
    pricingItemChanged: function() {
        var itemName = this.get('itemName'),
            pricingItem = this.get('pricingItem');
        if (!Ember.isEmpty(pricingItem)) {
            this.set('newPricingItem', false);
            if (pricingItem.get('name') !== itemName) {
                this.set('itemName', pricingItem.get('name'));
            }
        } else {
            this.set('newPricingItem', true);
        }
    }.observes('pricingItem'),
    
    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Charge Item';
        }
        return 'Edit Charge Item';
	}.property('isNew'),    
    
    beforeUpdate: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            this.set('newCharge', true);         
        }
        if (this.get('newPricingItem')) {
            return new Ember.RSVP.Promise(function(resolve, reject) {                
                var newPricing = this.store.createRecord('pricing', {
                    name: this.get('itemName'),
                    category: this.get('pricingCategory')
                });
                newPricing.save().then(function() {
                    this.get('pricingList').addObject({
                        _id: 'pricing_'+ newPricing.get('id'),
                        name: newPricing.get('name')
                    });
                    this.set('pricingItem', newPricing);
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

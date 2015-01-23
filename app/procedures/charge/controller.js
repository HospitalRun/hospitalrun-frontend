import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import InventorySelection from 'hospitalrun/mixins/inventory-selection';
import Ember from "ember";

export default AbstractEditController.extend(InventorySelection, {
    needs: ['procedures/edit'],
    cancelAction: 'closeModal',
    newPricingItem: false,
    procedureController: Ember.computed.alias('controllers.procedures/edit'),
    pricingList: Ember.computed.alias('controllers.procedures/edit.pricingList'),
    
    updateCapability: 'add_procedure',

    itemChanged: function() {
        var selectedItem = this.get('selectedItem');
        if (!Ember.isEmpty(selectedItem)) {
            selectedItem.id = selectedItem._id.substr(10);
            this.store.find('pricing', selectedItem._id.substr(10)).then(function(item) {
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
                    category: 'Procedure Charges'
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
            this.get('procedureController').send('addCharge', record);
        } else {
            this.send('closeModal');
        }        
    }
});

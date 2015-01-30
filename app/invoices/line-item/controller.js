import Ember from 'ember';
export default Ember.ObjectController.extend({
    showDetails: false,
    
    canAddCharge: function() {
        return this.parentController.get('canAddCharge');
    }.property(),
    
    _validNumber: function(number) {
        
        return (!Ember.isEmpty(number) && !isNaN(number) && number > 0);
    },
    
    _calculateItemTotals: function() {
        var details = this.get('details'),
            priceTotal = 0;
        if (!Ember.isEmpty(details)) {
            details.forEach(function(detail) {
                if (this._validNumber(detail.price) && this._validNumber(detail.quantity)) {
                    priceTotal += (detail.price * detail.quantity);
                }
            }.bind(this));
            this.set('total', priceTotal);
        }
    },
    
    detailQuantityChanged: function() {
        this._calculateItemTotals();
    }.observes('details.@each.quantity'),
    
    detailPriceChanged: function() {
        this._calculateItemTotals();
    }.observes('details.@each.price'),    
    
    actions: {
        addCharge: function() {
            var details = this.get('details');
            details.addObject({});
        },
        
        deleteCharge: function(deleteInfo) {
            var details = this.get('details');
            details.removeObject(deleteInfo.itemToDelete);
            this.send('update', true);
            this.send('closeModal');
        },        
        
        showDeleteItem: function(item) {             
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteCharge',
                deleteFrom: this.get('details'),
                title: 'Delete Charge',
                message: 'Are you sure you want to delete %@?'.fmt(item.name),
                itemToDelete: item,
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));
        },        
        
        showDeleteLineItem: function(item) {             
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteLineItem',
                title: 'Delete Line Item',
                message: 'Are you sure you want to delete %@?'.fmt(item.name),
                itemToDelete: item,                
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));
        }, 
        toggleDetails: function() {
            this.toggleProperty('showDetails');
        }
    },
});
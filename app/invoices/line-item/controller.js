import Ember from 'ember';
import NumberFormat from "hospitalrun/mixins/number-format";
export default Ember.ObjectController.extend(NumberFormat, {
    canAddCharge: function() {
        return this.parentController.get('canAddCharge');
    }.property(),
    
    _calculateItemTotals: function() {
        var details = this.get('details'),
            discountTotal = 0,
            priceTotal = 0;
        if (!Ember.isEmpty(details)) {
            details.forEach(function(detail) {
                if (this._validNumber(detail.price) && this._validNumber(detail.quantity)) {
                    Ember.set(detail, 'total', this._numberFormat((detail.price * detail.quantity), true));
                    priceTotal += detail.total;
                    if (this._validNumber(detail.discount)) {
                        discountTotal += Number(detail.discount);
                        Ember.set(detail, 'total', this._numberFormat((detail.total - detail.discount), true));
                    }                    
                }
            }.bind(this));
            this.set('total', this._numberFormat(priceTotal, true));
            this.set('discount', this._numberFormat(discountTotal, true));
        }
    },
    
    detailDiscountChanged: function() {
        this._calculateItemTotals();
    }.observes('details.@each.discount'),  
    
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
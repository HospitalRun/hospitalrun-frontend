import Ember from 'ember';
import NumberFormat from "hospitalrun/mixins/number-format";
export default Ember.ObjectController.extend(NumberFormat, {
    canAddCharge: function() {
        return this.parentController.get('canAddCharge');
    }.property(),
    
    actions: {
        addCharge: function() {
            var details = this.get('details');
            var detail = this.store.createRecord('line-item-detail');
            details.addObject(detail);
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
import Ember from 'ember';
export default Ember.Mixin.create({
    chargeRoute: 'procedures.charge',
    
    actions: {
        addCharge: function(charge) {
            var charges = this.get('charges');
            charges.addObject(charge);
            this.send('update', true);
            this.send('closeModal');
        },
        
        deleteCharge: function(model) {
            var chargeToDelete = model.get('chargeToDelete'),
                charges = this.get('charges');
            charges.removeObject(chargeToDelete);
            chargeToDelete.destroyRecord();
            this.send('update', true);
            this.send('closeModal');
        },
        
        showAddCharge: function() {
            var newCharge = this.get('store').createRecord('proc-charge',{
                quantity: 1
            });
            this.send('openModal', this.get('chargeRoute'), newCharge);
        },
        
        showEditCharge: function(charge) {
            this.send('openModal', this.get('chargeRoute'), charge);            
        },
        
        showDeleteCharge: function(charge) {
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteCharge',
                title: 'Delete Charge Item',
                message: 'Are you sure you want to delete this charged item?',
                chargeToDelete: charge,
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));                 
        }
    },
});
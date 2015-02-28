import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';

export default AbstractEditController.extend({
    cancelAction: 'closeModal',
    
    paymentTypes: [
        'Cash',
        'Credit Card',
        'Check'
    ],
    title: function() {
        if (this.get('isNew')) {
            return 'Add Payment';
        } else {
            return 'Edit Payment';
        }
    }.property('isNew'),
    
        
    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('newPayment', true);
        } else {
            this.set('newPayment', false);
        }
        return Ember.RSVP.resolve();
    },

    afterUpdate: function() {
        this.get('model').save().then(function(record){
            if (this.get('newPayment')) {
                this.send('addPayment',record);
            } else {
                this.send('closeModal');
            }
        }.bind(this));
    }
});

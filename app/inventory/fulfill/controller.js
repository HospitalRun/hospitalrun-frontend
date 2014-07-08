export default Ember.ObjectController.extend({
    updateButtonText: 'Fulfill',
    updateButtonAction: 'fulfill',
    isUpdateDisabled: false,
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        fulfill: function() {
            this.set('status','Fulfilled');
            this.get('model').save().then(function() {
                this.send('closeModal');
            }.bind(this));                
        }
    }
});
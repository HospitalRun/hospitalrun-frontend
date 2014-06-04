export default Ember.ObjectController.extend({
    updateButtonText: 'Delete',
    updateButtonAction: 'delete',
    isUpdateDisabled: false,
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        delete: function() {            
            this.get('model').destroyRecord().then(function() {
                this.send('closeModal');
            }.bind(this));                
        }
    }
});

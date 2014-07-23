export default Ember.ObjectController.extend({
    afterDeleteAction: 'closeModal',
    updateButtonText: 'Delete',
    updateButtonAction: 'delete',
    isUpdateDisabled: false,
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        delete: function() {            
            this.get('model').destroyRecord().then(function() {
                this.send(this.get('afterDeleteAction'));
            }.bind(this));                
        }
    }
});

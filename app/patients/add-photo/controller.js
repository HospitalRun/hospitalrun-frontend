export default Ember.ObjectController.extend({
    title: 'Add Photo',
    updateButtonText: 'Add',
    updateButtonAction: 'add',
    showUpdateButton: true,
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        add: function() {
        }
    }
});

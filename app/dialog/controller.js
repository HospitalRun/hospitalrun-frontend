export default Ember.ObjectController.extend({
    showUpdateButton: true,
    isUpdateDisabled: false,

    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        confirm: function() {
            var confirmAction = this.getWithDefault('confirmAction', 'confirm');
            this.send(confirmAction, this.get('model'));
            this.send('closeModal');
        }, 
        
        ok: function() {
            this.send('closeModal');
        }
    }
});

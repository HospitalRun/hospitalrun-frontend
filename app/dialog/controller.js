export default Ember.ObjectController.extend({
    showUpdateButton: true,
    isUpdateDisabled: false,

    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        confirm: function() {
            this.send('confirm');
            this.send('closeModal');
        }, 
        
        ok: function() {
            this.send('closeModal');
        }
    }
});

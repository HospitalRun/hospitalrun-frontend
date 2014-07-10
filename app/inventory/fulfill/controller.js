export default Ember.ObjectController.extend({
    title: 'Fulfill Request',
    updateButtonText: 'Fulfill',
    updateButtonAction: 'fulfill',
    isUpdateDisabled: function() {
        var item = this.get('inventoryItem');
        return (this.get('quantity') > item.get('quantity'));
    }.property('inventoryItem'),
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        fulfill: function() {
            this.send('fulfillRequest', this.get('model'), 'closeModal');           
        }
    }
});
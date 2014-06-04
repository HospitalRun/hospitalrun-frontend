export default Ember.Controller.extend({
    inventoryTypes: [
        'Asset',
        'Medication',
        'Supply'
    ],

    actions: {
        submit: function() {
            var controller = this;
            this.get('model').save().then(function() {
                controller.send('closeModal');
                controller.transitionToRoute('inventory.search', {
                    searchText: controller.get('id')                    
                });
            });                
        }
    }
});

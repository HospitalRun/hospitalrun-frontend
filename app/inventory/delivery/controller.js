import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend({
    needs: 'inventory',
    
    inventoryList: Ember.computed.alias('controllers.inventory.model'),
    
    inventoryItemChanged: function() {
        Ember.run.once(this, function(){
            this.get('model').validate();
        });
    }.observes('inventoryItem'),
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            var sessionVars = this.get('session').store.restore();
            this.set('requestedBy', sessionVars.name);
            this.set('status', 'Fulfilled');
        }
    },
});

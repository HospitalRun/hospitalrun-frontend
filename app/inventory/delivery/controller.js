import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import GetUserName from "hospitalrun/mixins/get-user-name";

export default AbstractEditController.extend(GetUserName, {
    needs: 'inventory',
        
    inventoryItems: Ember.computed.alias('controllers.inventory.model'),
    
    inventoryList: Ember.computed.filter('inventoryItems', function(item) {
        return item.get('type') !== 'Asset';
    }),
    
    inventoryItemChanged: function() {
        Ember.run.once(this, function(){
            this.get('model').validate();
        });
    }.observes('inventoryItem'),
    
    actions: {
        update: function() {
            if (this.get('isNew')) {
                this.set('dateRequested', new Date());
                this.set('requestedBy', this.getUserName());
                this.send('fulfillRequest', this.get('model'));
            }
        }
    }
});
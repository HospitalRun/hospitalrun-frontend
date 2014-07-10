import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import GetUserName from "hospitalrun/mixins/get-user-name";

export default AbstractEditController.extend(GetUserName, {
    needs: 'inventory',
    
    inventoryList: Ember.computed.alias('controllers.inventory.model'),
    
    inventoryItemChanged: function() {
        Ember.run.once(this, function(){
            this.get('model').validate();
        });
    }.observes('inventoryItem'),
    
    afterUpdate: function() {      
        this.send('fulfillRequest', this.get('model'), 'showDelivered');
    },    
    
    beforeUpdate: function() {        
        this.set('dateRequested', new Date());
        this.set('requestedBy', this.getUserName());
    }
});
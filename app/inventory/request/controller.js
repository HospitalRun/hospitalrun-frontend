import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import GetUserName from "hospitalrun/mixins/get-user-name";

export default AbstractEditController.extend(GetUserName, {    
    needs: 'inventory',
   
    inventoryItems: Ember.computed.alias('controllers.inventory.model'),
    
    inventoryList: function() {
        var inventoryItems = this.get('inventoryItems');
        return inventoryItems.filter(function(item) {
            return item.get('type') !== 'Asset';
        });
    }.property('inventoryItems@each.lastModified'),

    afterUpdate: function() {
        this.transitionToRoute('inventory.index');
    }, 

    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('dateRequested', new Date());
            this.set('requestedBy', this.getUserName());
            this.set('status', 'Requested');
        }
        return Ember.RSVP.resolve();
    }
});
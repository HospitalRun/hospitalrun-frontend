import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractIndexRoute.extend(UserSession, {
    pouchdb: Ember.inject.service(),
    modelName: 'inventory',
    newButtonAction: function() {
        if (this.currentUserCan('add_inventory_item')) {
            return 'newItem';
        } else {
            return null;
        }
    }.property(),    
    newButtonText: '+ new item',
    pageTitle: 'Items',
    
    _modelQueryParams: function() {
        return {
            mapReduce: 'inventory_by_name'
        };
    },
    
    _getStartKeyFromItem: function(item) {
        var inventoryId = this.get('pouchdb').getPouchId(item.get('id'), 'inventory');
        return [item.get('name'),inventoryId];
    }
        
});
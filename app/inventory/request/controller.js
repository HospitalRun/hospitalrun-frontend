import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend({    
    needs: 'inventory',
    
    cancelAction: 'allRequests',
   
    warehouseList: Ember.computed.alias('controllers.inventory.warehouseList'),
    aisleLocationList: Ember.computed.alias('controllers.inventory.aisleLocationList'),

    expenseAccountList: Ember.computed.alias('controllers.inventory.expenseAccountList'),
   
    inventoryItems: Ember.computed.alias('controllers.inventory.model'),
    
    inventoryList: function() {
        var inventoryItems = this.get('inventoryItems');
        return inventoryItems.filter(function(item) {
            return item.get('type') !== 'Asset';
        });
    }.property('inventoryItems@each.lastModified'),
    
    inventoryItemChanged: function() {
        Ember.run.once(this, function(){
            this.get('model').validate();
        });
    }.observes('inventoryItem'),
    
    lookupListsToUpdate: [{
        name: 'expenseAccountList', //Name of property containing lookup list
        property: 'expenseAccount', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'expense_account_list' //Id of the lookup list to update
     },{
        name: 'aisleLocationList', //Name of property containing lookup list
        property: 'deliveryAisle', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'aisle_location_list' //Id of the lookup list to update
    }, {
        name: 'warehouseList', //Name of property containing lookup list
        property: 'deliveryLocation', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'warehouse_list' //Id of the lookup list to update
    }],
    
    canFulfill: function() {
        return this.currentUserCan('fulfill_inventory');
    }.property(),

    isFulfilling: function() {
        var canFulfill = this.get('canFulfill'),
            isRequested = this.get('isRequested'),
            fulfillRequest = this.get('shouldFulfillRequest');
        return (canFulfill && (isRequested || fulfillRequest));
    }.property('isRequested', 'shouldFulfillRequest'),

    isRequested: function() {
        var status = this.get('status');
        return (status === 'Requested');
    }.property('status'),
    
    updateViaFulfillRequest: false,
    
    updateDateCompleted: function() {
        var isFulfilling = this.get('isFulfilling'),
            dateCompleted = this.get('dateCompleted');
        if (isFulfilling) {
            if (Ember.isEmpty(dateCompleted)) {
                this.set('dateCompleted', new Date());
            }
        } else if (!this.get('updateViaFulfillRequest')) {
            this.set('dateCompleted');
        }
    }.observes('isFulfilling'),

    updateButtonText: function() {
        if (this.get('isFulfilling')) {
            return 'Fulfill';
        } else if (this.get('isNew')) {
            return 'Add';
        } else {
            return 'Update';
        }
    }.property('isNew', 'isFulfilling'),
    
    updateCapability: 'add_inventory_request',
    
    actions: {
        allRequests: function() {
            this.transitionToRoute('inventory.index');
        },
        
        /**
         * Update the model and perform the before update and after update
         * @param skipAfterUpdate boolean (optional) indicating whether or not 
         * to skip the afterUpdate call.
         */
        update: function(skipAfterUpdate) {
            this.beforeUpdate().then(function() {
                var updateViaFulfillRequest = this.get('updateViaFulfillRequest');
                if (updateViaFulfillRequest) {
                    this.updateLookupLists();
                    this.send('fulfillRequest', this.get('model'));
                } else {
                    this.get('model').save().then(function(record){
                        this.updateLookupLists();
                        if (!skipAfterUpdate) {
                            this.afterUpdate(record);
                        }

                    }.bind(this));
                }
            }.bind(this));
        }
    },
    
    afterUpdate: function() {        
        this.send('allRequests');
    }, 

    beforeUpdate: function() {
        if (this.get('isFulfilling')) {
            this.set('updateViaFulfillRequest', true);
        } else {
            this.set('updateViaFulfillRequest', false);
        }
        if (this.get('isNew')) {
            this.set('dateRequested', new Date());
            this.set('requestedBy', this.get('model').getUserName());
            if (!this.get('isFulfilling')) {
                this.set('status', 'Requested');
            }
        }
        return Ember.RSVP.resolve();        
    }
});
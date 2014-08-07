import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import InventoryLocations from "hospitalrun/mixins/inventory-locations";
export default AbstractModuleRoute.extend(InventoryLocations, {
    additionalModels: [{ 
        name: 'aisleLocationList',
        findArgs: ['lookup','aisle_location_list']
    }, {
        name: 'deliveryLocationList',
        findArgs: ['lookup','delivery_location_list']
    }, {
        name: 'expenseAccountList',
        findArgs: ['lookup','expense_account_list']
    }, {
        name: 'warehouseList',
        findArgs: ['lookup','warehouse_list']
    }
  ],
    
    currentItem: null,
    modelName: 'inventory',
    moduleName: 'inventory',
    newButtonAction: 'newDelivery',
    newButtonText: '+ new delivery',
    subActions: [{
        text: 'Requests',
        linkTo: 'inventory.index'
    }, {
        text: 'Items',
        linkTo: 'inventory.listing'
    }, {
        text: 'History',
        linkTo: 'inventory.completed'
    }],
    sectionTitle: 'Inventory',
    
    actions: {
        addPurchase: function(newPurchase) {
            var currentItem = this.get('currentItem'),
                purchases = currentItem.get('purchases');
            purchases.addObject(newPurchase);
            this.newPurchaseAdded(currentItem, newPurchase); 
            currentItem.updateQuantity();
            currentItem.save();
            this.send('closeModal');
        },
        
        allItems: function() {
            this.transitionTo('inventory.listing');
        },
                
        fulfillRequest: function(request, closeModal, increment, skipTransition) {
            request.fulfillRequest(increment).then(function() {
                var inventoryItem = request.get('inventoryItem'),
                    promises = [],
                    requestPurchases = request.get('purchases');
                requestPurchases.forEach(function(purchase) {
                    promises.push(purchase.save());
                });
                promises.push(inventoryItem.get('content').save());
                promises.push(request.save());
                Ember.RSVP.all(promises,'All saving done for inventory fulfillment').then(function(){
                    if (closeModal) {
                        this.send('closeModal');
                    }
                    if (!skipTransition) {
                        this.transitionTo('inventory.completed');
                    }
                }.bind(this));
            }.bind(this));
        },

        newDelivery: function() {
            var item = this.get('store').createRecord('inv-request', {
                dateCompleted: new Date(),
                transactionType: 'Delivery'
            });            
            this.transitionTo('inventory.delivery', item);
        },
        
        showAddPurchase: function(inventoryItem) {
            var newPurchase = this.get('store').createRecord('inv-purchase', {
                distributionUnit: inventoryItem.get('distributionUnit')
            });            
            this.set('currentItem', inventoryItem);
            this.send('openModal', 'inventory.purchase.edit', newPurchase);
        }        

    },
    
    /**
     * Calculate a new id based on time stamp and randomized number
     * @return a generated id in base 36 so that its a shorter barcode.
     */
    generateId: function() {
        var min = 1,
            max = 999,
            part1 = new Date().getTime(),
            part2 = Math.floor(Math.random() * (max - min + 1)) + min;
        return part1.toString(36) +'_' + part2.toString(36);
    },
    
    /**
     * Define what data a new inventory item should be instantiated with.  
     * The only default is to set the type to asset; at some point this may be driven by subsection of inventory you are in.
     * @return the default properties for a new inventory item.
     */    
    getNewData: function() {
        return  {
            type: 'Asset'
        };
    },

});
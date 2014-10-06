import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import FulfillRequest from "hospitalrun/mixins/fulfill-request";
import InventoryId from "hospitalrun/mixins/inventory-id";
import InventoryLocations from "hospitalrun/mixins/inventory-locations"; //inventory-locations mixin is needed for fulfill-request mixin!
export default AbstractModuleRoute.extend(FulfillRequest, InventoryId, InventoryLocations, {
    addCapability: 'add_inventory_item',
    additionalModels: [{ 
        name: 'aisleLocationList',
        findArgs: ['lookup','aisle_location_list']
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
    
    newButtonText: '+ new request',
    subActions: [{
        text: 'Requests',
        linkTo: 'inventory.index'
    }, {
        text: 'Items',
        linkTo: 'inventory.listing'
    }, {
        text: 'History',
        linkTo: 'inventory.completed'
    }, {
        text: 'Reports',
        linkTo: 'inventory.reports'
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
        
        newRequest: function() {
            var newId = this.generateId();
            var data = this.getNewData();
            if (newId) {
                data.id = newId;
            }
            var item = this.get('store').createRecord('inv-request', {
                transactionType: 'Request'
            });            
            this.transitionTo('inventory.request', item);
        },    
        
        allItems: function() {
            this.transitionTo('inventory.listing');
        },
        
        showAddPurchase: function(inventoryItem) {
            var newPurchase = this.get('store').createRecord('inv-purchase', {
                dateReceived: new Date(),
                distributionUnit: inventoryItem.get('distributionUnit')
            });            
            this.set('currentItem', inventoryItem);
            this.send('openModal', 'inventory.purchase.edit', newPurchase);
        }        

    },
    

    
    /**
     * Define what data a new inventory item should be instantiated with.  
     * The only default is to set the type to asset; at some point this may be driven by subsection of inventory you are in.
     * @return the default properties for a new inventory item.
     */    
    getNewData: function() {
        return  {
            type: 'Asset',
            dateReceived: new Date()
        };
    }
});
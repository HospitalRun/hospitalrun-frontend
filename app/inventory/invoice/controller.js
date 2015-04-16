import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations';
import InventorySelection from 'hospitalrun/mixins/inventory-selection';
import Ember from 'ember';

export default AbstractEditController.extend(InventoryLocations, InventorySelection, {    
    needs: ['inventory','pouchdb'],
   
    warehouseList: Ember.computed.alias('controllers.inventory.warehouseList'),
    aisleLocationList: Ember.computed.alias('controllers.inventory.aisleLocationList'),
    purchaseAttributes: [
        'expirationDate',
        'inventoryItem',
        'purchaseCost',
        'quantity',
        'vendorItemNo'
    ],
    
    inventoryList: function() {
        var inventoryItems = this.get('inventoryItems');
        if (!Ember.isEmpty(inventoryItems)) {
            var mappedItems = inventoryItems.map(function(item) {
                return item.doc;
            });
            return mappedItems;
        }
    }.property('inventoryItems.[]'),
    
    lookupListsToUpdate: [{
        name: 'aisleLocationList', //Name of property containing lookup list
        property: 'deliveryAisle', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'aisle_location_list' //Id of the lookup list to update
    }, {
        name: 'warehouseList', //Name of property containing lookup list
        property: 'deliveryLocation', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'warehouse_list' //Id of the lookup list to update
    }],
    
    
    showInvoiceItems: function() {
        var invoiceItems = this.get('invoiceItems');
        return !Ember.isEmpty(invoiceItems);
    }.property('invoiceItems.@each'),
        
    updateButtonText: 'Save',
    
    updateCapability: 'add_inventory_item',
    
    _addNewInventoryItem: function() {        
        var inventoryItem = this.store.createRecord('inventory', {
            name: this.get('inventoryItemTypeAhead'),
            quantity: this.get('quantity')
        });
        this.send('openModal', 'inventory.quick-add', inventoryItem);        
    },
    
    _addInvoiceItem: function() {
        var invoiceItems = this.get('invoiceItems'),
            itemProperties = this.getProperties(this.get('purchaseAttributes')),            
            invoiceItem = Ember.Object.create(itemProperties);
        invoiceItems.addObject(invoiceItem);
        this.set('expirationDate');
        this.set('inventoryItem');
        this.set('inventoryItemTypeAhead');
        this.set('purchaseCost');
        this.set('quantity');
        this.set('selectedInventoryItem');
        this.set('vendorItemNo');
    },
    
    _savePurchases: function() {
        var purchaseDefaults = this.getProperties([
            'dateReceived',
            'vendor',
            'invoiceNo',
            'location',
            'aisleLocation',
            'giftInKind']),
            invoiceItems = this.get('invoiceItems'),
            inventoryPurchase,
            savePromises = [];
        invoiceItems.forEach(function(invoiceItem) {
            var inventoryItem = invoiceItem.get('inventoryItem'),
                purchases = inventoryItem.get('purchases');
            inventoryPurchase = this.store.createRecord('inv-purchase', purchaseDefaults);
            inventoryPurchase.setProperties(invoiceItem.getProperties(this.get('purchaseAttributes')));
            inventoryPurchase.set('inventoryItem', 'inventory_'+inventoryItem.get('id'));
            inventoryPurchase.save().then(function() {
                purchases.addObject(inventoryPurchase);
                this.newPurchaseAdded(inventoryItem, inventoryPurchase); 
                inventoryItem.updateQuantity();
                savePromises.push(inventoryItem.save());
            }.bind(this));
        }.bind(this));
        Ember.RSVP.all(savePromises).then(function() {
            this.displayAlert('Inventory Purchases Saved', 'The inventory purchases have been successfully saved', 'allItems');
        }.bind(this));
    },
    
    actions: {
        addInventoryItem: function() {
            var model = this.get('model'),                
                inventoryItemTypeAhead = this.get('inventoryItemTypeAhead'),
                purchaseCost = this.get('purchaseCost'),
                quantity = this.get('quantity');
            model.validate();
            if (this.get('isValid') && !Ember.isEmpty(inventoryItemTypeAhead) && !Ember.isEmpty(quantity) && !Ember.isEmpty(purchaseCost)) {
                if (Ember.isEmpty(this.get('selectedInventoryItem'))) {
                    this._addNewInventoryItem();
                    return true;
                } else {                
                    this._addInvoiceItem();
                }
            }
        },
        
        addedNewInventoryItem: function(inventoryItem) {
            this.set('inventoryItem', inventoryItem);
            this._addInvoiceItem();
            this.send('closeModal');
            if (this.get('doingUpdate')) {
                this._savePurchases();
            }
        },        
        
        removeItem: function(removeInfo) {
            var invoiceItems = this.get('invoiceItems'),
                item = removeInfo.itemToRemove;
            invoiceItems.removeObject(item);
            this.send('closeModal');
        },        
        
        showRemoveItem: function(item) {
           var message= 'Are you sure you want to remove this item from this invoice?',
                model = Ember.Object.create({
                    itemToRemove: item               
                }),
                title = 'Remove Item';
            this.displayConfirm(title, message, 'removeItem', model);            
        },
        
        /**
         * Update the model
         */
        update: function() {
            this.set('doingUpdate');
            var addingNewInventory = this._addInventoryItem();
            if (!addingNewInventory) {
                this._savePurchases();
            }
        }
    }
});
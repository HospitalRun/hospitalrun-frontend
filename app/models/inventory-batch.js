import AbstractModel from "hospitalrun/models/abstract";
import Ember from "ember";

/**
 * Model to represent a request for inventory items.
 */ 
export default AbstractModel.extend({
    
    haveInvoiceItems: function() {
        var invoiceItems = this.get('invoiceItems');
        return (Ember.isEmpty(invoiceItems));
    },
    
    validations: {        
        dateReceived: {
            presence: true
        },
        inventoryItemTypeAhead: {
            presence: {
                if: function(object) {
                    return object.haveInvoiceItems();
                }
            }
        },
        purchaseCost: {
            numericality: {
                greaterThan: 0,
                if: function(object) {
                    return object.haveInvoiceItems();
                }
            }            
        },
        quantity: {
            numericality: {
                greaterThan: 0,
                if: function(object) {
                    return object.haveInvoiceItems();
                }
            }            
        },
        vendor: {
            presence: true
        }
    }
});
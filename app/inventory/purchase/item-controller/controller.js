import Ember from "ember";
export default Ember.ObjectController.extend({
    /**
     * Purchase can only be deleted if no items have been consumed from the purchase.
     */
    canDelete: function() {
        var canDeletePurchase = this.parentController.get('canDeletePurchase');
        if (!canDeletePurchase) {
            return false;
        }
        var currentQuantity = this.get('currentQuantity'),
            originalQuantity = this.get('originalQuantity');
        if (currentQuantity === originalQuantity) {
            return true;
        } else {
            return false;
        }
    }.property('originalQuantity', 'currentQuantity'),
    
    canEdit: function() {
        return this.parentController.get('canAddPurchase');
    }.property(),
    
    rowClass: function() {
        var expired = this.get('expired');
        if (expired) {
            return 'warning';
        } else {
            return '';
        }
    }.property('expired')
});
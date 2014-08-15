export default Ember.ObjectController.extend({
    /**
     * Purchase can only be deleted if no items have been consumed from the purchase.
     */
    canDelete: function() {
        var currentQuantity = this.get('currentQuantity'),
            originalQuantity = this.get('originalQuantity');
        if (currentQuantity === originalQuantity) {
            return true;
        } else {
            return false;
        }
    }.property('originalQuantity', 'currentQuantity'),
    
    rowClass: function() {
        var expired = this.get('expired');
        if (expired) {
            return 'warning';
        } else {
            return '';
        }
    }.property('expired')
});

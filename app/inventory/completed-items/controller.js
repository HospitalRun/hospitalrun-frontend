import LocationName from "hospitalrun/mixins/location-name";
export default Ember.ObjectController.extend(LocationName, {
    deliveryDetails: function() {
        var  aisle = this.get('deliveryAisle'), 
             location = this.get('deliveryLocation'),
             locationName = this.formatLocationName(location, aisle);
        return locationName;
    }.property('deliveryAisle', 'deliveryLocation'),
    
    haveReason: function() {
        return !Ember.isEmpty(this.get('reason'));
    }.property('reason'),

    isAdjustment: function() {
        var transactionType = this.get('transactionType');
        return transactionType === 'Adjustment (Add)' || 
            transactionType === 'Adjustment (Remove)' ||
            transactionType === 'Write Off';
    }.property('transactionType'),
    
    isFulfillment: function() {
        return this.get('transactionType') === 'Fulfillment';
    }.property('transactionType'),
    
    isTransfer: function() {
        return this.get('transactionType') === 'Transfer';
    }.property('transactionType'),
    
});
import AdjustmentTypes from 'hospitalrun/mixins/inventory-adjustment-types';
import Ember from 'ember';
export default Ember.ObjectController.extend(AdjustmentTypes, {
    deliveryDetails: function() {
        var locationName = this.get('deliveryLocationName'),
            patient = this.get('patient');
        if (Ember.isEmpty(patient)) {    
            return locationName;
        } else {
            return patient.get('displayName');
        }
    }.property('deliveryAisle', 'deliveryLocation','patient'),
    
    haveReason: function() {
        return !Ember.isEmpty(this.get('reason'));
    }.property('reason'),

    isAdjustment: function() {
        var adjustmentTypes = this.get('adjustmentTypes'),
            transactionType = this.get('transactionType'),
            adjustmentType = adjustmentTypes.findBy('type', transactionType);            
        return !Ember.isEmpty(adjustmentType);
    }.property('transactionType'),
    
    isFulfillment: function() {
        return this.get('transactionType') === 'Fulfillment';
    }.property('transactionType'),
    
    isTransfer: function() {
        return this.get('transactionType') === 'Transfer';
    }.property('transactionType'),
    
});
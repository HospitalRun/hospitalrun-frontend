import Ember from 'ember';
export default Ember.ObjectController.extend({
    canAddCharge: Ember.computed.alias('parentController.canAddCharge'),    
    firstPricingType: Ember.computed.alias('parentController.pricingTypeList.firstObject'),
    pricingList: Ember.computed.alias('parentController.pricingList'),
    
    pricingListByType: function() {
        var parentController = this.get('parentController'),
            pricingList = this.get('pricingList'),
            pricingType = this.get('model');
        if (!Ember.isEmpty(pricingList)) {
            pricingList = pricingList.filterBy('type', pricingType);
            pricingList = pricingList.map(function(pricingItem) {
                var chargesForItem = parentController.findChargeForPricingItem(pricingItem);
                if (chargesForItem) {
                    parentController.set(pricingItem._id, chargesForItem.get('quantity'));
                }
                return pricingItem;
            }.bind(this));
        }
        return pricingList;
    }.property('model','pricingList'),
    
    activeClass: function() {
        var firstPricingType = this.get('firstPricingType'),
            pricingType = this.get('model');
        if (pricingType === firstPricingType) {
            return 'active';
        }        
    }.property(),
    
    tabId: function() {
        return this.get('model').toLowerCase().dasherize();
    }.property('model'),

    tabHref: function() {
        var tabId = this.get('tabId');
        return '#'+tabId;
    }.property('tabId')
});
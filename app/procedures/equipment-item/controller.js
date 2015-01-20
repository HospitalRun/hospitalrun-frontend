import Ember from "ember";
export default Ember.ObjectController.extend({
    canDelete: function() {
        var canDeletePurchase = this.parentController.get('canAddProcedure');        
            return canDeletePurchase;
    }.property()    
});
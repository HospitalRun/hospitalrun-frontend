import Ember from "ember";
export default Ember.ObjectController.extend({
    canDelete: function() {
        return this.parentController.get('canDeleteItem');
    }.property(),
    
    canEdit: function() {
        return this.parentController.get('canAddItem');
    }.property(),
    
    showAdd: function() {
        var canAddPurchase = this.parentController.get('canAddPurchase');
        return canAddPurchase && (this.get('type') !== 'Asset');
    }.property('type')
});
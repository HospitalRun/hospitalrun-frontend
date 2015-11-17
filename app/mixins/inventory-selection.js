import Ember from "ember";
export default Ember.Mixin.create({
    /**
     * For use with the inventory-type ahead.  When an inventory item is selected, resolve the selected
     * inventory item into an actual model object and set is as inventoryItem.
     */ 
    inventoryItemChanged: function() {
        var selectedInventoryItem = this.get('selectedInventoryItem');
        if (!Ember.isEmpty(selectedInventoryItem)) {
            selectedInventoryItem.id = selectedInventoryItem._id.substr(10);
            this.store.find('inventory', selectedInventoryItem._id.substr(10)).then(function(item) {
                item.reload().then(function() {
                    this.set('inventoryItem', item);
                    Ember.run.once(this, function(){
                        this.get('model').validate();
                    });
                }.bind(this), function(err) {
                    console.log("ERROR reloading inventory item", err);
                });
            }.bind(this));
        }
    }.observes('selectedInventoryItem'),
});
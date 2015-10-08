import Ember from 'ember';
export default Ember.Mixin.create({
  selectedInventoryItem: null,

  /**
   * For use with the inventory-type ahead.  When an inventory item is selected, resolve the selected
   * inventory item into an actual model object and set is as inventoryItem.
   */
  inventoryItemChanged: function () {
    var selectedInventoryItem = this.get('selectedInventoryItem');
    if (!Ember.isEmpty(selectedInventoryItem)) {
      this.store.find('inventory', selectedInventoryItem.id).then(function (inventoryItem) {
        var model = this.get('model');
        model.set('inventoryItem', inventoryItem);
        Ember.run.once(this, function () {
          model.validate();
        });
      }.bind(this));
    }
  }.observes('selectedInventoryItem'),
});

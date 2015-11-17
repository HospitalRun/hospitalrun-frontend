import Ember from "ember";
export default Ember.Mixin.create({
    defaultInventoryTypes: [        
        'Medication',
        'Supply'
    ],
    
    inventoryTypes: function() {
        var defaultInventoryTypes = this.get('defaultInventoryTypes'),
            inventoryTypeList = this.get('inventoryTypeList');
        if (Ember.isEmpty(inventoryTypeList)) {
            return defaultInventoryTypes;
        } else {
            return inventoryTypeList;
        }
    }.property('inventoryTypeList', 'defaultInventoryTypes')
});
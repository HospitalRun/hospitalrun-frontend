import IsUpdateDisabled from "hospitalrun/mixins/is-update-disabled";
export default Ember.ObjectController.extend(IsUpdateDisabled, {
    needs: 'inventory',
    
    warehouseList: Ember.computed.alias('controllers.inventory.warehouseList'),
    aisleLocationList: Ember.computed.alias('controllers.inventory.aisleLocationList'),
    
    title: 'Transfer Items',
    updateButtonText: 'Transfer',
    updateButtonAction: 'transfer',
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        transfer: function() {
            this.send('transferItems', this.get('model'), true);           
        }
    }
});
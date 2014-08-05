import IsUpdateDisabled from "hospitalrun/mixins/is-update-disabled";
export default Ember.ObjectController.extend(IsUpdateDisabled, {
    needs: 'inventory',
    
    warehouseList: Ember.computed.alias('controllers.inventory.warehouseList'),
    aisleLocationList: Ember.computed.alias('controllers.inventory.aisleLocationList'),
    
    title: 'Transfer Items',
    updateButtonText: 'Transfer',
    updateButtonAction: 'transfer',
    
    fromLocation: function() {
        var aisleLocation =  this.get('aisleLocation'),
            location = this.get('location'),
            fromLocation = '';
        if (!Ember.isEmpty(location)) {
            fromLocation += location;
            if (!Ember.isEmpty(aisleLocation)) {
                fromLocation += " : ";
            }
        }
        if (!Ember.isEmpty(aisleLocation)) {
            fromLocation += aisleLocation;
        }        
        return fromLocation;
    }.property('location', 'aisleLocation'),
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        transfer: function() {
            this.send('transferItems', this.get('model'), true);           
        }
    }
});
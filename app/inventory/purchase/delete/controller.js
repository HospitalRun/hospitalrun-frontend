import InventoryLocations from "hospitalrun/mixins/inventory-locations";
export default Ember.ObjectController.extend(InventoryLocations, {
    needs: 'inventory/edit',
    
    locations: Ember.computed.alias('controllers.inventory/edit.locations'),
    
    deleteLocation: Ember.computed.defaultTo('defaultLocation'),
    
    deleteLocations: Ember.computed.map('filteredLocations', function(location) {
        return {
            name: location.get('locationName'),
            location: location
        };
    }),
    
    defaultLocation: function() {
        var originalAisle = this.get('aisleLocation'),
            originalLocation = this.get('location'),
            locations = this.get('locations');        
        this.set('locationToFind', originalLocation);
        this.set('aisleToFind', originalAisle);
        var defaultLocation = locations.find(this.findLocation, this);
        return defaultLocation;
    }.property('locations'),
    
    filteredLocations: Ember.computed.filter('locations', function(location) {
        var currentQuantity = this.get('currentQuantity'),
            locationQuantity = location.get('quantity');
        return (locationQuantity >= currentQuantity);
    }),
    
    showLocations: function() {
        var locations = this.get('locations');
        return (locations.get('length') > 1);
    }.property('locations'),

    updateButtonText: function() {
        var expire = this.get('expire');
        if (!Ember.isEmpty(expire) && expire === true) {
            return 'Expire';
        } 
        return  'Delete';
    }.property('expire'),
    updateButtonAction: 'delete',
    isUpdateDisabled: false,
    title:  function() {
        var expire = this.get('expire');
        if (!Ember.isEmpty(expire) && expire === true) {
            return 'Expire';
        }
        return 'Delete Purchase';
    }.property('expire'),
    
    actions: {
        cancel: function() {
            this.set('expire');
            this.send('closeModal');
        },
        
        delete: function() {
            var expire = this.get('expire');
            if (!Ember.isEmpty(expire) && expire === true) {
                this.send('expirePurchase', this.get('model'));
            } else{
                this.send('deletePurchase', this.get('model'));
            }
        }
    }
});
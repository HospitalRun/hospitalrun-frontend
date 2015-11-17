import Ember from 'ember';
import LocationName from 'hospitalrun/mixins/location-name';
export default Ember.ObjectController.extend(LocationName, {
    canDelete: function() {
        return this.parentController.get('canDeleteItem');
    }.property(),
    
    canEdit: function() {
        return this.parentController.get('canAddItem');
    }.property(),
    
    displayLocations: function() {
        var locations = this.get('availableLocations'),
            returnLocations = [];
        locations.forEach(function(currentLocation) {
            var aisleLocationName = currentLocation.get('aisleLocation'),
                locationName = currentLocation.get('location'),
                displayLocationName = this.formatLocationName(locationName, aisleLocationName);
            if (!Ember.isEmpty(displayLocationName)) {
                returnLocations.push(displayLocationName);
            }
        }.bind(this));
        return returnLocations.toString();
    }.property('availableLocations'),
    
    showAdd: function() {
        var canAddPurchase = this.parentController.get('canAddPurchase');
        return canAddPurchase;
    }.property('type')
});
import Ember from "ember";
export default Ember.Mixin.create({
    formatLocationName: function(location, aisleLocation) {
        var locationName = '';
        if (!Ember.isEmpty(location)) {
            locationName += location;
            if (!Ember.isEmpty(aisleLocation)) {
                locationName += " : ";
            }
        }
        if (!Ember.isEmpty(aisleLocation)) {
            locationName += aisleLocation;
        }
        return locationName;
    },
    
    locationName: function() {
        var aisleLocation =  this.get('aisleLocation'),
            location = this.get('location'),
            locationName = this.formatLocationName(location, aisleLocation);
        if (Ember.isEmpty(locationName)) {
            locationName = 'No Location';
        }
        return locationName;
    }.property('location', 'aisleLocation'),
});
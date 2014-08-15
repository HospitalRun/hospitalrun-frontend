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
    }
});
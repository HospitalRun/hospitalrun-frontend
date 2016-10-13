import Ember from 'ember';
export default Ember.Mixin.create({
  getDisplayLocationName: function(location, aisleLocation) {
    let locationName = this.formatLocationName(location, aisleLocation);
    if (Ember.isEmpty(locationName)) {
      locationName = 'No Location';
    }
    return locationName;
  },

  formatLocationName: function(location, aisleLocation) {
    let locationName = '';
    if (!Ember.isEmpty(location)) {
      locationName += location;
      if (!Ember.isEmpty(aisleLocation)) {
        locationName += ' : ';
      }
    }
    if (!Ember.isEmpty(aisleLocation)) {
      locationName += aisleLocation;
    }
    return locationName;
  },

  locationName: function() {
    let aisleLocation = this.get('aisleLocation');
    let location = this.get('location');
    return this.getDisplayLocationName(location, aisleLocation);
  }.property('location', 'aisleLocation')
});

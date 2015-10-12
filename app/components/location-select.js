import Ember from 'ember';
export default Ember.Component.extend({
  locationPicker: null,

  _setup: function() {
    this.locationChange = this.currentLocationChanged.bind(this);
  }.on('init'),

  currentLocationChanged: function(newLocation) {
    this.get('locationPicker').set('selectedLocation', newLocation);
    Ember.run.once(this, function() {
      this.get('parentView').locationChange();
    });
  }

});

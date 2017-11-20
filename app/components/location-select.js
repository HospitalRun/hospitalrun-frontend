import { once } from '@ember/runloop';
import Component from '@ember/component';
export default Component.extend({
  locationPicker: null,

  _setup: function() {
    this.locationChange = this.currentLocationChanged.bind(this);
  }.on('init'),

  currentLocationChanged(newLocation) {
    this.get('locationPicker').set('selectedLocation', newLocation);
    once(this, function() {
      this.get('parentView').locationChange();
    });
  }

});

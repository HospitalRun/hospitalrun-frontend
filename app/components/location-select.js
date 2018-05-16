<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Component.extend({
  locationPicker: null,

  _setup: function() {
    this.locationChange = this.currentLocationChanged.bind(this);
  }.on('init'),

  currentLocationChanged(newLocation) {
    this.get('locationPicker').set('selectedLocation', newLocation);
    Ember.run.once(this, function() {
      this.get('parentView').locationChange();
    });
  }

});
=======
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea

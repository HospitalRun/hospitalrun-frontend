import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Component.extend({
  calculatedLocationPickers: null,
  doingSetup: false,
  label: null,
  locationList: null,
  quantityRequested: null,

  locationChange: function() {
    let doingSetup = this.get('doingSetup');
    let locationList = this.get('locationList');
    let locationPickers = this.get('calculatedLocationPickers');
    let quantityRequested = this.get('quantityRequested');
    let quantitySatisfiedIdx = -1;
    let selectedLocations = [];
    if (!doingSetup) {
      locationPickers.reduce(function(previousValue, item, index) {
        let selectedLocation = item.get('selectedLocation');
        let returnValue;
        if (Ember.isEmpty(selectedLocation)) {
          returnValue = previousValue;
        } else {
          returnValue = (previousValue + selectedLocation.get('quantity'));
        }
        if (quantitySatisfiedIdx === -1 && returnValue >= quantityRequested) {
          quantitySatisfiedIdx = index;
        }
        return returnValue;
      }, 0);
      if (quantitySatisfiedIdx > -1) {
        if (locationPickers.get('length') > (quantitySatisfiedIdx + 1)) {
          locationPickers = locationPickers.slice(0, quantitySatisfiedIdx + 1);
          this.set('calculatedLocationPickers', locationPickers);
        }
      } else {
        locationPickers.addObject(Ember.Object.create());
      }
      this._setupLocationPickers(locationPickers, locationList);
    }
    locationPickers.forEach(function(locationPicker) {
      selectedLocations.addObject(locationPicker.get('selectedLocation'));
    });
    this.set('componentSelectedLocations', selectedLocations);
  },

  _setup: function() {
    Ember.Binding.from('selectedLocations').to('componentSelectedLocations').connect(this);
  }.on('init'),

  _setupLocationPickers: function(locationPickers, locationList, setInitialLocation) {
    locationPickers.reduce(function(previousValue, item) {
      let selectedLocation = item.get('selectedLocation');
      item.set('subLocationList', previousValue.map(SelectValues.selectObjectMap));
      if (!previousValue.includes(selectedLocation) || setInitialLocation) {
        item.set('selectedLocation', previousValue.get('firstObject'));
      }
      item.set('label', 'And');
      return previousValue.filter(function(location) {
        return (item.get('selectedLocation.id') !== location.get('id'));
      });
    }, locationList);
    let firstPicker = locationPickers.get('firstObject');
    if (!Ember.isEmpty(firstPicker)) {
      firstPicker.set('label', this.get('label'));
    }
    this.set('calculatedLocationPickers', locationPickers);
  },

  locationPickers: function() {
    let locationList = this.get('locationList');
    let locationPickers = [];
    let quantityRequested = this.get('quantityRequested');
    if (Ember.isEmpty(locationList) || Ember.isEmpty(quantityRequested)) {
      // We need both a locationList and a quantityRequested
      return;
    }
    this.set('doingSetup', true);
    locationList.reduce(function(previousValue, location) {
      if (previousValue < quantityRequested) {
        locationPickers.addObject(Ember.Object.create());
      }
      return (previousValue + location.get('quantity'));
    }, 0);
    this._setupLocationPickers(locationPickers, locationList, true);
    this.locationChange();
    this.set('doingSetup', false);
    return this.get('calculatedLocationPickers');
  }.property('calculatedLocationPickers', 'locationList', 'quantityRequested')
});

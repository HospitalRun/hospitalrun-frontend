import Ember from 'ember';
export default Ember.Component.extend({
  doingSetup: false,
  label: null,
  locationPickers: null,
  locationList: null,
  quantityRequested: null,

  locationChange: function () {
    var doingSetup = this.get('doingSetup'),
      locationList = this.get('locationList'),
      locationPickers = this.get('locationPickers'),
      quantityRequested = this.get('quantityRequested'),
      quantitySatisfiedIdx = -1,
      selectedLocations = [];
    if (!doingSetup) {
      locationPickers.reduce(function (previousValue, item, index) {
        var selectedLocation = item.get('selectedLocation'),
          returnValue;
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
          this.set('locationPickers', locationPickers);
        }
      } else {
        locationPickers.addObject(Ember.Object.create());
      }
      this._setupLocationPickers(locationPickers, locationList);
    }
    locationPickers.forEach(function (locationPicker) {
      selectedLocations.addObject(locationPicker.get('selectedLocation'));
    });
    this.set('componentSelectedLocations', selectedLocations);
  },

  _setup: function () {
    Ember.Binding.from('selectedLocations').to('componentSelectedLocations').connect(this);
    var locationList = this.get('locationList'),
      locationPickers = [],
      quantityRequested = this.get('quantityRequested');
    if (Ember.isEmpty(locationList) || Ember.isEmpty(quantityRequested)) {
      // We need both a locationList and a quantityRequested
      return;
    }
    this.set('doingSetup', true);
    locationList.reduce(function (previousValue, location) {
      if (previousValue < quantityRequested) {
        locationPickers.addObject(Ember.Object.create());
      }
      return (previousValue + location.get('quantity'));
    }, 0);
    this._setupLocationPickers(locationPickers, locationList, true);
    this.set('locationPickers', locationPickers);
    this.locationChange();
    this.set('doingSetup', false);
  }.on('init'),

  _setupLocationPickers: function (locationPickers, locationList, setInitialLocation) {
    locationPickers.reduce(function (previousValue, item) {
      var selectedLocation = item.get('selectedLocation');
      item.set('subLocationList', previousValue);
      if (!previousValue.contains(selectedLocation) || setInitialLocation) {
        item.set('selectedLocation', previousValue.get('firstObject'));
      }
      item.set('label', 'And');
      return previousValue.filter(function (location) {
        return (item.get('selectedLocation.id') !== location.get('id'));
      });
    }, locationList);
    var firstPicker = locationPickers.get('firstObject');
    if (!Ember.isEmpty(firstPicker)) {
      firstPicker.set('label', this.get('label'));
    }
  },

  calculatedLocationPickers: function () {
    this._setup();
    var locationPickers = this.get('locationPickers');
    return locationPickers;
  }.property('locationList', 'quantityRequested')
});

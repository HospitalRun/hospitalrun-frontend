import Ember from 'ember';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations';
export default Ember.ObjectController.extend(InventoryLocations, {
  needs: 'inventory/edit',

  locations: Ember.computed.alias('controllers.inventory/edit.locations'),

  deleteLocations: Ember.computed.map('filteredLocations', function (location) {
    return {
      name: '%@ (%@ available)'.fmt(location.get('locationName'), location.get('quantity')),
      location: location
    };
  }),

  locationChanged: function () {
    var originalAisle = this.get('aisleLocation'),
      originalLocation = this.get('location'),
      locations = this.get('locations');
    this.set('locationToFind', originalLocation);
    this.set('aisleToFind', originalAisle);
    var defaultLocation = locations.find(this.findLocation, this);
    this.set('deleteFromLocation', defaultLocation);
  }.observes('aisleLocation', 'location'),

  filteredLocations: function () {
    var currentQuantity = this.get('currentQuantity'),
      locations = this.get('locations');
    return locations.filter(function (location) {
      var locationQuantity = location.get('quantity');
      return (locationQuantity >= currentQuantity);
    });
  }.property('locations', 'currentQuantity'),

  showLocations: function () {
    var locations = this.get('locations');
    return (locations.get('length') > 0);
  }.property('locations'),

  updateButtonText: function () {
    var expire = this.get('expire');
    if (!Ember.isEmpty(expire) && expire === true) {
      return 'Expire';
    }
    return 'Delete';
  }.property('expire'),
  updateButtonAction: 'delete',
  isUpdateDisabled: false,
  showUpdateButton: true,
  title: function () {
    var expire = this.get('expire');
    if (!Ember.isEmpty(expire) && expire === true) {
      return 'Expire';
    }
    return 'Delete Purchase';
  }.property('expire'),

  actions: {
    cancel: function () {
      this.set('expire');
      this.send('closeModal');
    },

    delete: function () {
      var deleteFromLocation = this.get('deleteFromLocation'),
        expire = this.get('expire');
      if (!Ember.isEmpty(expire) && expire === true) {
        this.send('expirePurchase', this.get('model'), deleteFromLocation);
      } else {
        this.send('deletePurchase', this.get('model'), deleteFromLocation);
      }
    }
  }
});

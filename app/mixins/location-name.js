import { isEmpty } from '@ember/utils';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  getDisplayLocationName(location, aisleLocation) {
    let locationName = this.formatLocationName(location, aisleLocation);
    if (isEmpty(locationName)) {
      locationName = 'No Location';
    }
    return locationName;
  },

  formatLocationName(location, aisleLocation) {
    let locationName = '';
    if (!isEmpty(location)) {
      locationName += location;
      if (!isEmpty(aisleLocation)) {
        locationName += ' : ';
      }
    }
    if (!isEmpty(aisleLocation)) {
      locationName += aisleLocation;
    }
    return locationName;
  },

  locationName: computed('location', 'aisleLocation', function() {
    let aisleLocation = this.get('aisleLocation');
    let location = this.get('location');
    return this.getDisplayLocationName(location, aisleLocation);
  })
});

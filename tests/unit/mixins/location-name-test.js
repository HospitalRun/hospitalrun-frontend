import LocationName from 'hospitalrun/mixins/location-name';
import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import DS from 'ember-data';

moduleFor('mixin:location-name', 'Unit | Mixin | location-name', {
  subject(attrs) {
    let subject;
    Ember.run(() => {
      let Test = DS.Model.extend(LocationName);
      this.register('model:test', Test);
      subject = this.store().createRecord('test', attrs);
    });

    return subject;
  },
  store() {
    return this.container.lookup('service:store');
  }
});

test('getDisplayLocationName', function(assert) {
  let locationName = this.subject();

  assert.strictEqual(
    locationName.getDisplayLocationName('Location', 'Aisle'),
    'Location : Aisle',
    'Should include both'
  );
  assert.strictEqual(
    locationName.getDisplayLocationName('Location'),
    'Location',
    'Should only include location'
  );
  assert.strictEqual(
    locationName.getDisplayLocationName('', 'Aisle'),
    'Aisle',
    'Should only include aisle location'
  );
  assert.strictEqual(
    locationName.getDisplayLocationName('', ''),
    'No Location',
    'Should return default "No Location" message'
  );
});

test('locationName', function(assert) {
  let locationName = this.subject({
    location: 'Location',
    aisleLocation: 'Aisle'
  });

  assert.strictEqual(locationName.get('locationName'), 'Location : Aisle');
});

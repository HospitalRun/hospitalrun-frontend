import { run } from '@ember/runloop';
import LocationName from 'hospitalrun/mixins/location-name';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import DS from 'ember-data';

module('Unit | Mixin | location-name', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.subject = function(attrs) {
      let subject;
      run(() => {
        let Test = DS.Model.extend(LocationName);
        this.owner.register('model:test', Test);
        subject = this.store().createRecord('test', attrs);
      });

      return subject;
    };

    this.store = function() {
      return this.owner.lookup('service:store');
    };
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
});

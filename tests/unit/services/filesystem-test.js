<<<<<<< HEAD
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:filesystem', 'Unit | Service | filesystem', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
=======
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:filesystem', 'Unit | Service | filesystem', {
  needs: [
    'service:config'
  ]
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea

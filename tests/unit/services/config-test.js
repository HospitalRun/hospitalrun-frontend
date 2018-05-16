<<<<<<< HEAD
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:config', 'Unit | Service | config', {
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

moduleFor('service:config', 'Unit | Service | config', {
  needs: [
    'service:session',
    'service:languagePreference',
    'service:database'
  ]
});

test('getCurrentUser returns user from the session', function(assert) {
  let service = this.subject();

  let user = { name: 'name' };
  service.get('session').set('data', {
    authenticated: user
  });

  assert.equal(service.getCurrentUser(), user);
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea

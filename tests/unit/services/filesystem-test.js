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

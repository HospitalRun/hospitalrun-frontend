import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | config', function(hooks) {
  setupTest(hooks);

  test('getCurrentUser returns user from the session', function(assert) {
    let service = this.owner.lookup('service:config');

    let user = { name: 'name' };
    service.get('session').set('data', {
      authenticated: user
    });

    assert.equal(service.getCurrentUser(), user);
  });
});

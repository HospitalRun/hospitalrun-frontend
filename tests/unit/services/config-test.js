import { moduleFor, test } from 'ember-qunit';

moduleFor('service:config', 'Unit | Service | config', {
  needs: [
    'service:session'
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

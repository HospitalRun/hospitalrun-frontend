import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);

  test('displayRole', function(assert) {
    let user = run(() => this.owner.lookup('service:store').createRecord('user', {
      roles: ['first', 'second', 'third']
    }));

    assert.strictEqual(user.get('displayRole'), 'first');
  });

  test('displayRole no roles', function(assert) {
    let user = run(() => this.owner.lookup('service:store').createRecord('user', {
      roles: []
    }));

    assert.strictEqual(user.get('displayRole'), undefined);
  });
});

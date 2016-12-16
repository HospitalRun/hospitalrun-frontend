import { moduleForModel, test } from 'ember-qunit';

moduleForModel('user', 'Unit | Model | user', {
  needs: [
    'ember-validations@validator:local/format'
  ]
});

test('displayRole', function(assert) {
  let user = this.subject({
    roles: ['first', 'second', 'third']
  });

  assert.strictEqual(user.get('displayRole'), 'first');
});

test('displayRole no roles', function(assert) {
  let user = this.subject({
    roles: []
  });

  assert.strictEqual(user.get('displayRole'), undefined);
});

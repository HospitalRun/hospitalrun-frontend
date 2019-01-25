import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | payment', function(hooks) {
  setupTest(hooks);

  test('canRemovePayment', function(assert) {
    let payment = run(() => this.owner.lookup('service:store').createRecord('payment', {
      paymentType: 'Deposit'
    }));

    assert.strictEqual(payment.get('canRemovePayment'), true);
  });

  test('canRemovePayment false', function(assert) {
    let payment = run(() => this.owner.lookup('service:store').createRecord('payment', {
      paymentType: 'Test'
    }));

    assert.strictEqual(payment.get('canRemovePayment'), false);
  });
});

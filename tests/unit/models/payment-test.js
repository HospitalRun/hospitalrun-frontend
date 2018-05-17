import { moduleForModel, test } from 'ember-qunit';

moduleForModel('payment', 'Unit | Model | payment', {
  needs: [
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/presence',
    'model:invoice',
    'service:session'
  ]
});

test('canRemovePayment', function(assert) {
  let payment = this.subject({
    paymentType: 'Deposit'
  });

  assert.strictEqual(payment.get('canRemovePayment'), true);
});

test('canRemovePayment false', function(assert) {
  let payment = this.subject({
    paymentType: 'Test'
  });

  assert.strictEqual(payment.get('canRemovePayment'), false);
});

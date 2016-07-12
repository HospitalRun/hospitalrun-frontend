import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('visit', 'Unit | Model | visit', {
  // Specify the other units that are required for this test.
  needs: [
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/presence',
    'model:procedure',
    'model:imaging',
    'model:lab',
    'model:medication',
    'model:patient',
    'model:patient-note',
    'model:proc-charge',
    'model:vital',
    'model:visit',
    'service:validations'
  ]
});

test('paymentState', function(assert) {
  let model = this.subject();

  Ember.run(() => {
    model.setProperties({
      paymentState: 'bad value'
    });
  });
  assert.equal(model.get('paymentState'), 'bad value');
  assert.ok(model.errors.paymentState.length, 'there should errors');

  Ember.run(() => {
    model.setProperties({
      paymentState: 'clear'
    });
  });
  assert.equal(model.get('paymentState'), 'clear');
  assert.ok(!model.errors.paymentState.length, 'there should be no error');
});

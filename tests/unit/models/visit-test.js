import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | visit', function(hooks) {
  setupTest(hooks);

  test('paymentState', function(assert) {
    let model = run(() => this.owner.lookup('service:store').createRecord('visit'));

    run(() => {
      model.setProperties({
        paymentState: 'bad value'
      });
    });
    assert.equal(model.get('paymentState'), 'bad value');
    assert.ok(model.errors.paymentState.length, 'there should errors');

    run(() => {
      model.setProperties({
        paymentState: 'clear'
      });
    });
    assert.equal(model.get('paymentState'), 'clear');
    assert.ok(!model.errors.paymentState.length, 'there should be no error');
  });
});

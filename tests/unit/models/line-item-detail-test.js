import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | line-item-detail', function(hooks) {
  setupTest(hooks);

  test('amountOwed', function(assert) {
    let lineItemDetail = run(() => this.owner.lookup('service:store').createRecord('line-item-detail', {
      price: 123.45,
      quantity: 3
    }));
    assert.strictEqual(lineItemDetail.get('amountOwed'), 370.35);
  });

  test('amountOwed valid price string', function(assert) {
    let lineItemDetail = run(() => this.owner.lookup('service:store').createRecord('line-item-detail', {
      price: '22.50',
      quantity: 2
    }));
    assert.strictEqual(lineItemDetail.get('amountOwed'), 45);
  });

  test('amountOwed invalid quantity', function(assert) {
    let lineItemDetail = run(() => this.owner.lookup('service:store').createRecord('line-item-detail', {
      price: 123.50,
      quantity: -1
    }));
    assert.strictEqual(lineItemDetail.get('amountOwed'), 0);
  });

  test('amountOwed invalid price', function(assert) {
    let lineItemDetail = run(() => this.owner.lookup('service:store').createRecord('line-item-detail', {
      price: 'invalid',
      quantity: 2
    }));
    assert.strictEqual(lineItemDetail.get('amountOwed'), 0);
  });
});

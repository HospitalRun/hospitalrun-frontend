import { moduleForModel, test } from 'ember-qunit';

moduleForModel('line-item-detail', 'Unit | Model | line-item-detail', {
  needs: [
    'model:pricing'
  ]
});

test('amountOwed', function(assert) {
  let lineItemDetail = this.subject({
    price: 123.45,
    quantity: 3
  });
  assert.strictEqual(lineItemDetail.get('amountOwed'), 370.35);
});

test('amountOwed valid price string', function(assert) {
  let lineItemDetail = this.subject({
    price: '22.50',
    quantity: 2
  });
  assert.strictEqual(lineItemDetail.get('amountOwed'), 45);
});

test('amountOwed invalid quantity', function(assert) {
  let lineItemDetail = this.subject({
    price: 123.50,
    quantity: -1
  });
  assert.strictEqual(lineItemDetail.get('amountOwed'), 0);
});

test('amountOwed invalid price', function(assert) {
  let lineItemDetail = this.subject({
    price: 'invalid',
    quantity: 2
  });
  assert.strictEqual(lineItemDetail.get('amountOwed'), 0);
});

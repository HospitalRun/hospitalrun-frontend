import { moduleForModel, test } from 'ember-qunit';

import { testValidPropertyValues, testInvalidPropertyValues } from '../../helpers/validate-properties';

moduleForModel('inv-purchase', 'Unit | Model | inv-purchase', {
  needs: [
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/presence',
    'service:session'
  ]
});

test('costPerUnit', function(assert) {
  let inventoryPurchaseItem = this.subject({
    purchaseCost: 12.50,
    originalQuantity: 5
  });

  assert.strictEqual(inventoryPurchaseItem.get('costPerUnit'), 2.5);
});

test('costPerUnit properly round', function(assert) {
  let inventoryPurchaseItem = this.subject({
    purchaseCost: 71.11,
    originalQuantity: 2
  });

  assert.strictEqual(inventoryPurchaseItem.get('costPerUnit'), 35.56);
});

test('costPerUnit invalid input', function(assert) {
  let inventoryPurchaseItem = this.subject({
    purchaseCost: 0,
    originalQuantity: 5
  });

  assert.strictEqual(inventoryPurchaseItem.get('costPerUnit'), 0);
});

test('costPerUnit 0 input', function(assert) {
  let inventoryPurchaseItem = this.subject({
    purchaseCost: 12.50,
    originalQuantity: 0
  });

  assert.strictEqual(inventoryPurchaseItem.get('costPerUnit'), 0);
});

testValidPropertyValues('purchaseCost', [123, 123.0, '123']);
testInvalidPropertyValues('purchaseCost', ['test', undefined]);

testValidPropertyValues('originalQuantity', [0, 123, '0']);
testInvalidPropertyValues('originalQuantity', [-1, '-1', undefined]);

testValidPropertyValues('vendor', ['test']);
testInvalidPropertyValues('vendor', [undefined]);

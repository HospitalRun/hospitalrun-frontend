import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

import { run } from '@ember/runloop';

module('Unit | Model | inv-purchase', function(hooks) {
  setupTest(hooks);

  test('costPerUnit', function(assert) {
    let inventoryPurchaseItem = run(() => this.owner.lookup('service:store').createRecord('inv-purchase', {
      purchaseCost: 12.50,
      originalQuantity: 5
    }));

    assert.strictEqual(inventoryPurchaseItem.get('costPerUnit'), 2.5);
  });

  test('costPerUnit properly round', function(assert) {
    let inventoryPurchaseItem = run(() => this.owner.lookup('service:store').createRecord('inv-purchase', {
      purchaseCost: 71.11,
      originalQuantity: 2
    }));

    assert.strictEqual(inventoryPurchaseItem.get('costPerUnit'), 35.56);
  });

  test('costPerUnit invalid input', function(assert) {
    let inventoryPurchaseItem = run(() => this.owner.lookup('service:store').createRecord('inv-purchase', {
      purchaseCost: 0,
      originalQuantity: 5
    }));

    assert.strictEqual(inventoryPurchaseItem.get('costPerUnit'), 0);
  });

  test('costPerUnit 0 input', function(assert) {
    let inventoryPurchaseItem = run(() => this.owner.lookup('service:store').createRecord('inv-purchase', {
      purchaseCost: 12.50,
      originalQuantity: 0
    }));

    assert.strictEqual(inventoryPurchaseItem.get('costPerUnit'), 0);
  });

  testValidPropertyValues('purchaseCost', [123, 123.0, '123']);
  testInvalidPropertyValues('purchaseCost', ['test', undefined]);

  testValidPropertyValues('originalQuantity', [0, 123, '0']);
  testInvalidPropertyValues('originalQuantity', [-1, '-1', undefined]);

  testValidPropertyValues('vendor', ['test']);
  testInvalidPropertyValues('vendor', [undefined]);
});

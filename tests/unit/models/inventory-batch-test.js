import { moduleForModel, test } from 'ember-qunit';
import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleForModel('inventory-batch', 'Unit | Model | inventory-batch', {
  needs: [
    'ember-validations@validator:local/presence',
    'ember-validations@validator:local/numericality',
    'service:session'
  ]
});

test('haveInvoiceItems', function(assert) {
  let inventoryBatch = this.subject({
    invoiceItems: ['test have']
  });

  assert.strictEqual(inventoryBatch.haveInvoiceItems(), true);
});

test('haveInvoiceItems false', function(assert) {
  let inventoryBatch = this.subject();

  assert.strictEqual(inventoryBatch.haveInvoiceItems(), false);
});

testValidPropertyValues('dateReceived', ['test dr']);
testInvalidPropertyValues('dateReceived', [undefined]);

testValidPropertyValues('inventoryItemTypeAhead', ['test']);
testInvalidPropertyValues('inventoryItemTypeAhead', [undefined]);
// Test skip validation
testValidPropertyValues('inventoryItemTypeAhead', [undefined], function(subject) {
  subject.set('invoiceItems', ['item']);
});

testValidPropertyValues('quantity', [0.001, 1, '123']);
testInvalidPropertyValues('quantity', [-1, 0, '-1']);
// Test skip validation
testValidPropertyValues('quantity', [-1], function(subject) {
  subject.set('invoiceItems', ['item']);
});

testValidPropertyValues('purchaseCost', [0.001, 1, '123']);
testInvalidPropertyValues('purchaseCost', [-1, 0, '-1']);
// Test skip validation
testValidPropertyValues('purchaseCost', [-1], function(subject) {
  subject.set('invoiceItems', ['item']);
});

testValidPropertyValues('vendor', ['test']);
testInvalidPropertyValues('vendor', [undefined]);

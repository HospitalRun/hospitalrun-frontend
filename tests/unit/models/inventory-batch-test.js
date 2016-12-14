import { moduleForModel, test } from 'ember-qunit';

moduleForModel('inventory-batch', 'Unit | Model | inventory-batch', {
  needs: [
    'ember-validations@validator:local/presence',
    'ember-validations@validator:local/numericality'
  ]
});

test('haveInvoiceItems', function(assert) {
  let inventoryBatch = this.subject({
    invoiceItems: ['test']
  });

  assert.strictEqual(inventoryBatch.haveInvoiceItems(), false);
});

test('haveInvoiceItems false', function(assert) {
  let inventoryBatch = this.subject();

  assert.strictEqual(inventoryBatch.haveInvoiceItems(), true);
});

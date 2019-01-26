import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { getContext } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

module('Unit | Model | inventory-batch', function(hooks) {
  setupTest(hooks);
  hooks.beforeEach(function() {
    let { owner } = getContext();

    this.subject = () => run(() => owner
      .lookup('service:store')
      .createRecord('inventory-batch'));
  });

  test('haveInvoiceItems', function(assert) {
    let inventoryBatch = run(() => this.owner.lookup('service:store').createRecord('inventory-batch', {
      invoiceItems: ['test have']
    }));

    assert.strictEqual(inventoryBatch.haveInvoiceItems(), true);
  });

  test('haveInvoiceItems false', function(assert) {
    let inventoryBatch = run(() => this.owner.lookup('service:store').createRecord('inventory-batch'));

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
});

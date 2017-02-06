import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

import { testValidPropertyValues, testInvalidPropertyValues } from '../../helpers/validate-properties';

moduleForModel('inv-request', 'Unit | Model | inv-request', {
  needs: [
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/format',
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/presence',
    'model:allergy',
    'model:diagnosis',
    'model:inventory',
    'model:operation-report',
    'model:operative-plan',
    'model:patient',
    'model:payment',
    'model:price-profile',
    'model:visit'
  ]
});

test('deliveryLocationName', function(assert) {
  let inventoryRequest = this.subject({
    deliveryAisle: 'Test Aisle',
    deliveryLocation: 'Test Location'
  });

  assert.strictEqual(inventoryRequest.get('deliveryLocationName'), 'Test Location : Test Aisle');
});

test('deliveryDetails', function(assert) {
  let patient;
  Ember.run(() => {
    patient = this.store().createRecord('patient', {
      firstName: 'First'
    });
  });

  let inventoryRequest = this.subject({
    deliveryAisle: 'Test Aisle',
    deliveryLocation: 'Test Location',
    patient
  });

  assert.strictEqual(inventoryRequest.get('deliveryDetails'), 'First');
});

test('deliveryDetails without patient', function(assert) {
  let inventoryRequest = this.subject({
    deliveryAisle: 'Test Aisle',
    deliveryLocation: 'Test Location'
  });

  assert.strictEqual(inventoryRequest.get('deliveryDetails'), 'Test Location : Test Aisle');
});

test('haveReason', function(assert) {
  let inventoryRequest = this.subject({
    reason: true
  });

  assert.strictEqual(inventoryRequest.get('haveReason'), true);
});

test('haveReason false', function(assert) {
  assert.strictEqual(this.subject().get('haveReason'), false);
});

test('isAdjustment', function(assert) {
  let inventoryRequest = this.subject({
    transactionType: 'Return To Vendor'
  });

  assert.strictEqual(inventoryRequest.get('isAdjustment'), true);
});

test('isAdjustment false', function(assert) {
  let inventoryRequest = this.subject({
    transactionType: 'Fulfillment'
  });

  assert.strictEqual(inventoryRequest.get('isAdjustment'), false);
});

test('isFulfillment', function(assert) {
  let inventoryRequest = this.subject({
    transactionType: 'Fulfillment'
  });

  assert.strictEqual(inventoryRequest.get('isFulfillment'), true);
});

test('isTransfet', function(assert) {
  let inventoryRequest = this.subject({
    transactionType: 'Transfer'
  });

  assert.strictEqual(inventoryRequest.get('isTransfer'), true);
});

testValidPropertyValues('quantity', [0.5, 1, '123']);
testInvalidPropertyValues('quantity', [-1, -0.00001, undefined]);

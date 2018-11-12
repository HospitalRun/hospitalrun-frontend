import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { moduleForModel, test } from 'ember-qunit';
import tHelper from 'ember-intl/helpers/t';

import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

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
    'model:visit',
    'service:session',
    'config:environment',
    'service:intl',
    'ember-intl@adapter:default',
    'cldr:cn',
    'cldr:de',
    'cldr:en',
    'cldr:es',
    'cldr:gr',
    'cldr:hi',
    'cldr:pt',
    'cldr:th',
    'cldr:tw',
    'cldr:de',
    'cldr:es',
    'cldr:fr',
    'cldr:he',
    'cldr:it',
    'cldr:ru',
    'cldr:tr',
    'cldr:ur',
    'translation:en',
    'util:intl/missing-message'
  ],
  beforeEach() {
    // set the locale and the config
    this.container.lookup('service:intl').set('locale', 'en');
    getOwner(this).inject('model', 'intl', 'service:intl');

    // register t helper
    this.registry.register('helper:t', tHelper);
  }
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
  run(() => {
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

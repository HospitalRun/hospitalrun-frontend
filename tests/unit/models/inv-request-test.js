import { run } from '@ember/runloop';
import { getOwner } from '@ember/application';
import { moduleForModel, test } from 'ember-qunit';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';

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
    'service:i18n',
    'service:session',
    'locale:en/translations',
    'locale:en/config',
    'util:i18n/missing-message',
    'util:i18n/compile-template',
    'config:environment'
  ],
  beforeEach() {
    // set the locale and the config
    this.container.lookup('service:i18n').set('locale', 'en');
    this.registry.register('locale:en/config', localeConfig);

    getOwner(this).inject('model', 'i18n', 'service:i18n');

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

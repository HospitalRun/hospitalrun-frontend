import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

module('Unit | Model | inv-request', function(hooks) {
  setupTest(hooks);
  hooks.beforeEach(function() {
    this.subject = () => run(() => this.owner
      .lookup('service:store')
      .createRecord('inv-request'));
  });

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:intl').set('locale', 'en');
  });

  test('deliveryLocationName', function(assert) {
    let inventoryRequest = run(() => this.owner.lookup('service:store').createRecord('inv-request', {
      deliveryAisle: 'Test Aisle',
      deliveryLocation: 'Test Location'
    }));

    assert.strictEqual(inventoryRequest.get('deliveryLocationName'), 'Test Location : Test Aisle');
  });

  test('deliveryDetails', function(assert) {
    let patient;
    run(() => {
      patient = this.owner.lookup('service:store').createRecord('patient', {
        firstName: 'First'
      });
    });

    let inventoryRequest = run(() => this.owner.lookup('service:store').createRecord('inv-request', {
      deliveryAisle: 'Test Aisle',
      deliveryLocation: 'Test Location',
      patient
    }));

    assert.strictEqual(inventoryRequest.get('deliveryDetails'), 'First');
  });

  test('deliveryDetails without patient', function(assert) {
    let inventoryRequest = run(() => this.owner.lookup('service:store').createRecord('inv-request', {
      deliveryAisle: 'Test Aisle',
      deliveryLocation: 'Test Location'
    }));

    assert.strictEqual(inventoryRequest.get('deliveryDetails'), 'Test Location : Test Aisle');
  });

  test('haveReason', function(assert) {
    let inventoryRequest = run(() => this.owner.lookup('service:store').createRecord('inv-request', {
      reason: true
    }));

    assert.strictEqual(inventoryRequest.get('haveReason'), true);
  });

  test('haveReason false', function(assert) {
    assert.strictEqual(run(() => this.owner.lookup('service:store').createRecord('inv-request')).get('haveReason'), false);
  });

  test('isAdjustment', function(assert) {
    let inventoryRequest = run(() => this.owner.lookup('service:store').createRecord('inv-request', {
      transactionType: 'Return To Vendor'
    }));

    assert.strictEqual(inventoryRequest.get('isAdjustment'), true);
  });

  test('isAdjustment false', function(assert) {
    let inventoryRequest = run(() => this.owner.lookup('service:store').createRecord('inv-request', {
      transactionType: 'Fulfillment'
    }));

    assert.strictEqual(inventoryRequest.get('isAdjustment'), false);
  });

  test('isFulfillment', function(assert) {
    let inventoryRequest = run(() => this.owner.lookup('service:store').createRecord('inv-request', {
      transactionType: 'Fulfillment'
    }));

    assert.strictEqual(inventoryRequest.get('isFulfillment'), true);
  });

  test('isTransfet', function(assert) {
    let inventoryRequest = run(() => this.owner.lookup('service:store').createRecord('inv-request', {
      transactionType: 'Transfer'
    }));

    assert.strictEqual(inventoryRequest.get('isTransfer'), true);
  });

  testValidPropertyValues('quantity', [0.5, 1, '123']);
  testInvalidPropertyValues('quantity', [-1, -0.00001, undefined]);
});

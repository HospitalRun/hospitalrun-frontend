import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('proc-charge', 'Unit | Model | proc-charge', {
  needs: [
    'ember-validations@validator:local/presence',
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/acceptance',
    'model:inventory',
    'model:inv-purchase',
    'model:inv-location',
    'model:pricing'
  ]
});

test('medicationCharge', function(assert) {
  let medication = Ember.run(() => this.store().createRecord('inventory'));
  let procCharge = this.subject({
    newMedicationCharge: 11,
    medication
  });

  assert.strictEqual(procCharge.get('medicationCharge'), true);
});

test('medicationCharge both empty', function(assert) {
  let procCharge = this.subject();

  assert.strictEqual(procCharge.get('medicationCharge'), false);
});

test('medicationChange empty medication', function(assert) {
  let procCharge = this.subject({
    newMedicationCharge: 12
  });

  assert.strictEqual(procCharge.get('medicationCharge'), true);
});

test('medicationCharge empty newMedicationCharge', function(assert) {
  let medication = Ember.run(() => this.store().createRecord('inventory'));
  let procCharge = this.subject({ medication });

  assert.strictEqual(procCharge.get('medicationCharge'), true);
});

test('medicationName', function(assert) {
  let medication = Ember.run(() => this.store().createRecord('inventory', {
    name: 'Test Item',
    price: 12.5
  }));
  let procCharge = this.subject({ medication });

  assert.strictEqual(procCharge.get('medicationName'), 'Test Item');
});

test('medicationPrice', function(assert) {
  let medication = Ember.run(() => this.store().createRecord('inventory', {
    name: 'Testing',
    price: 133.59
  }));
  let procCharge = this.subject({ medication });

  assert.strictEqual(procCharge.get('medicationPrice'), 133.59);
});

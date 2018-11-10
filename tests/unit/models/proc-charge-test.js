import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | proc-charge', function(hooks) {
  setupTest(hooks);

  test('medicationCharge', function(assert) {
    let medication = run(() => this.owner.lookup('service:store').createRecord('inventory'));
    let procCharge = run(() => this.owner.lookup('service:store').createRecord('proc-charge', {
      newMedicationCharge: 11,
      medication
    }));

    assert.strictEqual(procCharge.get('medicationCharge'), true);
  });

  test('medicationCharge both empty', function(assert) {
    let procCharge = run(() => this.owner.lookup('service:store').createRecord('proc-charge'));

    assert.strictEqual(procCharge.get('medicationCharge'), false);
  });

  test('medicationChange empty medication', function(assert) {
    let procCharge = run(() => this.owner.lookup('service:store').createRecord('proc-charge', {
      newMedicationCharge: 12
    }));

    assert.strictEqual(procCharge.get('medicationCharge'), true);
  });

  test('medicationCharge empty newMedicationCharge', function(assert) {
    let medication = run(() => this.owner.lookup('service:store').createRecord('inventory'));
    let procCharge = run(() => this.owner.lookup('service:store').createRecord('proc-charge', { medication }));

    assert.strictEqual(procCharge.get('medicationCharge'), true);
  });

  test('medicationName', function(assert) {
    let medication = run(() => this.owner.lookup('service:store').createRecord('inventory', {
      name: 'Test Item',
      price: 12.5
    }));
    let procCharge = run(() => this.owner.lookup('service:store').createRecord('proc-charge', { medication }));

    assert.strictEqual(procCharge.get('medicationName'), 'Test Item');
  });

  test('medicationPrice', function(assert) {
    let medication = run(() => this.owner.lookup('service:store').createRecord('inventory', {
      name: 'Testing',
      price: 133.59
    }));
    let procCharge = run(() => this.owner.lookup('service:store').createRecord('proc-charge', { medication }));

    assert.strictEqual(procCharge.get('medicationPrice'), 133.59);
  });
});

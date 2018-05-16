<<<<<<< HEAD
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('medication', 'Unit | Model | medication', {
  needs: [
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/presence',
    'model:inventory',
    'model:patient',
    'model:visit'
  ]
});

test('isRequested', function(assert) {
  let medication = this.subject({ status: 'Requested' });

  assert.strictEqual(medication.get('isRequested'), true);
});

test('isRequested false', function(assert) {
  let medication = this.subject({ status: 'Test' });

  assert.strictEqual(medication.get('isRequested'), false);
});
=======
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('medication', 'Unit | Model | medication', {
  needs: [
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/presence',
    'model:inventory',
    'model:patient',
    'model:visit',
    'service:session'
  ]
});

test('isRequested', function(assert) {
  let medication = this.subject({ status: 'Requested' });

  assert.strictEqual(medication.get('isRequested'), true);
});

test('isRequested false', function(assert) {
  let medication = this.subject({ status: 'Test' });

  assert.strictEqual(medication.get('isRequested'), false);
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea

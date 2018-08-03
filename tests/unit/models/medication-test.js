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

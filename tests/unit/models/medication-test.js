import { moduleForModel, test } from 'ember-qunit';

moduleForModel('medication', 'Unit | Model | medication', {
  needs: [
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

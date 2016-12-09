import { moduleForModel, test } from 'ember-qunit';

moduleForModel('imaging', 'Unit | Model | imaging', {
  needs: [
    'ember-validations@validator:local/presence',
    'ember-validations@validator:local/acceptance',
    'model:proc-charge',
    'model:pricing',
    'model:patient',
    'model:visit'
  ]
});

test('imagingDateAsTime', function(assert) {
  let imaging = this.subject({
    imagingDate: new Date(2005, 10, 10, 3, 24, 0)
  });

  assert.strictEqual(imaging.get('imagingDateAsTime'), 1131611040000);
});

test('requestedDateAsTime', function(assert) {
  let imaging = this.subject({
    requestedDate: new Date(2005, 10, 10, 3, 24, 0)
  });

  assert.strictEqual(imaging.get('requestedDateAsTime'), 1131611040000);
});

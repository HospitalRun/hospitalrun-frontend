import { moduleForModel, test } from 'ember-qunit';

moduleForModel('imaging', 'Unit | Model | imaging', {
  needs: [
    'model:proc-charge',
    'model:pricing',
    'model:patient',
    'model:visit',
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/presence'
  ]
});

test('imagingDateAsTime', function(assert) {
  let imaging = this.subject({
    imagingDate: new Date(1131593040000)
  });

  assert.strictEqual(imaging.get('imagingDateAsTime'), 1131593040000);
});

test('requestedDateAsTime', function(assert) {
  let imaging = this.subject({
    requestedDate: new Date(1131593040000)
  });

  assert.strictEqual(imaging.get('requestedDateAsTime'), 1131593040000);
});

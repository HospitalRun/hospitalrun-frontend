import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | imaging', function(hooks) {
  setupTest(hooks);

  test('imagingDateAsTime', function(assert) {
    let imaging = run(() => this.owner.lookup('service:store').createRecord('imaging', {
      imagingDate: new Date(1131593040000)
    }));

    assert.strictEqual(imaging.get('imagingDateAsTime'), 1131593040000);
  });

  test('requestedDateAsTime', function(assert) {
    let imaging = run(() => this.owner.lookup('service:store').createRecord('imaging', {
      requestedDate: new Date(1131593040000)
    }));

    assert.strictEqual(imaging.get('requestedDateAsTime'), 1131593040000);
  });
});

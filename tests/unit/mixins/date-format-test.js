import EmberObject from '@ember/object';
import DateFormat from 'hospitalrun/mixins/date-format';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Mixin | date-format', function(hooks) {
  setupTest(hooks);

  test('dateToTime', function(assert) {
    let dateFormat = EmberObject.extend(DateFormat).create();

    assert.strictEqual(
      dateFormat.dateToTime(new Date(1481665085175)),
      1481665085175,
      'Should return correct time'
    );

    assert.strictEqual(
      dateFormat.dateToTime(),
      undefined,
      'Should return undefined for no argument'
    );

    assert.strictEqual(
      dateFormat.dateToTime(1481665085175),
      undefined,
      'Should return undefined for non Date object'
    );
  });
});

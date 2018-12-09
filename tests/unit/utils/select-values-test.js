import SelectValues from 'hospitalrun/utils/select-values';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Utils | select-values', function(hooks) {
  setupTest(hooks);

  test('selectValues', function(assert) {
    assert.deepEqual(
      SelectValues.selectValues(['a', 'b']),
      [{ id: 'a', value: 'a' }, { id: 'b', value: 'b' }],
      'Should add id to values'
    );

    assert.deepEqual(
      SelectValues.selectValues(['a', 'b'], true),
      [{ id: '', value: '' }, { id: 'a', value: 'a' }, { id: 'b', value: 'b' }],
      'Should add empty'
    );

    assert.deepEqual(
      SelectValues.selectValues('test'),
      undefined,
      'Should return undefined if non array'
    );
  });
});

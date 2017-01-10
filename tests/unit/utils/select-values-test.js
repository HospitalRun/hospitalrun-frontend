import SelectValues from 'hospitalrun/utils/select-values';
import { moduleFor, test } from 'ember-qunit';

moduleFor('util:select-values', 'Unit | Utils | select-values');

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

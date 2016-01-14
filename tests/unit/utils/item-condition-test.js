import { rankToMultiplier, getCondition } from 'hospitalrun/utils/item-condition';
import { moduleFor, test } from 'ember-qunit';

moduleFor('util:item-condition', 'Unit | Utils | item-condition');

test('rankToMultiplier', function(assert) {
  assert.equal(rankToMultiplier('A'), 0.5, 'Should be one half for A rank');
  assert.equal(rankToMultiplier('B'), 1, 'Should be one for B rank');
  assert.equal(rankToMultiplier('C'), 2, 'Should be two for C rank');
});

test('getCondition', function(assert) {
  assert.equal(getCondition(14), 'good', 'Should be good for 14 days');
  assert.equal(getCondition(13), 'average', 'Should be average for 13 days');
  assert.equal(getCondition(6), 'bad', 'Should be bad for 6 days');
  assert.equal(getCondition(14, 0.5), 'average', 'Shold accept custom multiplier');
});

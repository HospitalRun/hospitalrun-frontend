import { round100 } from 'hospitalrun/utils/math';
import { moduleFor, test } from 'ember-qunit';

moduleFor('util:math', 'Unit | Utils | math');

test('round100', function(assert) {
  assert.strictEqual(round100(1), 1, 'Should leave number untouched');
  assert.strictEqual(round100(10.5), 10.5, 'Should leave 1 decimal untouched');
  assert.strictEqual(round100(10.55), 10.55, 'Should leave 2 decimal untouched');
  assert.strictEqual(round100(10.358), 10.36, 'Should round 10.358, 10.36');
  assert.strictEqual(round100(35.555), 35.56, 'Should round 8.455 to 8.46');
});

import { msToTime } from 'ember-inspector/helpers/ms-to-time';
import { module, test } from 'qunit';

module('Unit | Helper | ms to time');

test('it should format time to a readable string', function(assert) {
  assert.equal(msToTime([0.42]), '0.42ms');
});

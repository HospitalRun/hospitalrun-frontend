import sut from 'hospitalrun/utils/text-expansion';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Utils | text-expansion', function(hooks) {
  setupTest(hooks);

  test('findExpansionSubjects', function(assert) {
    assert.deepEqual(sut.findExpansionSubjects(''), []);
    assert.deepEqual(sut.findExpansionSubjects('#abc'), ['#abc']);
    assert.deepEqual(sut.findExpansionSubjects('#abc #def'), ['#abc', '#def']);
  });

  test('findExpansionSites', function(assert) {
    assert.deepEqual(sut.findExpansionSites('abc', []), []);
    assert.deepEqual(sut.findExpansionSites('#abc', ['#abc']), [{ index: 0, match: '#abc', term: 'abc' }]);
    assert.deepEqual(
      sut.findExpansionSites('#abc #abc', ['#abc']), [{ index: 0, match: '#abc', term: 'abc' }, { index: 5, match: '#abc', term: 'abc' }]
    );
  });
});

import sut from 'hospitalrun/utils/text-expansion';
import { moduleFor, test } from 'ember-qunit';

moduleFor('util:text-expansion', 'Unit | Utils | text-expansion');

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

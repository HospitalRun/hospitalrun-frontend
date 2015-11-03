import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | labs', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /labs', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/labs');

  andThen(function() {
    assert.equal(currentURL(), '/labs');
    findWithAssert('a:contains(Requests)');
    findWithAssert('a:contains(Completed)');
    findWithAssert('a:contains(Create a new record?)');
    findWithAssert('button:contains(new lab)');
  });
  destroyDatabases();
});

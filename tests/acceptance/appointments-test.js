import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | appointments', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /appointments', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/appointments');

  andThen(function() {
    assert.equal(currentURL(), '/appointments');
    findWithAssert('a:contains(This Week)');
    findWithAssert('a:contains(Today)');
    findWithAssert('a:contains(Search)');
    findWithAssert('button:contains(new appointment)');
    findWithAssert('.table-header');
  });
  destroyDatabases();
});

test('Creating a new appointment', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/appointments/edit/new');

  andThen(function() {
    assert.equal(currentURL(), '/appointments/edit/new');
    findWithAssert('button:contains(Cancel)');
    findWithAssert('button:contains(Add)');
  });
  destroyDatabases();
});

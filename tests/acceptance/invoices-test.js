import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | invoices', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /invoices', function(assert) {
  loadPouchDump('billing');
  authenticateUser();
  visit('/invoices');
  andThen(function() {
    assert.equal(currentURL(), '/invoices');
  });
  destroyDatabases();
});

import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | patients', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});


test('visiting /patients', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/patients');
  andThen(function() {
    assert.equal(currentURL(), '/patients');
  });
});

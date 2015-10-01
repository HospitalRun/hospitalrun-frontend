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

const user = JSON.parse('{"authenticator":"authenticator:custom","ok":true,"name":"hradmin","roles":["System Administrator","admin","user"],"expires_at":1443727594804,"role":"System Administrator","prefix":"p1"}');

test('visiting /patients', function(assert) {
  loadPouchDump('default');
  authenticateSession();
  andThen(function(){
    const secure = currentSession().get('secure');
    Ember.setProperties(secure, user);
  });
  visit('/patients');
  andThen(function() {
    assert.equal(currentURL(), '/patients');
  });
});

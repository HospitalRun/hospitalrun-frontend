import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | login', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting / redirects user to login', function(assert) {
  assert.expect(3);
  visit('/');

  server.post('/db/_session', function(db, request){
    assert.equal(request.requestBody, "name=hradmin&password=test", 'credential are sent to the server');
    return {"ok":true,"name":"hradmin","roles":["System Administrator","admin","user"]};
  });
  server.post('/chkuser', function(db, request){
    assert.equal(request.requestBody, "name=hradmin", "username is sent to /chkuser");
    return {"prefix":"p1","role":"System Administrator"};
  });
  andThen(function() {
    assert.equal(currentURL(), '/login');
  });

  fillIn('#identification', 'hradmin');
  fillIn('#password', 'test');
  click('button:contains(Sign in)');
});

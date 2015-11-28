import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';

module('Acceptance | login', {
  beforeEach: function() {
    FakeServer.start();
    this.application = startApp();
  },

  afterEach: function() {
    FakeServer.stop();
    Ember.run(this.application, 'destroy');
  }
});

test('visiting / redirects user to login', function(assert) {
  assert.expect(3);
  runWithPouchDump('default', function() {
    visit('/');

    stubRequest('post', '/db/_session', function(request) {
      assert.equal(request.requestBody, 'name=hradmin&password=test', 'credential are sent to the server');
      request.ok({ 'ok': true,'name': 'hradmin','roles': ['System Administrator','admin','user'] });
    });

    stubRequest('post', '/chkuser', function(request) {
      assert.equal(request.requestBody, 'name=hradmin', 'username is sent to /chkuser');
      request.ok({ 'prefix': 'p1','role': 'System Administrator' });
    });

    andThen(function() {
      assert.equal(currentURL(), '/login');
    });

    fillIn('#identification', 'hradmin');
    fillIn('#password', 'test');
    click('button:contains(Sign in)');
  });
});

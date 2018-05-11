import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';

module('Acceptance | login', {
  beforeEach() {
    FakeServer.start();
    this.application = startApp();
  },

  afterEach() {
    FakeServer.stop();
    run(this.application, 'destroy');
  }
});

test('visiting / redirects user to login', function(assert) {
  assert.expect(1);
  runWithPouchDump('default', async function() {
    await visit('/');
    assert.equal(currentURL(), '/login');
  });
});

test('login with correct credentials', function(assert) {
  login(assert);
});
test('login with correct credentials but space around username', function(assert) {
  login(assert, true);
});

test('incorrect credentials shows an error message on the screen', function(assert) {
  if (!window.ELECTRON) {
    assert.expect(2);
  }
  runWithPouchDump('default', async function() {
    await visit('/');

    let errorMessage = 'Username or password is incorrect.';

    stubRequest('post', '/auth/login', function(request) {
      assert.equal(request.requestBody, 'name=hradmin&password=tset', 'credential are sent to the server');
      request.error({ 'error': 'unauthorized', 'reason': errorMessage });
    });

    await fillIn('#identification', 'hradmin');
    await fillIn('#password', 'tset');
    await click('button:contains(Sign in)');
    await waitToAppear('.form-signin-alert');

    assert.dom('.form-signin-alert').hasText(errorMessage, 'Error reason is shown');
  });
});

function login(assert, spaceAroundUsername) {
  if (!window.ELECTRON) {
    assert.expect(2);
  }
  runWithPouchDump('default', async function() {
    await visit('/login');

    stubRequest('post', '/auth/login', function(request) {
      assert.equal(request.requestBody, 'name=hradmin&password=test', !spaceAroundUsername ? 'credential are sent to the server' : 'username trimmed and credential are sent to the server');
      request.ok({ 'ok': true, 'name': 'hradmin', 'roles': ['System Administrator', 'admin', 'user'] });
    });

    assert.equal(currentURL(), '/login');

    await fillIn('#identification', !spaceAroundUsername ? 'hradmin' : ' hradmin');
    await fillIn('#password', 'test');
    await click('button:contains(Sign in)');
    await waitToAppear('.sidebar-nav-logo');
  });
}

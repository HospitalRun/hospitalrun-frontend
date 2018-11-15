import { click, fillIn, currentURL, visit } from '@ember/test-helpers';
import jquerySelect from 'hospitalrun/tests/helpers/deprecated-jquery-select';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';

import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  test('visiting / redirects user to login', function(assert) {
    assert.expect(1);
    return runWithPouchDump('default', async function() {
      await visit('/');
      assert.equal(currentURL(), '/login');
    });
  });

  test('login with correct credentials', function(assert) {
    return login(assert);
  });
  test('login with correct credentials but space around username', function(assert) {
    return login(assert, true);
  });

  test('incorrect credentials shows an error message on the screen', function(assert) {
    if (!window.ELECTRON) {
      assert.expect(2);
    }
    return runWithPouchDump('default', async function() {
      await visit('/');

      let errorMessage = 'Username or password is incorrect.';

      stubRequest('post', '/auth/login', function(request) {
        assert.equal(request.requestBody, 'name=hradmin&password=tset', 'credential are sent to the server');
        request.error({ 'error': 'unauthorized', 'reason': errorMessage });
      });

      await fillIn('#identification', 'hradmin');
      await fillIn('#password', 'tset');
      await click(jquerySelect('button:contains(Sign in)'));
      await waitToAppear('.form-signin-alert');

      assert.dom('.form-signin-alert').hasText(errorMessage, 'Error reason is shown');
    });
  });

  function login(assert, spaceAroundUsername) {
    if (!window.ELECTRON) {
      assert.expect(2);
    }
    return runWithPouchDump('default', async function() {
      await visit('/login');

      stubRequest('post', '/auth/login', function(request) {
        assert.equal(request.requestBody, 'name=hradmin&password=test', !spaceAroundUsername ? 'credential are sent to the server' : 'username trimmed and credential are sent to the server');
        request.ok({ 'ok': true, 'name': 'hradmin', 'roles': ['System Administrator', 'admin', 'user'] });
      });

      assert.equal(currentURL(), '/login');

      await fillIn('#identification', !spaceAroundUsername ? 'hradmin' : ' hradmin');
      await fillIn('#password', 'test');
      await click(jquerySelect('button:contains(Sign in)'));
      await waitToAppear('.sidebar-nav-logo');
    });
  }
});

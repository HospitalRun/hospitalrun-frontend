import { click, fillIn, visit } from '@ember/test-helpers';
import jquerySelect from 'hospitalrun/tests/helpers/deprecated-jquery-select';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

module('Acceptance | navigation', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    FakeServer.start();
  });

  hooks.afterEach(function() {
    FakeServer.stop();
  });

  test('about dialog', function(assert) {
    return runWithPouchDump('default', async function() {
      await authenticateUser();
      await visit('/');

      stubRequest('get', '/serverinfo', function(request) {
        request.ok({ 'ok': true });
      });

      await click('.settings-trigger');
      await waitToAppear('a:contains(About HospitalRun)');
      await click(jquerySelect('a:contains(About HospitalRun)'));

      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('About HospitalRun', 'About dialog is shown');
    });
  });

  test('search text clears after search', function(assert) {
    return runWithPouchDump('default', async function() {
      await authenticateUser();
      await visit('/patients');

      await fillIn('.sidebar-nav-search div input', 'fakeSearchText');
      await click('.glyphicon-search');
      await waitToAppear('h1:contains(Search Results)');
      assert.dom('.sidebar-nav-search div input').hasValue('');
    });
  });

  test('search text clears after selecting new nav item', function(assert) {
    return runWithPouchDump('default', async function() {
      await authenticateUser();
      await visit('/patients');

      await fillIn('.sidebar-nav-search div input', 'fakeSearchText');
      await click(jquerySelect('a:contains(Inventory)'));
      await waitToAppear('h1:contains(Requests)');
      assert.dom('.sidebar-nav-search div input').hasValue('');
    });
  });
});

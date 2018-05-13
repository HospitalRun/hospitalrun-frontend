import { test } from 'qunit';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | navigation', {
  beforeEach() {
    FakeServer.start();
  },

  afterEach() {
    FakeServer.stop();
  }
});

test('about dialog', function(assert) {
  runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/');

    stubRequest('get', '/serverinfo', function(request) {
      request.ok({ 'ok': true });
    });

    await click('.settings-trigger');
    await waitToAppear('a:contains(About HospitalRun)');
    await click('a:contains(About HospitalRun)');

    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('About HospitalRun', 'About dialog is shown');
  });
});

test('search text clears after search', function(assert) {
  runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/patients');

    await fillIn('.sidebar-nav-search div input', 'fakeSearchText');
    await click('.glyphicon-search');
    await waitToAppear('h1:contains(Search Results)');
    assert.dom('.sidebar-nav-search div input').hasValue('');
  });
});

test('search text clears after selecting new nav item', function(assert) {
  runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/patients');

    await fillIn('.sidebar-nav-search div input', 'fakeSearchText');
    await click('a:contains(Inventory)');
    await waitToAppear('h1:contains(Requests)');
    assert.dom('.sidebar-nav-search div input').hasValue('');
  });
});

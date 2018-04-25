import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';

module('Acceptance | navigation', {
  beforeEach() {
    FakeServer.start();
    this.application = startApp();
  },

  afterEach() {
    FakeServer.stop();
    run(this.application, 'destroy');
  }
});

test('about dialog', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/');

    stubRequest('get', '/serverinfo', function(request) {
      request.ok({ 'ok': true });
    });

    click('.settings-trigger');
    waitToAppear('a:contains(About HospitalRun)');
    click('a:contains(About HospitalRun)');

    waitToAppear('.modal-dialog');

    andThen(() => {
      assert.dom('.modal-title').hasText('About HospitalRun', 'About dialog is shown');
    });
  });
});

test('search text clears after search', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/patients');

    andThen(() => {
      fillIn('.sidebar-nav-search div input', 'fakeSearchText');
      click('.glyphicon-search');
      waitToAppear('h1:contains(Search Results)');
    });
    andThen(() => {
      assert.dom('.sidebar-nav-search div input').hasValue('');
    });
  });
});

test('search text clears after selecting new nav item', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/patients');

    andThen(() => {
      fillIn('.sidebar-nav-search div input', 'fakeSearchText');
      click('a:contains(Inventory)');
      waitToAppear('h1:contains(Requests)');
    });
    andThen(() => {
      assert.dom('.sidebar-nav-search div input').hasValue('');
    });
  });
});

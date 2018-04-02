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
      assert.equal(find('.modal-title').text(), 'About HospitalRun', 'About dialog is shown');
    });
  });
});

// // WIP

import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';
// import FakeServer, { stubRequest } from 'ember-cli-fake-server';

module('Acceptance | language dropdown', {
  beforeEach() {
    // 'FakeServer.start()' and 'FakeServer.stop()' are only needed if we are stubbing requests to the
    // authentication endpoint
    // FakeServer.start();
    this.application = startApp();
    // this.application.inject('service', 'languagePreference', 'service:language-preference');
  },

  afterEach() {
    // FakeServer.stop();
    Ember.run(this.application, 'destroy');
  }
});

test('setting a language preference persists after logout', (assert) => {
  runWithPouchDump('default', () => {
    assert.equal(1, 1);
    // login(assert, { name: 'hradmin', password: 'test' });
    // login(assert, {name: 'hradmin', password: 'test' });

    // andThen(() => {
    //   assert.equal(currentURL(), '/', 'Path should equal homepage');
    //   assert.equal(find('.view-current-title').text(), 'Welcome to HospitalRun!', 'Title should initially display as English');
    // });
    // andThen(() => {
    //   click('a.settings-trigger');
    //   waitToAppear('.settings-nav');
    // });
    // andThen(() => {
    //   select('.language-dropdown', 'French');
    // });
    // andThen(() => {
    //   assert.equal(find('.view-current-title').text(), 'Que voulez-vous faire?', 'Title should have changed to French.');
    // });
    // andThen(() => {
    //   click('a.settings-trigger');
    //   waitToAppear('.settings-nav');
    //   click('a.logout');
    //   invalidateSession();
    //   visit('/login');
    // });
    // andThen(() => {
    //   login(assert, { name: 'otherhradmin', password: 'test' });
    // });
    // andThen(() => {
    //   visit('/');
    // });
    // andThen(() => {
    //   // pauseTest();
    //   assert.equal(currentURL(), '/', 'Path should equal homepage');
    //   assert.equal(find('.view-current-title').text(), 'Welcome to HospitalRun!', 'Title for 2nd user should be in English');
    //   click('a.settings-trigger');
    //   waitToAppear('.settings-nav');
    //   click('a.logout');
    //   invalidateSession();
    //   visit('/login');
    // });
    // andThen(() => {
    //   login(assert, { name: 'hradmin', password: 'test' });
    //   visit('/');
    // });
    // andThen(() => {
    //   assert.equal(currentURL(), '/', 'Path should equal homepage');
    //   assert.equal(find('.view-current-title').text(), 'Que voulez-vous faire?', 'Title for original user should still be in French.');
    // });
  });
});

// test('different users can have different language preferences on the same browser', function(assert) {
// });

// function login(assert, options) {
//   let { name, password } = options;

//   runWithPouchDump('default', function() {
//     visit('/login');

//     stubRequest('post', '/auth/login', function(request) {
//       assert.equal(request.requestBody, `name=${name}&password=${password}`);
//       request.ok({ 'ok': true, name, 'roles': ['System Administrator', 'admin', 'user'] });
//     });

//     andThen(function() {
//       assert.equal(currentURL(), '/login');
//     });

//     fillIn('#identification', name);
//     fillIn('#password', password);
//     click('button:contains(Sign in)');
//     andThen(() => {
//       waitToAppear('.sidebar-nav-logo');
//     });
//   });
// }

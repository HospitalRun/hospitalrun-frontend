import Ember from 'ember';
import { module, test } from 'qunit';
// import moment from 'moment';
import startApp from 'hospitalrun/tests/helpers/start-app';

// const DATE_TIME_FORMAT = 'l h:mm A';
// const TIME_FORMAT = 'h:mm';

module('Acceptance | appointments', {
  beforeEach() {
    this.application = startApp();
  },

  afterEach() {
    Ember.run(this.application, 'destroy');
  }
});

test('setting a language preference persists after logout', function(assert) {
  assert.expect(1);
  runWithPouchDump('default', function() {
    authenticateUser({ name: 'foobar' });
    visit('/');

    andThen(function() {
      // debugger;
      assert.equal(currentURL(), '/');
    });
    click('a.settings-trigger');
    // andThen(function() {
    //   debugger;
    //   select('.language-select', 'French');
    //   debugger;
    // });

    // andThen(function() {
    //   debugger;
    //   invalidateSession();
    //   debugger;
    // });
    // andThen(function() {
    //   debugger;
    //   visit('/');
    //   debugger;
    // });
    // authenticateUser({ name: 'hradmin' });
    // visit('/');
    // andThen(function() {
    //   debugger;
    // });

  });
});

// test('different users can have different language preferences on the same browser', function(assert) {
  // assert.expect(1);
  // runWithPouchDump('default', function() {
  //   visit('/');

  //   andThen(function() {
  //     assert.equal(currentURL(), '/login');
  //   });

  // });
// });
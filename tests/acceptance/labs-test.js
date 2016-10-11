import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | labs', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /labs', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/labs');

    andThen(function() {
      assert.equal(currentURL(), '/labs');
      findWithAssert('a:contains(Create a new record?)');
      findWithAssert('button:contains(new lab)');
    });
  });
});

test('Adding a new lab request', function(assert) {
  runWithPouchDump('labs', function() {
    authenticateUser();
    visit('/labs');

    click('button:contains(new lab)');

    andThen(function() {
      assert.equal(currentURL(), '/labs/edit/new');
    });

    typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
    typeAheadFillIn('.test-lab-type', 'Chest Scan');
    fillIn('.test-result-input input', 'Chest is clear');
    fillIn('textarea', 'Dr test ordered another scan');
    click('button:contains(Add)');
    waitToAppear('.modal-dialog');

    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Lab Request Saved', 'Lab Request was saved successfully');
      findWithAssert('.patient-summary');
    });

    click('.modal-footer button:contains(Ok)');

    andThen(() => {
      assert.equal(find('.patient-summary').length, 1, 'Patient summary is displayed');
    });

    click('.panel-footer button:contains(Return)');

    andThen(() => {
      assert.equal(currentURL(), '/labs');
      assert.equal(find('tr').length, 3, 'Two lab requests are displayed');
    });
  });
});

test('Marking a lab request as completed', function(assert) {
  runWithPouchDump('labs', function() {
    authenticateUser();
    visit('/labs/completed');

    andThen(() => {
      assert.equal(find('.alert-info').text().trim(), 'No completed items found.', 'No completed requests are displayed');
    });

    visit('/labs');
    click('button:contains(Edit)');
    click('button:contains(Complete)');
    waitToAppear('.modal-dialog');

    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Lab Request Completed', 'Lab Request was completed successfully');
    });

    click('.modal-footer button:contains(Ok)');
    click('.panel-footer button:contains(Return)');
    visit('/labs/completed');

    andThen(() => {
      assert.equal(find('tr').length, 2, 'One completed request is displayed');
    });
  });
});

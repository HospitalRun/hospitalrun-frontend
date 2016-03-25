import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | patient notes', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

function tabTest(tabName, tabTitle) {
  click(`[data-test-selector=${tabName}]`);
  andThen(function() {
    findWithAssert(`.active .panel-title:contains(${tabTitle})`);
  });
}

test('visiting /patients new note route', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/patients');
    visit('/patients/edit/new');
    andThen(function() {
      assert.equal(currentURL(), '/patients/edit/new');
    });
    fillIn('.test-first-name input', 'John');
    fillIn('.test-last-name input', 'Doe');
    click('.panel-footer button:contains(Add)');
    waitToAppear('.modal-dialog');
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Patient Saved', 'Patient record has been saved');
    });
    click('button:contains(Close)');
    waitToAppear('.patient-summary');
    andThen(function() {
      findWithAssert('.patient-summary');
    });
    andThen(function() {
      tabTest('visits-tab', 'Visits');
    });
    andThen(function() {
      click('button:contains(New Visit)');
      assert.equal(currentURL(), '/visits/edit/new', 'Now in add visiting information route');
    });
    click('.panel-footer button:contains(Add)');
    waitToAppear('.modal-dialog');
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Visit Saved', 'New visit has been saved');
    });
    click('button:contains(Ok)');
    andThen(() => {
      findWithAssert('button:contains(New Note)');
      findWithAssert('button:contains(New Procedure)');
      findWithAssert('button:contains(New Medication)');
      findWithAssert('button:contains(New Lab)');
      findWithAssert('button:contains(New Imaging)');
      findWithAssert('button:contains(New Vitals)');
      findWithAssert('button:contains(Add Item)');
    });
    andThen(function() {
      assert.equal(find('button:contains(New Note)').length, 1, 'New Note button in visible');
      click('button:contains(New Note)');
    });
    andThen(function() {
      assert.equal(find('label:contains(Note)').length, 1, 'Notes modal appeared.');
    });
  });
});
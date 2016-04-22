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

test('patient notes crud testing', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/patients/edit/new');
    andThen(function() {
      assert.equal(currentURL(), '/patients/edit/new');
      fillIn('.test-first-name input', 'John');
      fillIn('.test-last-name input', 'Doe');
      click('.panel-footer button:contains(Add)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Patient Saved', 'Patient record has been saved');
      click('button:contains(Close)');
      waitToAppear('.patient-summary');
    });
    andThen(function() {
      findWithAssert('.patient-summary');
      click('[data-test-selector=visits-tab]');
    });
    andThen(function() {
      findWithAssert('#visits');
      click('button:contains(New Visit)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/visits/edit/new', 'Now in add visiting information route');
      click('.panel-footer button:contains(Add)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Visit Saved', 'New visit has been saved');
      click('button:contains(Ok)');
    });
    andThen(() => {
      findWithAssert('button:contains(New Note)');
      findWithAssert('button:contains(New Procedure)');
      findWithAssert('button:contains(New Medication)');
      findWithAssert('button:contains(New Lab)');
      findWithAssert('button:contains(New Imaging)');
      findWithAssert('button:contains(New Vitals)');
      findWithAssert('button:contains(Add Item)');
      assert.equal(find('button:contains(New Note)').length, 1, 'New Note button in visible');
      click('button:contains(New Note)');
    });
    andThen(function() {
      assert.equal(find('label:contains(Note)').length, 1, 'Notes modal appeared.');
      fillIn('.test-note-content textarea', 'This is a note.');
      fillIn('.test-note-attribution input', 'Dr. Nick');
      click('.modal-footer button:contains(Add)');
    });
    andThen(function() {
      waitToAppear('#visit-notes table tr td:contains(This is a note.)');
    });
    andThen(function() {
      assert.equal(find('#visit-notes table tr td:contains(This is a note.)').length, 1, 'Successfully added note.');
      click('#visit-notes table tr td button:contains(Edit)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      fillIn('.test-note-content textarea', 'This is an updated note.');
      click('.modal-footer button:contains(Update)');
      waitToAppear('#visit-notes table tr td:contains(This is an updated note.)');
    });
    andThen(function() {
      assert.equal(find('#visit-notes table tr td:contains(This is an updated note.)').length, 1, 'Successfully updated note.');
      click('#visit-notes table tr td button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      click('.modal-footer button:contains(Ok)');
    });
    andThen(function() {
      assert.equal(find('#visit-notes table tr td:contains(This is an updated note.)').length, 0, 'Successfully deleted note.');
    });
  });
});

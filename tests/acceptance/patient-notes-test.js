import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | patient notes');

test('patient notes crud testing', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/patients/edit/new');
    andThen(function() {
      assert.equal(currentURL(), '/patients/edit/new');
      fillIn('.test-first-name input', 'John');
      fillIn('.test-last-name input', 'Doe');
    });
    andThen(function() {
      click('.panel-footer button:contains(Add)');
      waitToAppear('.message:contains(The patient record for John Doe has been saved)');
    });
    andThen(function() {
      assert.equal(find('.message').text(), 'The patient record for John Doe has been saved.');
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
      click('[data-test-selector=notes-tab]');
    });
    andThen(() => {
      assert.equal(find('button:contains(New Note)').length, 1, 'New Note button in visible');
      click('button:contains(New Note)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'New Note for John Doe', 'Notes modal appeared');
      fillIn('.test-note-content textarea', 'This is a note.');
      fillIn('.test-note-attribution input', 'Dr. Nick');
    });
    andThen(function() {
      click('.modal-footer button:contains(Add)');
      waitToDisappear('.modal-dialog');
      waitToAppear('#visit-notes table tr td:contains(This is a note.)');
    });
    andThen(function() {
      assert.equal(find('#visit-notes table tr td:contains(This is a note.)').length, 1, 'Successfully added note.');
      click('#visit-notes table tr td button:contains(Edit)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      fillIn('.test-note-content textarea', 'This is an updated note.');
    });
    andThen(function() {
      click('.modal-footer button:contains(Update)');
      waitToDisappear('.modal-dialog');
      waitToAppear('#visit-notes table tr td:contains(This is an updated note.)');
    });
    andThen(function() {
      assert.equal(find('#visit-notes table tr td:contains(This is an updated note.)').length, 1, 'Successfully updated note.');
      click('#visit-notes table tr td button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Delete Note', 'Delete Note modal appeared');
      click('.modal-footer button:contains(Ok)');
      waitToDisappear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('#visit-notes table tr td:contains(This is an updated note.)').length, 0, 'Successfully deleted note.');
    });
  });
});

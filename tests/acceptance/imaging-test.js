import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | imaging', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /imaging', function(assert) {
  loadPouchDump('imaging');
  authenticateUser();
  visit('/imaging');

  andThen(() => {
    assert.equal(currentURL(), '/imaging');
    assert.equal(find('li a:contains(Requests)').length, 1, 'Requests link is visible');
    assert.equal(find('li a:contains(Completed)').length, 1, 'Completed link is visible');
    let newImagingButton = find('button:contains(new imaging)');
    assert.equal(newImagingButton.length, 1, 'New Imaging button is visible');
    findWithAssert('p:contains(No items found. )');
    findWithAssert('a:contains(Create a new record?)');
  });
  click('button:contains(new imaging)');
  andThen(() => {
    assert.equal(currentURL(), '/imaging/edit/new');
  });
  destroyDatabases();
});

test('creating a new imaging request', (assert) => {
  loadPouchDump('imaging');
  authenticateUser();
  visit('/imaging/edit/new');

  andThen(() => {
    assert.equal(currentURL(), '/imaging/edit/new');
  });
  fillIn('.patient-input .tt-input', 'Lennex Zinyando - P00017');
  triggerEvent('.patient-input .tt-input', 'input');
  fillIn('.imaging-type-input .tt-input', 'Chest Scan');
  fillIn('.radiologist-input .tt-input', 'Dr Test');
  fillIn('.result-input input', 'Check is clear');
  fillIn('textarea', 'Patient is healthy');
  click('button:contains(Add)');
  waitToAppear('.modal-dialog');
  andThen(() => {
    assert.equal(find('.modal-title').text(), 'Imaging Request Saved', 'Imaging Request was saved successfully');
  });
  click('button:contains(Ok)');
  andThen(() => {
    findWithAssert('button:contains(Update)');
    findWithAssert('button:contains(Return)');
    findWithAssert('button:contains(Complete)');
    assert.equal(find('.test-patient-summary').length, 1, 'Patient summary is displayed');
  });
  return pauseTest();
  destroyDatabases();
});

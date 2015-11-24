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
  runWithPouchDump('default', function() {
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
  });
});

test('create a new imaging request', (assert) => {
  runWithPouchDump('imaging', function() {
    authenticateUser();
    visit('/imaging/edit/new');

    andThen(() => {
      assert.equal(currentURL(), '/imaging/edit/new');
    });
    fillIn('.patient-input .tt-input', 'Lennex Zinyando - P00017');
    triggerEvent('.patient-input .tt-input', 'input');
    triggerEvent('.patient-input .tt-input', 'blur');
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
  });
});

test('completed requests are displayed', (assert) => {
  runWithPouchDump('imaging', function() {
    authenticateUser();
    visit('/imaging/completed');

    andThen(() => {
      assert.equal(currentURL(), '/imaging/completed');
      assert.equal(find('.table').length, 1, 'Requests table is visible');
    });
  });
});

test('mark an imaging request as completed', (assert) => {
  runWithPouchDump('imaging', function() {
    authenticateUser();
    visit('/imaging');

    andThen(() => {
      assert.equal(currentURL(), '/imaging');
      assert.equal(find('.table').length, 1, 'Requests table is visible');
      assert.equal(find('tr').length, 3, 'Two imaging requests not completed');
    });
    click('button:contains(Edit)');
    andThen(() => {
      assert.equal(currentURL(), '/imaging/edit/1AC1DD3D-E7E7-15B4-A698-8A8AE62749EB');
      findWithAssert('button:contains(Update)');
      findWithAssert('button:contains(Return)');
      findWithAssert('button:contains(Complete)');
    });
    click('button:contains(Complete)');
    waitToAppear('.modal-dialog');
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Imaging Request Completed', 'Imaging Request was saved successfully');
    });
    click('button:contains(Ok)');
    click('button:contains(Return)');
    andThen(() => {
      assert.equal(currentURL(), '/imaging');
      assert.equal(find('tr').length, 2, 'One request is left to complete');
    });
  });
});

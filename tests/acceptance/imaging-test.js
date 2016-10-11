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
    typeAheadFillIn('.patient-input', 'Joe Bagadonuts - P00001');
    typeAheadFillIn('.imaging-type-input', 'Chest Scan');
    typeAheadFillIn('.radiologist-input', 'Dr Test');
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
    });
    andThen(() => {
      assert.equal(find('.patient-summary').length, 1, 'Patient summary is displayed');
    });
    click('button:contains(Return)');
    andThen(() => {
      assert.equal(currentURL(), '/imaging');
      assert.equal(find('tr').length, 3, 'Two imaging requests are displayed');
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
      assert.equal(find('tr').length, 2, 'One imaging request not completed');
    });
    click('button:contains(Edit):first');
    andThen(() => {
      assert.equal(currentURL(), '/imaging/edit/12DEDA58-4670-7A74-BA8B-9CC5E5CA82E7');
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
      findWithAssert('a:contains(Create a new record?)');
    });
  });
});

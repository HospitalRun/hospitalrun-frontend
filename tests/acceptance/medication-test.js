import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | medication', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /medication', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/medication');

  andThen(function() {
    assert.equal(currentURL(), '/medication');
    assert.equal(find('li a:contains(Requests)').length, 1, 'Requests link is visible');
    assert.equal(find('li a:contains(Completed)').length, 1, 'Completed link is visible');
    findWithAssert('button:contains(new request)');
    findWithAssert('button:contains(dispense medication)');
    findWithAssert('button:contains(return medication)');
    findWithAssert('p:contains(No items found. )');
    findWithAssert('a:contains(Create a new medication request?)');
  });
  destroyDatabases();
});

test('creating a new medication request', function(assert) {
  loadPouchDump('medication');
  authenticateUser();
  visit('/medication/edit/new');

  andThen(function() {
    assert.equal(currentURL(), '/medication/edit/new');
  });
  fillIn('.test-patient-input .tt-input', 'Lennex Zinyando - P00017');
  triggerEvent('.test-patient-input .tt-input', 'input');
  triggerEvent('.test-patient-input .tt-input', 'blur');
  waitToAppear('.have-inventory-items');
  andThen(() => {
    fillIn('.test-medication-input .tt-input', 'Biogesic - m00001 (950 available)');
    triggerEvent('.test-medication-input .tt-input', 'input');
    triggerEvent('.test-medication-input .tt-input', 'blur');
    keyEvent('.test-medication-input .tt-input', 'keypress', 9);
  });
  fillIn('textarea', '30 Biogesic Pills');
  fillIn('.test-quantity-input input', '30');
  click('button:contains(Add)');

  waitToAppear('.modal-dialog');
  andThen(() => {
    assert.equal(find('.modal-title').text().trim(), 'Medication Request Saved', 'New medication request has been saved');
  });

  click('button:contains(Ok)');
  click('button:contains(Return)');
  andThen(() => {
    assert.equal(currentURL(), '/medication');
    assert.equal(find('tr').length, 3, 'New medication request is now displayed');
  });
  destroyDatabases();
});

test('fulfilling a medication request', function(assert) {
  loadPouchDump('medication');
  authenticateUser();
  visit('/medication');
  click('button:contains(Fulfill)');

  andThen(function() {
    assert.equal(find('.patient-summary').length, 1, 'Patient summary is displayed');
  });

  click('button:contains(Fulfill)');
  waitToAppear('.modal-dialog');

  andThen(() => {
    assert.equal(find('.modal-title').text().trim(), 'Medication Request Fulfilled', 'Medication Request has been Fulfilled');
  });

  click('button:contains(Ok)');
  click('button:contains(Return)');

  andThen(() => {
    assert.equal(currentURL(), '/medication');
    findWithAssert('p:contains(No items found. )');
    findWithAssert('a:contains(Create a new medication request?)');
  });
  destroyDatabases();
});

test('returning medication', function(assert) {
  loadPouchDump('medication');
  authenticateUser();
  visit('/medication/return/new');

  andThen(function() {
    assert.equal(currentURL(), '/medication/return/new');
  });
  waitToAppear('.have-inventory-items');
  andThen(() => {
    fillIn('.test-medication-input .tt-input', 'Biogesic - m00001');
    triggerEvent('.test-medication-input .tt-input', 'input');
    triggerEvent('.test-medication-input .tt-input', 'blur');
    keyEvent('.test-medication-input .tt-input', 'keypress', 9);
  });
  fillIn('.test-medication-quantity input', 30);
  click('button:contains(Return Medication)');
  waitToAppear('.modal-dialog');

  andThen(() => {
    assert.equal(find('.modal-title').text(), 'Medication Returned', 'Medication has been return successfully');
  });
  click('button:contains(Ok)');

  andThen(() => {
    assert.equal(currentURL(), '/medication');
  });
  destroyDatabases();
});

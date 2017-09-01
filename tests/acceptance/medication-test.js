import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | medication', {
  beforeEach() {
    this.application = startApp();
  },

  afterEach() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /medication', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/medication');

    andThen(function() {
      assert.equal(currentURL(), '/medication');
      findWithAssert('button:contains(new request)');
      findWithAssert('button:contains(dispense medication)');
      findWithAssert('button:contains(return medication)');
      findWithAssert('p:contains(No items found. )');
      findWithAssert('a:contains(Create a new medication request?)');
    });
  });
});

test('creating a new medication request', function(assert) {
  runWithPouchDump('medication', function() {
    authenticateUser();
    visit('/medication/edit/new');

    andThen(function() {
      assert.equal(currentURL(), '/medication/edit/new');
    });
    typeAheadFillIn('.test-patient-input', 'Lennex Zinyando - P00017');
    waitToAppear('.have-inventory-items');
    andThen(() => {
      typeAheadFillIn('.test-medication-input', 'Biogesic - m00001 (950 available)');
    });
    andThen(() => {
      fillIn('textarea', '30 Biogesic Pills');
      fillIn('.test-quantity-input input', '30');
    });
    waitToDisappear('.disabled-btn:contains(Add)');
    andThen(() =>{
      click('button:contains(Add)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('.modal-title').text().trim(), 'Medication Request Saved', 'New medication request has been saved');
    });

    click('button:contains(Ok)');
    click('button:contains(Return)');
    andThen(() => {
      assert.equal(currentURL(), '/medication');
      assert.equal(find('tr').length, 3, 'New medication request is now displayed');
    });
  });
});

test('fulfilling a medication request', function(assert) {
  runWithPouchDump('medication', function() {
    authenticateUser();
    visit('/medication');
    click('button:contains(Fulfill)');

    andThen(function() {
      assert.equal(find('.patient-summary').length, 1, 'Patient summary is displayed');
    });
    waitToAppear('.inventory-location option:contains(No Location)');
    andThen(() => {
      click('button:contains(Fulfill)');
      waitToAppear('.modal-dialog');
    });
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
  });
});

test('complete a medication request', function(assert) {
  runWithPouchDump('medication', function() {
    authenticateUser();
    visit('/medication/completed');
    assert.equal(find('.clickable').length, 0, 'Should have 0 completed request');
    visit('/medication');
    click('button:contains(Fulfill)');

    andThen(function() {
      assert.equal(find('.patient-summary').length, 1, 'Patient summary is displayed');
    });
    waitToAppear('.inventory-location option:contains(No Location)');
    andThen(() => {
      click('button:contains(Fulfill)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('.modal-title').text().trim(), 'Medication Request Fulfilled', 'Medication Request has been Fulfilled');
    });

    click('button:contains(Ok)');
    visit('/medication/completed');
    andThen(() => {
      assert.equal(currentURL(), '/medication/completed');
      assert.equal(find('.clickable').length, 1, 'Should have 1 completed request');
    });
  });
});

test('returning medication', function(assert) {
  runWithPouchDump('medication', function() {
    authenticateUser();
    visit('/medication/return/new');

    andThen(function() {
      assert.equal(currentURL(), '/medication/return/new');
    });
    waitToAppear('.have-inventory-items');
    andThen(() => {
      typeAheadFillIn('.test-medication-input', 'Biogesic - m00001');
    });
    andThen(() => {
      fillIn('.test-medication-quantity input', 30);
      waitToDisappear('.disabled-btn:contains(Return Medication)');
    });
    andThen(() => {
      click('button:contains(Return Medication)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Medication Returned', 'Medication has been return successfully');
    });
    click('button:contains(Ok)');

    andThen(() => {
      assert.equal(currentURL(), '/medication');
    });
  });
});

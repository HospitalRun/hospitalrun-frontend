import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | medication');

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
      assert.dom('.modal-title').hasText('Medication Request Saved', 'New medication request has been saved');
    });

    click('button:contains(Ok)');
    click('button:contains(Return)');
    andThen(() => {
      assert.equal(currentURL(), '/medication');
      assert.dom('tr').exists({ count: 3 }, 'New medication request is now displayed');
    });
  });
});

test('fulfilling a medication request', function(assert) {
  runWithPouchDump('medication', function() {
    authenticateUser();
    visit('/medication');
    click('button:contains(Fulfill)');

    andThen(function() {
      assert.dom('.patient-summary').exists({ count: 1 }, 'Patient summary is displayed');
    });
    waitToAppear('.inventory-location option:contains(No Location)');
    andThen(() => {
      click('button:contains(Fulfill)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Medication Request Fulfilled', 'Medication Request has been Fulfilled');
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
    assert.dom('.clickable').doesNotExist('Should have 0 completed request');
    visit('/medication');
    click('button:contains(Fulfill)');

    andThen(function() {
      assert.dom('.patient-summary').exists({ count: 1 }, 'Patient summary is displayed');
    });
    waitToAppear('.inventory-location option:contains(No Location)');
    andThen(() => {
      click('button:contains(Fulfill)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Medication Request Fulfilled', 'Medication Request has been Fulfilled');
    });

    click('button:contains(Ok)');
    visit('/medication/completed');
    andThen(() => {
      assert.equal(currentURL(), '/medication/completed');
      assert.dom('.clickable').exists({ count: 1 }, 'Should have 1 completed request');
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
      assert.dom('.modal-title').hasText('Medication Returned', 'Medication has been return successfully');
    });
    click('button:contains(Ok)');

    andThen(() => {
      assert.equal(currentURL(), '/medication');
    });
  });
});

test('Searching medications', function(assert) {
  runWithPouchDump('medication', function() {
    authenticateUser();
    visit('/medication');

    fillIn('[role="search"] div input', 'Biogesic');
    click('.glyphicon-search');

    andThen(() => {
      assert.equal(currentURL(), '/medication/search/Biogesic', 'Searched for Medication Title: Biogesic');
      assert.dom('.clickable').exists({ count: 1 }, 'There is one search item');
    });

    fillIn('[role="search"] div input', 'gesic');
    click('.glyphicon-search');

    andThen(() => {
      assert.equal(currentURL(), '/medication/search/gesic', 'Searched for all lower case gesic');
      assert.dom('.clickable').exists({ count: 1 }, 'There is one search item');
    });

    fillIn('[role="search"] div input', 'hradmin');
    click('.glyphicon-search');

    andThen(() => {
      assert.equal(currentURL(), '/medication/search/hradmin', 'Searched for Prescriber: hradmin');
      assert.notEqual(find('.clickable').length, 0, 'There are one or more search item');
    });

    fillIn('[role="search"] div input', '60 Biogesic Pills');
    click('.glyphicon-search');

    andThen(() => {
      assert.equal(currentURL(), '/medication/search/60%20Biogesic%20Pills', 'Searched for Prescription: 60 Biogesic Pills');
      assert.dom('.clickable').exists({ count: 1 }, 'There is one search item');
    });

    fillIn('[role="search"] div input', 'ItemNotFound');
    click('.glyphicon-search');

    andThen(() => {
      assert.equal(currentURL(), '/medication/search/ItemNotFound', 'Searched for ItemNotFound');
      assert.dom('.clickable').doesNotExist('There is no search result');
    });
  });
});

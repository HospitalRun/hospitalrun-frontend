import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | labs');

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
      assert.dom('.modal-title').hasText('Lab Request Saved', 'Lab Request was saved successfully');
      assert.dom('.patient-summary').exists();
    });

    click('.modal-footer button:contains(Ok)');

    andThen(() => {
      assert.dom('.patient-summary').exists({ count: 1 }, 'Patient summary is displayed');
    });

    click('.panel-footer button:contains(Return)');

    andThen(() => {
      assert.equal(currentURL(), '/labs');
      assert.dom('tr').exists({ count: 3 }, 'Two lab requests are displayed');
    });
  });
});

test('Marking a lab request as completed', function(assert) {
  runWithPouchDump('labs', function() {
    authenticateUser();
    visit('/labs/completed');

    andThen(() => {
      assert.dom('.alert-info').hasText('No completed items found.', 'No completed requests are displayed');
    });

    visit('/labs');
    click('button:contains(Edit)');
    click('button:contains(Complete)');
    waitToAppear('.modal-dialog');

    andThen(function() {
      assert.dom('.modal-title').hasText('Lab Request Completed', 'Lab Request was completed successfully');
    });

    click('.modal-footer button:contains(Ok)');
    click('.panel-footer button:contains(Return)');
    visit('/labs/completed');

    andThen(() => {
      assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');
    });
  });
});

test('Lab with always included custom form', function(assert) {
  runWithPouchDump('labs', function() {
    authenticateUser();

    createCustomFormForType('Lab', true);

    visit('/labs');
    click('button:contains(new lab)');

    checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab included');

    andThen(() => {
      typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
      typeAheadFillIn('.test-lab-type', 'Chest Scan');
      fillIn('.test-result-input input', 'Chest is clear');
      fillIn('.js-lab-notes textarea', 'Dr test ordered another scan');
      fillCustomForm('Test Custom Form for Lab included');
      click('.panel-footer button:contains(Add)');
      waitToAppear('.modal-dialog');
    });

    click('.modal-footer button:contains(Ok)');
    click('.panel-footer button:contains(Return)');

    andThen(() => {
      assert.equal(currentURL(), '/labs');
      assert.dom('tr').exists({ count: 3 }, 'Two lab requests are displayed');
    });

    click('tr:last');

    andThen(() => {
      assert.dom('.test-result-input input').hasValue('Chest is clear', 'There is result');
      assert.dom('.js-lab-notes textarea').hasValue('Dr test ordered another scan', 'There is note');
    });

    checkCustomFormIsFilled(assert, 'Test Custom Form for Lab included');

    click('button:contains(Complete)');
    waitToAppear('.modal-dialog');
    click('.modal-footer button:contains(Ok)');
    click('.panel-footer button:contains(Return)');
    visit('/labs/completed');

    andThen(() => {
      assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');
    });

    click('tr:last');

    checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab included');
  });
});

test('Lab with additional form', function(assert) {
  runWithPouchDump('labs', function() {
    authenticateUser();

    createCustomFormForType('Lab');

    visit('/labs');
    click('button:contains(new lab)');

    attachCustomForm('Test Custom Form for Lab NOT included');
    checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab NOT included');

    andThen(() => {
      typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
      typeAheadFillIn('.test-lab-type', 'Chest Scan');
      fillIn('.test-result-input input', 'Chest is clear');
      fillIn('.js-lab-notes textarea', 'Dr test ordered another scan');
      fillCustomForm('Test Custom Form for Lab NOT included');
      click('.panel-footer button:contains(Add)');
      waitToAppear('.modal-dialog');
    });

    click('.modal-footer button:contains(Ok)');
    click('.panel-footer button:contains(Return)');

    andThen(() => {
      assert.equal(currentURL(), '/labs');
      assert.dom('tr').exists({ count: 3 }, 'Two lab requests are displayed');
    });

    click('tr:last');

    andThen(() => {
      assert.dom('.test-result-input input').hasValue('Chest is clear', 'There is result');
      assert.dom('.js-lab-notes textarea').hasValue('Dr test ordered another scan', 'There is note');
    });

    checkCustomFormIsFilled(assert, 'Test Custom Form for Lab NOT included');

    click('button:contains(Complete)');
    waitToAppear('.modal-dialog');
    click('.modal-footer button:contains(Ok)');
    click('.panel-footer button:contains(Return)');
    visit('/labs/completed');

    andThen(() => {
      assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');
    });

    click('tr:last');

    checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab NOT included');
  });
});

test('Lab with always included custom form and additional form', function(assert) {
  runWithPouchDump('labs', function() {
    authenticateUser();

    createCustomFormForType('Lab', true);
    createCustomFormForType('Lab', false);

    visit('/labs');
    click('button:contains(new lab)');

    checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab included');

    attachCustomForm('Test Custom Form for Lab NOT included');
    checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab NOT included');

    andThen(() => {
      typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
      typeAheadFillIn('.test-lab-type', 'Chest Scan');
      fillIn('.test-result-input input', 'Chest is clear');
      fillIn('.js-lab-notes textarea', 'Dr test ordered another scan');
      fillCustomForm('Test Custom Form for Lab included');
      fillCustomForm('Test Custom Form for Lab NOT included');
      click('.panel-footer button:contains(Add)');
      waitToAppear('.modal-dialog');
    });

    click('.modal-footer button:contains(Ok)');
    click('.panel-footer button:contains(Return)');

    andThen(() => {
      assert.equal(currentURL(), '/labs');
      assert.dom('tr').exists({ count: 3 }, 'Two lab requests are displayed');
    });

    click('tr:last');

    andThen(() => {
      assert.dom('.test-result-input input').hasValue('Chest is clear', 'There is result');
      assert.dom('.js-lab-notes textarea').hasValue('Dr test ordered another scan', 'There is note');
    });

    checkCustomFormIsFilled(assert, 'Test Custom Form for Lab included');
    checkCustomFormIsFilled(assert, 'Test Custom Form for Lab NOT included');

    click('button:contains(Complete)');
    waitToAppear('.modal-dialog');
    click('.modal-footer button:contains(Ok)');
    click('.panel-footer button:contains(Return)');
    visit('/labs/completed');

    andThen(() => {
      assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');
    });

    click('tr:last');

    checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab included');
    checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab NOT included');
  });
});

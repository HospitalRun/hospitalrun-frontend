import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import {
  attachCustomForm,
  createCustomFormForType,
  checkCustomFormIsDisplayed,
  fillCustomForm,
  checkCustomFormIsFilled,
  checkCustomFormIsFilledAndReadonly
} from 'hospitalrun/tests/helpers/scenarios/custom-forms';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';

moduleForAcceptance('Acceptance | labs');

test('visiting /labs', function(assert) {
  return runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/labs');
    assert.equal(currentURL(), '/labs');
    findWithAssert('a:contains(Create a new record?)');
    findWithAssert('button:contains(new lab)');
  });
});

test('Adding a new lab request', function(assert) {
  return runWithPouchDump('labs', async function() {
    await authenticateUser();
    await visit('/labs');

    await click('button:contains(new lab)');
    assert.equal(currentURL(), '/labs/edit/new');

    await typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
    await typeAheadFillIn('.test-lab-type', 'Chest Scan');
    await fillIn('.test-result-input input', 'Chest is clear');
    await fillIn('textarea', 'Dr test ordered another scan');
    await click('button:contains(Add)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Lab Request Saved', 'Lab Request was saved successfully');
    assert.dom('.patient-summary').exists();

    await click('.modal-footer button:contains(Ok)');
    assert.dom('.patient-summary').exists({ count: 1 }, 'Patient summary is displayed');

    await click('.panel-footer button:contains(Return)');
    assert.equal(currentURL(), '/labs');
    assert.dom('tr').exists({ count: 3 }, 'Two lab requests are displayed');
  });
});

test('Marking a lab request as completed', function(assert) {
  return runWithPouchDump('labs', async function() {
    await authenticateUser();
    await visit('/labs/completed');
    assert.dom('.alert-info').hasText('No completed items found.', 'No completed requests are displayed');

    await visit('/labs');
    await click('button:contains(Edit)');
    await click('button:contains(Complete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Lab Request Completed', 'Lab Request was completed successfully');

    await click('.modal-footer button:contains(Ok)');
    await click('.panel-footer button:contains(Return)');
    await visit('/labs/completed');
    assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');
  });
});

test('Lab with always included custom form', function(assert) {
  return runWithPouchDump('labs', async function() {
    await authenticateUser();

    await createCustomFormForType('Lab', true);

    await visit('/labs');
    await click('button:contains(new lab)');

    await checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab included');

    await typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
    await typeAheadFillIn('.test-lab-type', 'Chest Scan');
    await fillIn('.test-result-input input', 'Chest is clear');
    await fillIn('.js-lab-notes textarea', 'Dr test ordered another scan');
    await fillCustomForm('Test Custom Form for Lab included');
    await click('.panel-footer button:contains(Add)');
    await waitToAppear('.modal-dialog');

    await click('.modal-footer button:contains(Ok)');
    await click('.panel-footer button:contains(Return)');

    assert.equal(currentURL(), '/labs');
    assert.dom('tr').exists({ count: 3 }, 'Two lab requests are displayed');

    await click('tr:last');
    assert.dom('.test-result-input input').hasValue('Chest is clear', 'There is result');
    assert.dom('.js-lab-notes textarea').hasValue('Dr test ordered another scan', 'There is note');

    await checkCustomFormIsFilled(assert, 'Test Custom Form for Lab included');

    await click('button:contains(Complete)');
    await waitToAppear('.modal-dialog');
    await click('.modal-footer button:contains(Ok)');
    await click('.panel-footer button:contains(Return)');
    await visit('/labs/completed');

    assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');

    await click('tr:last');

    await checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab included');
  });
});

test('Lab with additional form', function(assert) {
  return runWithPouchDump('labs', async function() {
    await authenticateUser();

    await createCustomFormForType('Lab');

    await visit('/labs');
    await click('button:contains(new lab)');

    await attachCustomForm('Test Custom Form for Lab NOT included');
    await checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab NOT included');

    await typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
    await typeAheadFillIn('.test-lab-type', 'Chest Scan');
    await fillIn('.test-result-input input', 'Chest is clear');
    await fillIn('.js-lab-notes textarea', 'Dr test ordered another scan');
    await fillCustomForm('Test Custom Form for Lab NOT included');
    await click('.panel-footer button:contains(Add)');
    await waitToAppear('.modal-dialog');

    await click('.modal-footer button:contains(Ok)');
    await click('.panel-footer button:contains(Return)');

    assert.equal(currentURL(), '/labs');
    assert.dom('tr').exists({ count: 3 }, 'Two lab requests are displayed');

    await click('tr:last');

    assert.dom('.test-result-input input').hasValue('Chest is clear', 'There is result');
    assert.dom('.js-lab-notes textarea').hasValue('Dr test ordered another scan', 'There is note');

    await checkCustomFormIsFilled(assert, 'Test Custom Form for Lab NOT included');

    await click('button:contains(Complete)');
    await waitToAppear('.modal-dialog');
    await click('.modal-footer button:contains(Ok)');
    await click('.panel-footer button:contains(Return)');
    await visit('/labs/completed');

    assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');

    await click('tr:last');

    await checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab NOT included');
  });
});

test('Lab with always included custom form and additional form', function(assert) {
  return runWithPouchDump('labs', async function() {
    await authenticateUser();

    await createCustomFormForType('Lab', true);
    await createCustomFormForType('Lab', false);

    await visit('/labs');
    await click('button:contains(new lab)');

    await checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab included');

    await attachCustomForm('Test Custom Form for Lab NOT included');
    await checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab NOT included');

    await typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
    await typeAheadFillIn('.test-lab-type', 'Chest Scan');
    await fillIn('.test-result-input input', 'Chest is clear');
    await fillIn('.js-lab-notes textarea', 'Dr test ordered another scan');
    await fillCustomForm('Test Custom Form for Lab included');
    await fillCustomForm('Test Custom Form for Lab NOT included');
    await click('.panel-footer button:contains(Add)');
    await waitToAppear('.modal-dialog');

    await click('.modal-footer button:contains(Ok)');
    await click('.panel-footer button:contains(Return)');

    assert.equal(currentURL(), '/labs');
    assert.dom('tr').exists({ count: 3 }, 'Two lab requests are displayed');

    await click('tr:last');

    assert.dom('.test-result-input input').hasValue('Chest is clear', 'There is result');
    assert.dom('.js-lab-notes textarea').hasValue('Dr test ordered another scan', 'There is note');

    await checkCustomFormIsFilled(assert, 'Test Custom Form for Lab included');
    await checkCustomFormIsFilled(assert, 'Test Custom Form for Lab NOT included');

    await click('button:contains(Complete)');
    await waitToAppear('.modal-dialog');
    await click('.modal-footer button:contains(Ok)');
    await click('.panel-footer button:contains(Return)');
    await visit('/labs/completed');

    assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');

    await click('tr:last');

    await checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab included');
    await checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab NOT included');
  });
});

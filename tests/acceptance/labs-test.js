import { click, fillIn, currentURL, visit, waitUntil, settled as wait } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { default as jquerySelect } from 'hospitalrun/tests/helpers/jquery-select';
import { findWithAssert } from 'ember-native-dom-helpers';
import { setupApplicationTest } from 'ember-qunit';
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
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

module('Acceptance | labs', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /labs', function(assert) {
    return runWithPouchDump('default', async function() {
      await authenticateUser();
      await visit('/labs');
      assert.equal(currentURL(), '/labs');
      findWithAssert(jquerySelect('a:contains(Create a new record?)'));
      findWithAssert(jquerySelect('button:contains(new lab)'));
    });
  });

  test('Adding a new lab request', function(assert) {
    return runWithPouchDump('labs', async function() {
      await authenticateUser();
      await visit('/labs');

      await click(jquerySelect('button:contains(new lab)'));

      await waitUntil(() => currentURL() === "/labs/edit/new");
      assert.equal(currentURL(), '/labs/edit/new');

      await typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
      await typeAheadFillIn('.test-lab-type', 'Chest Scan');
      await fillIn('.test-result-input input', 'Chest is clear');
      await fillIn('textarea', 'Dr test ordered another scan');
      await click(jquerySelect('button:contains(Add)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Lab Request Saved', 'Lab Request was saved successfully');
      assert.dom('.patient-summary').exists();

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      assert.dom('.patient-summary').exists({ count: 1 }, 'Patient summary is displayed');

      await click(jquerySelect('.panel-footer button:contains(Return)'));
      await waitUntil(() => currentURL() === "/labs");

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
      await click(jquerySelect('button:contains(Edit)'));

      await waitUntil(() => currentURL().includes("/labs/edit"));

      await click(jquerySelect('button:contains(Complete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Lab Request Completed', 'Lab Request was completed successfully');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await click(jquerySelect('.panel-footer button:contains(Return)'));

      await visit('/labs/completed');
      assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');
    });
  });

  test('Lab with always included custom form', function(assert) {
    return runWithPouchDump('labs', async function() {
      await authenticateUser();

      await createCustomFormForType('Lab', true);

      await visit('/labs');
      await click(jquerySelect('button:contains(new lab)'));

      await checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab included');

      await typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
      await typeAheadFillIn('.test-lab-type', 'Chest Scan');
      await fillIn('.test-result-input input', 'Chest is clear');
      await fillIn('.js-lab-notes textarea', 'Dr test ordered another scan');
      await fillCustomForm('Test Custom Form for Lab included');
      await click(jquerySelect('.panel-footer button:contains(Add)'));
      await waitToAppear('.modal-dialog');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await click(jquerySelect('.panel-footer button:contains(Return)'));
      await waitUntil(() => currentURL() === "/labs");

      assert.equal(currentURL(), '/labs');
      assert.dom('tr').exists({ count: 3 }, 'Two lab requests are displayed');

      await click(jquerySelect('tr:last'));

      await waitToAppear(".test-result-input input");

      assert.dom('.test-result-input input').hasValue('Chest is clear', 'There is result');
      assert.dom('.js-lab-notes textarea').hasValue('Dr test ordered another scan', 'There is note');

      await checkCustomFormIsFilled(assert, 'Test Custom Form for Lab included');

      await click(jquerySelect('button:contains(Complete)'));
      await waitToAppear('.modal-dialog');
      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await click(jquerySelect('.panel-footer button:contains(Return)'));

      await visit('/labs/completed');
      assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');
      await click(jquerySelect('tr:last'));
      await checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab included');
    });
  });

  test('Lab with additional form', function(assert) {
    return runWithPouchDump('labs', async function() {
      await authenticateUser();

      await createCustomFormForType('Lab');

      await visit('/labs');
      await click(jquerySelect('button:contains(new lab)'));

      await attachCustomForm('Test Custom Form for Lab NOT included');
      await checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab NOT included');

      await typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
      await typeAheadFillIn('.test-lab-type', 'Chest Scan');
      await fillIn('.test-result-input input', 'Chest is clear');
      await fillIn('.js-lab-notes textarea', 'Dr test ordered another scan');
      await fillCustomForm('Test Custom Form for Lab NOT included');
      await click(jquerySelect('.panel-footer button:contains(Add)'));

      await waitToAppear('.modal-dialog');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await click(jquerySelect('.panel-footer button:contains(Return)'));
      await waitUntil(() => currentURL() === "/labs");

      assert.equal(currentURL(), '/labs');
      assert.dom('tr').exists({ count: 3 }, 'Two lab requests are displayed');
      await click(jquerySelect('tr:last'));

      await waitToAppear(".test-result-input input");

      assert.dom('.test-result-input input').hasValue('Chest is clear', 'There is result');
      assert.dom('.js-lab-notes textarea').hasValue('Dr test ordered another scan', 'There is note');

      await checkCustomFormIsFilled(assert, 'Test Custom Form for Lab NOT included');

      await click(jquerySelect('button:contains(Complete)'));
      await waitToAppear('.modal-dialog');
      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await click(jquerySelect('.panel-footer button:contains(Return)'));
      await visit('/labs/completed');

      assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');

      await click(jquerySelect('tr:last'));
      await checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab NOT included');
    });
  });

  test('Lab with always included custom form and additional form', function(assert) {
    return runWithPouchDump('labs', async function() {
      await authenticateUser();

      await createCustomFormForType('Lab', true);
      await createCustomFormForType('Lab', false);

      await visit('/labs');
      await click(jquerySelect('button:contains(new lab)'));

      await checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab included');
      await attachCustomForm('Test Custom Form for Lab NOT included');
      await checkCustomFormIsDisplayed(assert, 'Test Custom Form for Lab NOT included');

      await typeAheadFillIn('.test-patient-name', 'Lennex Zinyando - P00017');
      await typeAheadFillIn('.test-lab-type', 'Chest Scan');
      await fillIn('.test-result-input input', 'Chest is clear');
      await fillIn('.js-lab-notes textarea', 'Dr test ordered another scan');
      await fillCustomForm('Test Custom Form for Lab included');
      await fillCustomForm('Test Custom Form for Lab NOT included');
      await click(jquerySelect('.panel-footer button:contains(Add)'));
      await waitToAppear('.modal-dialog');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await click(jquerySelect('.panel-footer button:contains(Return)'));

      await wait();

      assert.equal(currentURL(), '/labs');
      assert.dom('tr').exists({ count: 3 }, 'Two lab requests are displayed');
      await click(jquerySelect('tr:last'));

      await waitToAppear(".test-result-input input");

      assert.dom('.test-result-input input').hasValue('Chest is clear', 'There is result');
      assert.dom('.js-lab-notes textarea').hasValue('Dr test ordered another scan', 'There is note');

      await checkCustomFormIsFilled(assert, 'Test Custom Form for Lab included');
      await checkCustomFormIsFilled(assert, 'Test Custom Form for Lab NOT included');

      await click(jquerySelect('button:contains(Complete)'));
      await waitToAppear('.modal-dialog');
      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await click(jquerySelect('.panel-footer button:contains(Return)'));
      await visit('/labs/completed');

      assert.dom('tr').exists({ count: 2 }, 'One completed request is displayed');

      await click(jquerySelect('tr:last'));

      await checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab included');
      await checkCustomFormIsFilledAndReadonly(assert, 'Test Custom Form for Lab NOT included');
    });
  });
});

import { click, fillIn, currentURL, visit, waitUntil } from '@ember/test-helpers';
import { findWithAssert } from 'ember-native-dom-helpers';
import { module, test } from 'qunit';
import { default as jquerySelect, jqueryLength } from 'hospitalrun/tests/helpers/jquery-select';
import { setupApplicationTest } from 'ember-qunit';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

module('Acceptance | imaging', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /imaging', function(assert) {
    return runWithPouchDump('default', async function() {
      await authenticateUser();
      await visit('/imaging');

      assert.equal(currentURL(), '/imaging');
      assert.equal(jqueryLength('button:contains(new imaging)'), 1, 'New Imaging button is visible');
      findWithAssert(jquerySelect('p:contains(No items found. )'));
      findWithAssert(jquerySelect('a:contains(Create a new record?)'));

      await click(jquerySelect('button:contains(new imaging)'));
      await waitUntil(() => currentURL() === "/imaging/edit/new");
      assert.equal(currentURL(), '/imaging/edit/new');
    });
  });

  test('create a new imaging request', (assert) => {
    return runWithPouchDump('imaging', async function() {
      await authenticateUser();
      await visit('/imaging/edit/new');
      assert.equal(currentURL(), '/imaging/edit/new');

      await typeAheadFillIn('.patient-input', 'Joe Bagadonuts - P00001');
      await typeAheadFillIn('.imaging-type-input', 'Chest Scan');
      await typeAheadFillIn('.radiologist-input', 'Dr Test');
      await fillIn('.result-input input', 'Check is clear');
      await fillIn('textarea', 'Patient is healthy');
      await click(jquerySelect('button:contains(Add)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Imaging Request Saved', 'Imaging Request was saved successfully');

      await click(jquerySelect('button:contains(Ok)'));
      findWithAssert(jquerySelect('button:contains(Update)'));
      findWithAssert(jquerySelect('button:contains(Return)'));
      findWithAssert(jquerySelect('button:contains(Complete)'));
      assert.dom('.patient-summary').exists({ count: 1 }, 'Patient summary is displayed');

      await click(jquerySelect('button:contains(Return)'));
      await waitUntil(() => currentURL() === "/imaging");
      assert.equal(currentURL(), '/imaging');
      assert.dom('tr').exists({ count: 3 }, 'Two imaging requests are displayed');
    });
  });

  test('completed requests are displayed', (assert) => {
    return runWithPouchDump('imaging', async function() {
      await authenticateUser();
      await visit('/imaging/completed');
      assert.equal(currentURL(), '/imaging/completed');
      assert.dom('.table').exists({ count: 1 }, 'Requests table is visible');
    });
  });

  test('mark an imaging request as completed', (assert) => {
    return runWithPouchDump('imaging', async function() {
      await authenticateUser();
      await visit('/imaging');
      assert.equal(currentURL(), '/imaging');
      assert.dom('.table').exists({ count: 1 }, 'Requests table is visible');
      assert.dom('tr').exists({ count: 2 }, 'One imaging request not completed');

      await click(jquerySelect('button:contains(Edit):first'));

      await waitUntil(() => currentURL() === "/imaging/edit/12DEDA58-4670-7A74-BA8B-9CC5E5CA82E7");
      assert.equal(currentURL(), '/imaging/edit/12DEDA58-4670-7A74-BA8B-9CC5E5CA82E7');

      findWithAssert(jquerySelect('button:contains(Update)'));
      findWithAssert(jquerySelect('button:contains(Return)'));
      findWithAssert(jquerySelect('button:contains(Complete)'));

      await click(jquerySelect('button:contains(Complete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Imaging Request Completed', 'Imaging Request was saved successfully');

      await click(jquerySelect('button:contains(Ok)'));
      await click(jquerySelect('button:contains(Return)'));

      await waitUntil(() => currentURL() === "/imaging");
      assert.equal(currentURL(), '/imaging');

      findWithAssert(jquerySelect('a:contains(Create a new record?)'));
    });
  });
});

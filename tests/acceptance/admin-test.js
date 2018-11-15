import { module, test } from 'qunit';
import { visit, click, fillIn, findAll, currentURL, find } from '@ember/test-helpers';
import jquerySelect from 'hospitalrun/tests/helpers/deprecated-jquery-select';
import { setupApplicationTest } from 'ember-qunit';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import select from 'hospitalrun/tests/helpers/select';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

module('Acceptance | admin', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /admin', function(assert) {
    return runWithPouchDump('admin', async function() {
      await authenticateUser();
      await visit('/admin');
      assert.equal(currentURL(), '/admin');

      await select('.lookup-type', 'Visit Types');
      assert.dom('h3.panel-title').hasText('Visit Types', 'Visit Types header is displayed');
      assert.dom('td.lookup-type-value:first-child').hasText('Admission', 'Admission visit type displays');

      await click(jquerySelect('button:contains(Update)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('List Saved', 'Lookup list is saved');
    });
  });

  test('add, edit new lookup value', function(assert) {
    return runWithPouchDump('admin', async function() {
      await authenticateUser();
      await visit('/admin');
      assert.equal(currentURL(), '/admin');

      await select('.lookup-type', 'Anesthesiologists');
      await click(jquerySelect('button:contains(Add Value)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Add Value', 'Add value modal is displayed');

      await fillIn('.lookup-type-value input', 'Dr Smith');
      await click(jquerySelect('button:contains(Add):last'));
      await waitToAppear(jquerySelect('td.lookup-type-value:contains(Dr Smith)'));
      assert.equal($('td.lookup-type-value:contains(Dr Smith)').length, 1, 'Added lookup type is added to list');
      await waitToAppear('.modal-dialog');
      await click(jquerySelect('button:contains(Ok)'));

      await click(jquerySelect('button:contains(Edit)'));
      await fillIn('.lookup-type-value input', 'Dr Smith2');
      await click(jquerySelect('button:contains(Update):last'));
      await waitToAppear('.modal-dialog');
      await click(jquerySelect('button:contains(Ok)'));
      assert.equal($('td.lookup-type-value').length, 1, 'Still only one lookup type in the list');
      assert.equal($('td.lookup-type-value:contains(Dr Smith2)').length, 1, 'Lookup type changed due to edit operation');
    });
  });

  test('delete lookup value', function(assert) {
    return runWithPouchDump('admin', async function() {
      await authenticateUser();
      await visit('/admin');
      assert.equal(currentURL(), '/admin');

      await select('.lookup-type', 'Anesthesia Types');
      assert.equal($('td.lookup-type-value:contains(Epidural)').length, 1, 'Have lookup type to delete from list');

      await click(jquerySelect('button:contains(Delete)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Delete Value', 'Delete value modal is displayed');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      assert.equal($('td.lookup-type-value:contains(Epidural)').length, 0, 'Deleted lookup type is removed from the list');
    });
  });

  test('Update address options', function(assert) {
    return runWithPouchDump('admin', async function() {
      await authenticateUser();
      await visit('/admin/address');
      assert.equal(currentURL(), '/admin/address');

      await fillIn('input', 'Address Label');
      await click(jquerySelect('button:contains(Update)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Options Saved', 'Address Options Saved');
    });
  });

  test('Update header options', function(assert) {
    return runWithPouchDump('admin', async function() {
      await authenticateUser();
      await visit('/admin/print-header');
      assert.equal(currentURL(), '/admin/print-header');

      await fillIn('input', 'Print Header Label');
      await click(jquerySelect('button:contains(Update)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Options Saved', 'Header Options Saved');
    });
  });

  test('Update workflow options', function(assert) {
    let selector = 'input[type=checkbox]';

    return runWithPouchDump('admin', async function() {
      await authenticateUser();
      await visit('/admin/workflow');
      assert.equal(currentURL(), '/admin/workflow', 'Correctly navigated to admin workflow');

      await setAllTo(false);
      await visit('/admin/workflow');
      await setAllTo(true);
    });

    async function setAllTo(checked) {
      Array.prototype.slice.call(document.querySelectorAll(selector)).forEach((node) => {
        node.checked = checked;
      });
      await click(jquerySelect('button:contains(Update)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Options Saved', 'Workflow Options Saved');
      verifyAll(checked);
    }

    function verifyAll(checked) {
      Array.prototype.slice.call(document.querySelectorAll(selector)).forEach((node) => {
        assert.equal(node.checked, checked, `Checkbox is ${(checked ? 'checked' : 'unchecked')}`);
      });
    }
  });
});

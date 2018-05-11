import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | admin');

test('visiting /admin', function(assert) {
  runWithPouchDump('admin', async function() {
    await authenticateUser();
    await visit('/admin');
    assert.equal(currentURL(), '/admin');

    await select('.lookup-type', 'Visit Types');
    assert.dom('h3.panel-title').hasText('Visit Types', 'Visit Types header is displayed');
    assert.equal(find('td.lookup-type-value:first').text(), 'Admission', 'Admission visit type displays');

    await click('button:contains(Update)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('List Saved', 'Lookup list is saved');
  });
});

test('add new lookup value', function(assert) {
  runWithPouchDump('admin', async function() {
    await authenticateUser();
    await visit('/admin');
    assert.equal(currentURL(), '/admin');

    await select('.lookup-type', 'Anesthesiologists');
    await click('button:contains(Add Value)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Add Value', 'Add value modal is displayed');

    await fillIn('.lookup-type-value input', 'Dr Smith');
    await click('button:contains(Add):last');
    await waitToAppear('td.lookup-type-value:contains(Dr Smith)');
    assert.equal(find('td.lookup-type-value:contains(Dr Smith)').length, 1, 'Added lookup type is added to list');
  });
});

test('delete lookup value', function(assert) {
  runWithPouchDump('admin', async function() {
    await authenticateUser();
    await visit('/admin');
    assert.equal(currentURL(), '/admin');

    await select('.lookup-type', 'Anesthesia Types');
    assert.equal(find('td.lookup-type-value:contains(Epidural)').length, 1, 'Have lookup type to delete from list');

    await click('button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Delete Value', 'Delete value modal is displayed');

    await click('.modal-footer button:contains(Ok)');
    assert.equal(find('td.lookup-type-value:contains(Epidural)').length, 0, 'Deleted lookup type is removed from the list');
  });
});

test('Update address options', function(assert) {
  runWithPouchDump('admin', async function() {
    await authenticateUser();
    await visit('/admin/address');
    assert.equal(currentURL(), '/admin/address');

    await fillIn('input', 'Address Label');
    await click('button:contains(Update)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Options Saved', 'Address Options Saved');
  });
});

test('Update header options', function(assert) {
  runWithPouchDump('admin', async function() {
    await authenticateUser();
    await visit('/admin/print-header');
    assert.equal(currentURL(), '/admin/print-header');

    await fillIn('input', 'Print Header Label');
    await click('button:contains(Update)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Options Saved', 'Header Options Saved');
  });
});

test('Update workflow options', function(assert) {
  let selector = 'input[type=checkbox]';

  runWithPouchDump('admin', async function() {
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
    await click('button:contains(Update)');
    await waitToAppear('.modal-dialog');
    assert.equal(find('.modal-title').text(), 'Options Saved', 'Workflow Options Saved');
    verifyAll(checked);
  }

  function verifyAll(checked) {
    Array.prototype.slice.call(document.querySelectorAll(selector)).forEach((node) => {
      assert.equal(node.checked, checked, `Checkbox is ${(checked ? 'checked' : 'unchecked')}`);
    });
  }
});

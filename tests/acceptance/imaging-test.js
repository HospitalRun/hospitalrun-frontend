import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';

moduleForAcceptance('Acceptance | imaging');

test('visiting /imaging', function(assert) {
  return runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/imaging');
    assert.equal(currentURL(), '/imaging');
    let newImagingButton = find('button:contains(new imaging)');
    assert.equal(newImagingButton.length, 1, 'New Imaging button is visible');
    findWithAssert('p:contains(No items found. )');
    findWithAssert('a:contains(Create a new record?)');

    await click('button:contains(new imaging)');
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
    await click('button:contains(Add)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Imaging Request Saved', 'Imaging Request was saved successfully');

    await click('button:contains(Ok)');
    findWithAssert('button:contains(Update)');
    findWithAssert('button:contains(Return)');
    findWithAssert('button:contains(Complete)');
    assert.dom('.patient-summary').exists({ count: 1 }, 'Patient summary is displayed');

    await click('button:contains(Return)');
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

    await click('button:contains(Edit):first');
    assert.equal(currentURL(), '/imaging/edit/12DEDA58-4670-7A74-BA8B-9CC5E5CA82E7');
    findWithAssert('button:contains(Update)');
    findWithAssert('button:contains(Return)');
    findWithAssert('button:contains(Complete)');

    await click('button:contains(Complete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Imaging Request Completed', 'Imaging Request was saved successfully');

    await click('button:contains(Ok)');
    await click('button:contains(Return)');
    assert.equal(currentURL(), '/imaging');
    findWithAssert('a:contains(Create a new record?)');
  });
});

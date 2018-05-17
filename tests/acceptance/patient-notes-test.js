import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import { waitToAppear, waitToDisappear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

moduleForAcceptance('Acceptance | patient notes');

test('patient notes crud testing', function(assert) {
  return runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/patients/edit/new');
    assert.equal(currentURL(), '/patients/edit/new');

    await fillIn('.test-first-name input', 'John');
    await fillIn('.test-last-name input', 'Doe');
    await click('.panel-footer button:contains(Add)');
    await waitToAppear('.message:contains(The patient record for John Doe has been saved)');
    assert.dom('.message').hasText('The patient record for John Doe has been saved.');

    await waitToAppear('.patient-summary');
    assert.dom('.patient-summary').exists();

    await click('[data-test-selector=visits-tab]');
    assert.dom('#visits').exists();

    await click('button:contains(New Visit)');
    assert.equal(currentURL(), '/visits/edit/new', 'Now in add visiting information route');

    await click('.panel-footer button:contains(Add)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Visit Saved', 'New visit has been saved');

    await click('button:contains(Ok)');
    await click('[data-test-selector=notes-tab]');
    assert.equal(find('button:contains(New Note)').length, 1, 'New Note button in visible');

    await click('button:contains(New Note)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('New Note for John Doe', 'Notes modal appeared');

    await fillIn('.test-note-content textarea', 'This is a note.');
    await fillIn('.test-note-attribution input', 'Dr. Nick');
    await click('.modal-footer button:contains(Add)');
    await waitToDisappear('.modal-dialog');
    await waitToAppear('#visit-notes table tr td:contains(This is a note.)');
    assert.equal(find('#visit-notes table tr td:contains(This is a note.)').length, 1, 'Successfully added note.');

    await click('#visit-notes table tr td button:contains(Edit)');
    await waitToAppear('.modal-dialog');
    await fillIn('.test-note-content textarea', 'This is an updated note.');
    await click('.modal-footer button:contains(Update)');
    await waitToDisappear('.modal-dialog');
    await waitToAppear('#visit-notes table tr td:contains(This is an updated note.)');
    assert.equal(find('#visit-notes table tr td:contains(This is an updated note.)').length, 1, 'Successfully updated note.');

    await click('#visit-notes table tr td button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Delete Note', 'Delete Note modal appeared');

    await click('.modal-footer button:contains(Ok)');
    await waitToDisappear('.modal-dialog');
    assert.equal(find('#visit-notes table tr td:contains(This is an updated note.)').length, 0, 'Successfully deleted note.');
  });
});

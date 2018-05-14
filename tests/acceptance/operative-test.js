import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';

const ADDITIONAL_NOTES = 'Additional Notes here';
const CASE_COMPLEXITY = 7;
const OPERATION_DESCRIPTION = 'Operation Description Goes Here';
const OPERATION_SURGEON = 'Dr Nick';
const PROCEDURE_FIX_ARM = 'fix broken arm';
const PROCEDURE_HIP = 'hip adductor release';

moduleForAcceptance('Acceptance | Operative Plan and Operation Report');

test('Plan and report creation', function(assert) {
  return runWithPouchDump('operative', async function() {
    await authenticateUser();
    await visit('/patients');
    assert.equal(currentURL(), '/patients', 'Patients listing url is correct');

    await click('button:contains(Edit)');
    assert.equal(currentURL(), '/patients/edit/cd572865-dcc0-441e-a2ad-be400dc256da', 'Patient edit URL is correct');
    assert.equal(find('a.primary-diagnosis:contains(Broken Arm)').length, 1, 'Primary diagnosis appears');
    assert.equal(find('a.secondary-diagnosis:contains(Tennis Elbow)').length, 1, 'Secondary diagnosis appears');

    await click('a:contains(Add Operative Plan)');
    await waitToAppear('span.secondary-diagnosis:contains(Tennis Elbow)');
    assert.equal(currentURL(), '/patients/operative-plan/new?forPatientId=cd572865-dcc0-441e-a2ad-be400dc256da', 'New operative plan URL is correct');
    assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'Joe Bagadonuts patient header displays');
    assert.dom('.view-current-title').hasText('New Operative Plan', 'New operative plan title is correct');
    assert.equal(find('span.primary-diagnosis:contains(Broken Arm)').length, 1, 'Primary diagnosis appears as read only');
    assert.equal(find('span.secondary-diagnosis:contains(Tennis Elbow)').length, 1, 'Secondary diagnosis appears as read only');

    await fillIn('.operation-description textarea', OPERATION_DESCRIPTION);
    await typeAheadFillIn('.procedure-description', PROCEDURE_HIP);
    await click('button:contains(Add Procedure)');
    await waitToAppear('.procedure-listing td.procedure-description');
    assert.dom('.procedure-listing td.procedure-description').hasText(PROCEDURE_HIP, 'Added procedure displays in procedure table');

    await typeAheadFillIn('.procedure-description', 'Delete Me');
    await click('button:contains(Add Procedure)');
    await waitToAppear('.procedure-listing td.procedure-description:contains(Delete Me)');
    findWithAssert('.procedure-listing td.procedure-description:contains(Delete Me)');

    await click('.procedure-listing tr:last button:contains(Delete)');
    assert.equal(find('.procedure-listing td.procedure-description:contains(Delete Me)').length, 0, 'Procedure is properly deleted');

    await typeAheadFillIn('.procedure-description', PROCEDURE_FIX_ARM); // Leave typeahead filled in with value to automatically add on save.
    await typeAheadFillIn('.plan-surgeon', OPERATION_SURGEON);
    assert.dom('.plan-status select').hasValue('planned', 'Plan status is set to planned');

    await fillIn('.case-complexity input', CASE_COMPLEXITY);
    await fillIn('.admission-instructions textarea', 'Get blood tests done on admission.');
    await fillIn('.additional-notes textarea', ADDITIONAL_NOTES);
    await click('.panel-footer button:contains(Add)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Plan Saved', 'Plan saved modal displays');

    await click('.modal-footer button:contains(Ok)');
    assert.equal(find('.view-current-title').text(), 'Edit Operative Plan', 'Edit operative plan title is correct');
    assert.equal(find(`.procedure-listing td.procedure-description:contains(${PROCEDURE_FIX_ARM})`).length, 1, 'Procedure from typeahead gets added to procedure list on save');

    await click('button:contains(Return)');
    assert.equal(currentURL(), '/patients/edit/cd572865-dcc0-441e-a2ad-be400dc256da', 'Return goes back to patient screen');
    assert.equal(find('a:contains(Current Operative Plan)').length, 1, 'Link to newly created plan appears');

    await click('a:contains(Current Operative Plan)');
    assert.dom('.view-current-title').hasText('Edit Operative Plan', 'Edit operative plan title is correct');
    assert.equal(find('button:contains(Complete Plan)').length, 1, 'Complete Plan button appears');

    await click('button:contains(Complete Plan)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Plan Completed', 'Plan completed modal displays');

    await click('.modal-footer button:contains(Ok)');
    assert.dom('.view-current-title').hasText('Edit Operation Report', 'Edit Operation Report title is correct');
    assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'Joe Bagadonuts patient header displays');
    assert.equal(find('a.primary-diagnosis:contains(Broken Arm)').length, 1, 'Primary diagnosis appears as editable');
    assert.equal(find('a.secondary-diagnosis:contains(Tennis Elbow)').length, 1, 'Secondary diagnosis appears as  editable');
    assert.equal(find('.operation-description textarea').val(), OPERATION_DESCRIPTION, 'Operation description is copied from operative plan');
    assert.equal(find('.operation-surgeon .tt-input').val(), OPERATION_SURGEON, 'Surgeon is copied from operative plan');
    assert.equal(find('.case-complexity input').val(), CASE_COMPLEXITY, 'Case complexity is copied from operative plan');
    assert.equal(find(`.procedure-listing td.procedure-description:contains(${PROCEDURE_HIP})`).length, 1, `Procedure ${PROCEDURE_HIP} is copied from operative plan`);
    assert.equal(find(`.procedure-listing td.procedure-description:contains(${PROCEDURE_FIX_ARM})`).length, 1, `Procedure ${PROCEDURE_FIX_ARM} is copied from operative plan`);

    await typeAheadFillIn('.operation-assistant', 'Dr Cindy');
    await click('.panel-footer button:contains(Update)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Report Saved', 'Report Saved modal displays');

    await click('.modal-footer button:contains(Ok)');
    await click('button:contains(Return)');
    assert.equal(currentURL(), '/patients/edit/cd572865-dcc0-441e-a2ad-be400dc256da', 'Patient edit URL is correct');
    assert.equal(find('a.patient-procedure:contains(fix broken arm)').length, 1, 'Procedure/operative report shows on patient header');

    await click('a.patient-procedure:contains(fix broken arm)');
    assert.dom('.view-current-title').hasText('Edit Operation Report', 'Operation Report appears for editing');
  });
});

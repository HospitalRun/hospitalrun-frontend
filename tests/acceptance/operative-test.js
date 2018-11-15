import { click, fillIn, find, currentURL, visit } from '@ember/test-helpers';
import { findWithAssert } from 'ember-native-dom-helpers';
import jquerySelect from 'hospitalrun/tests/helpers/deprecated-jquery-select';
import jqueryLength from 'hospitalrun/tests/helpers/deprecated-jquery-length';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

const ADDITIONAL_NOTES = 'Additional Notes here';
const CASE_COMPLEXITY = 7;
const OPERATION_DESCRIPTION = 'Operation Description Goes Here';
const OPERATION_SURGEON = 'Dr Nick';
const PROCEDURE_FIX_ARM = 'fix broken arm';
const PROCEDURE_HIP = 'hip adductor release';

module('Acceptance | Operative Plan and Operation Report', function(hooks) {
  setupApplicationTest(hooks);

  test('Plan and report creation', function(assert) {
    return runWithPouchDump('operative', async function() {
      await authenticateUser();
      await visit('/patients');
      assert.equal(currentURL(), '/patients', 'Patients listing url is correct');

      await click(jquerySelect('button:contains(Edit)'));
      assert.equal(currentURL(), '/patients/edit/cd572865-dcc0-441e-a2ad-be400dc256da', 'Patient edit URL is correct');
      assert.equal(jqueryLength('a.primary-diagnosis:contains(Broken Arm)'), 1, 'Primary diagnosis appears');
      assert.equal(jqueryLength('a.secondary-diagnosis:contains(Tennis Elbow)'), 1, 'Secondary diagnosis appears');

      await click(jquerySelect('a:contains(Add Operative Plan)'));
      await waitToAppear('span.secondary-diagnosis:contains(Tennis Elbow)');
      assert.equal(currentURL(), '/patients/operative-plan/new?forPatientId=cd572865-dcc0-441e-a2ad-be400dc256da', 'New operative plan URL is correct');
      assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'Joe Bagadonuts patient header displays');
      assert.dom('.view-current-title').hasText('New Operative Plan', 'New operative plan title is correct');
      assert.equal(jqueryLength('span.primary-diagnosis:contains(Broken Arm)'), 1, 'Primary diagnosis appears as read only');
      assert.equal(jqueryLength('span.secondary-diagnosis:contains(Tennis Elbow)'), 1, 'Secondary diagnosis appears as read only');

      await fillIn('.operation-description textarea', OPERATION_DESCRIPTION);
      await typeAheadFillIn('.procedure-description', PROCEDURE_HIP);
      await click(jquerySelect('button:contains(Add Procedure)'));
      await waitToAppear('.procedure-listing td.procedure-description');
      assert.dom('.procedure-listing td.procedure-description').hasText(PROCEDURE_HIP, 'Added procedure displays in procedure table');

      await typeAheadFillIn('.procedure-description', 'Delete Me');
      await click(jquerySelect('button:contains(Add Procedure)'));
      await waitToAppear('.procedure-listing td.procedure-description:contains(Delete Me)');
      findWithAssert(jquerySelect('.procedure-listing td.procedure-description:contains(Delete Me)'));

      await click(jquerySelect('.procedure-listing tr:last button:contains(Delete)'));
      assert.equal(jqueryLength('.procedure-listing td.procedure-description:contains(Delete Me)'), 0, 'Procedure is properly deleted');

      await typeAheadFillIn('.procedure-description', PROCEDURE_FIX_ARM); // Leave typeahead filled in with value to automatically add on save.
      await typeAheadFillIn('.plan-surgeon', OPERATION_SURGEON);
      assert.dom('.plan-status select').hasValue('planned', 'Plan status is set to planned');

      await fillIn('.case-complexity input', CASE_COMPLEXITY);
      await fillIn('.admission-instructions textarea', 'Get blood tests done on admission.');
      await fillIn('.additional-notes textarea', ADDITIONAL_NOTES);
      await click(jquerySelect('.panel-footer button:contains(Add)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Plan Saved', 'Plan saved modal displays');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      assert.equal(find('.view-current-title').textContent, 'Edit Operative Plan', 'Edit operative plan title is correct');
      assert.equal(jqueryLength(
        `.procedure-listing td.procedure-description:contains(${PROCEDURE_FIX_ARM})`
      ), 1, 'Procedure from typeahead gets added to procedure list on save');

      await click(jquerySelect('button:contains(Return)'));
      assert.equal(currentURL(), '/patients/edit/cd572865-dcc0-441e-a2ad-be400dc256da', 'Return goes back to patient screen');
      assert.equal(jqueryLength('a:contains(Current Operative Plan)'), 1, 'Link to newly created plan appears');

      await click(jquerySelect('a:contains(Current Operative Plan)'));
      assert.dom('.view-current-title').hasText('Edit Operative Plan', 'Edit operative plan title is correct');
      assert.equal(jqueryLength('button:contains(Complete Plan)'), 1, 'Complete Plan button appears');

      await click(jquerySelect('button:contains(Complete Plan)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Plan Completed', 'Plan completed modal displays');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      assert.dom('.view-current-title').hasText('Edit Operation Report', 'Edit Operation Report title is correct');
      assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'Joe Bagadonuts patient header displays');
      assert.equal(jqueryLength('a.primary-diagnosis:contains(Broken Arm)'), 1, 'Primary diagnosis appears as editable');
      assert.equal(jqueryLength('a.secondary-diagnosis:contains(Tennis Elbow)'), 1, 'Secondary diagnosis appears as  editable');
      assert.equal(find('.operation-description textarea').value, OPERATION_DESCRIPTION, 'Operation description is copied from operative plan');
      assert.equal(find('.operation-surgeon .tt-input').value, OPERATION_SURGEON, 'Surgeon is copied from operative plan');
      assert.equal(find('.case-complexity input').value, CASE_COMPLEXITY, 'Case complexity is copied from operative plan');
      assert.equal(jqueryLength(`.procedure-listing td.procedure-description:contains(${PROCEDURE_HIP})`), 1, `Procedure ${PROCEDURE_HIP} is copied from operative plan`);
      assert.equal(jqueryLength(
        `.procedure-listing td.procedure-description:contains(${PROCEDURE_FIX_ARM})`
      ), 1, `Procedure ${PROCEDURE_FIX_ARM} is copied from operative plan`);

      await typeAheadFillIn('.operation-assistant', 'Dr Cindy');
      await click(jquerySelect('.panel-footer button:contains(Update)'));
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Report Saved', 'Report Saved modal displays');

      await click(jquerySelect('.modal-footer button:contains(Ok)'));
      await click(jquerySelect('button:contains(Return)'));
      assert.equal(currentURL(), '/patients/edit/cd572865-dcc0-441e-a2ad-be400dc256da', 'Patient edit URL is correct');
      assert.equal(jqueryLength('a.patient-procedure:contains(fix broken arm)'), 1, 'Procedure/operative report shows on patient header');

      await click(jquerySelect('a.patient-procedure:contains(fix broken arm)'));
      assert.dom('.view-current-title').hasText('Edit Operation Report', 'Operation Report appears for editing');
    });
  });
});

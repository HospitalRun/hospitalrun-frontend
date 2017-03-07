import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

const ADDITIONAL_NOTES = 'Additional Notes here';
const CASE_COMPLEXITY = 7;
const OPERATION_DESCRIPTION = 'Operation Description Goes Here';
const OPERATION_SURGEON = 'Dr Nick';
const PROCEDURE_FIX_ARM = 'fix broken arm';
const PROCEDURE_HIP = 'hip adductor release';

module('Acceptance | Operative Plan and Operation Report', {
  beforeEach() {
    this.application = startApp();
  },

  afterEach() {
    Ember.run(this.application, 'destroy');
  }
});

test('Plan and report creation', function(assert) {
  runWithPouchDump('patient', function() {
    authenticateUser();
    visit('/patients');
    andThen(() =>{
      assert.equal(currentURL(), '/patients', 'Patients listing url is correct');
      click('button:contains(Edit)');
    });
    andThen(() =>{
      assert.equal(currentURL(), '/patients/edit/C87BFCB2-F772-7A7B-8FC7-AD00C018C32A', 'Patient edit URL is correct');
      click('a:contains(Add Diagnosis)');
      waitToAppear('.modal-dialog');
    });
    andThen(() =>{
      assert.equal(find('.modal-title').text(), 'Add Diagnosis', 'Add Diagnosis dialog displays');
      fillIn('.diagnosis-text input', 'Broken Arm');
      click('.modal-footer button:contains(Add)');
    });
    andThen(() => {
      waitToDisappear('.modal-dialog');
      waitToAppear('a.primary-diagnosis');
    });
    andThen(() =>{
      assert.equal(find('a.primary-diagnosis:contains(Broken Arm)').length, 1, 'New primary diagnosis appears');
      click('a:contains(Add Diagnosis)');
      waitToAppear('.modal-dialog');
    });
    andThen(() =>{
      assert.equal(find('.modal-title').text(), 'Add Diagnosis', 'Add Diagnosis dialog displays');
      fillIn('.diagnosis-text input', 'Tennis Elbow');
      click('.secondary-diagnosis input');
      click('.modal-footer button:contains(Add)');
    });
    andThen(() => {
      waitToDisappear('.modal-dialog');
      waitToAppear('a.secondary-diagnosis:contains(Tennis Elbow)');
    });
    andThen(() =>{
      assert.equal(find('a.secondary-diagnosis:contains(Tennis Elbow)').length, 1, 'New secondary diagnosis appears');
      click('a:contains(Add Operative Plan)');
      waitToAppear('span.secondary-diagnosis:contains(Tennis Elbow)');
    });
    andThen(() =>{
      assert.equal(currentURL(), '/patients/operative-plan/new?forPatientId=C87BFCB2-F772-7A7B-8FC7-AD00C018C32A', 'New operative plan URL is correct');
      assert.equal(find('.patient-name .ps-info-data').text(), 'Joe Bagadonuts', 'Joe Bagadonuts patient header displays');
      assert.equal(find('.view-current-title').text(), 'New Operative Plan', 'New operative plan title is correct');
      assert.equal(find('span.primary-diagnosis:contains(Broken Arm)').length, 1, 'Primary diagnosis appears as read only');
      assert.equal(find('span.secondary-diagnosis:contains(Tennis Elbow)').length, 1, 'Secondary diagnosis appears as read only');
      fillIn('.operation-description textarea', OPERATION_DESCRIPTION);
      typeAheadFillIn('.procedure-description', PROCEDURE_HIP);
      click('button:contains(Add Procedure)');
      waitToAppear('.procedure-listing td.procedure-description');
    });
    andThen(() =>{
      assert.equal(find('.procedure-listing td.procedure-description').text(), PROCEDURE_HIP, 'Added procedure displays in procedure table');
      typeAheadFillIn('.procedure-description', 'Delete Me');
      click('button:contains(Add Procedure)');
      waitToAppear('.procedure-listing td.procedure-description:contains(Delete Me)');
    });
    andThen(() =>{
      findWithAssert('.procedure-listing td.procedure-description:contains(Delete Me)');
      click('.procedure-listing tr:last button:contains(Delete)');
    });
    andThen(() =>{
      assert.equal(find('.procedure-listing td.procedure-description:contains(Delete Me)').length, 0, 'Procedure is properly deleted');
      typeAheadFillIn('.procedure-description', PROCEDURE_FIX_ARM); // Leave typeahead filled in with value to automatically add on save.
      typeAheadFillIn('.plan-surgeon', OPERATION_SURGEON);
      assert.equal(find('.plan-status select').val(), 'planned', 'Plan status is set to planned');
      fillIn('.case-complexity input', CASE_COMPLEXITY);
      fillIn('.admission-instructions textarea', 'Get blood tests done on admission.');
      fillIn('.additional-notes textarea', ADDITIONAL_NOTES);
    });
    andThen(() =>{
      click('.panel-footer button:contains(Add)');
      waitToAppear('.modal-dialog');
    });
    andThen(() =>{
      assert.equal(find('.modal-title').text(), 'Plan Saved', 'Plan saved modal displays');
      click('.modal-footer button:contains(Ok)');
    });
    andThen(() =>{
      assert.equal(find(`.procedure-listing td.procedure-description:contains(${PROCEDURE_FIX_ARM})`).length, 1, 'Procedure from typeahead gets added to procedure list on save');
      click('button:contains(Return)');
    });
    andThen(() =>{
      assert.equal(currentURL(), '/patients/edit/C87BFCB2-F772-7A7B-8FC7-AD00C018C32A', 'Return goes back to patient screen');
      assert.equal(find('a:contains(Current Operative Plan)').length, 1, 'Link to newly created plan appears');
      click('a:contains(Current Operative Plan)');
    });
    andThen(() =>{
      assert.equal(find('.view-current-title').text(), 'Edit Operative Plan', 'Edit operative plan title is correct');
      assert.equal(find('button:contains(Complete Plan)').length, 1, 'Complete Plan button appears');
      click('button:contains(Complete Plan)');
      waitToAppear('.modal-dialog');
    });
    andThen(() =>{
      assert.equal(find('.modal-title').text(), 'Plan Completed', 'Plan completed modal displays');
      click('.modal-footer button:contains(Ok)');
    });
    andThen(() =>{
      assert.equal(find('.view-current-title').text(), 'Edit Operation Report', 'Edit Operation Report title is correct');
      assert.equal(find('.patient-name .ps-info-data').text(), 'Joe Bagadonuts', 'Joe Bagadonuts patient header displays');
      assert.equal(find('a.primary-diagnosis:contains(Broken Arm)').length, 1, 'Primary diagnosis appears as editable');
      assert.equal(find('a.secondary-diagnosis:contains(Tennis Elbow)').length, 1, 'Secondary diagnosis appears as  editable');
      assert.equal(find('.operation-description textarea').val(), OPERATION_DESCRIPTION, 'Operation description is copied from operative plan');
      assert.equal(find('.operation-surgeon .tt-input').val(), OPERATION_SURGEON, 'Surgeon is copied from operative plan');
      assert.equal(find('.case-complexity input').val(), CASE_COMPLEXITY, 'Case complexity is copied from operative plan');
      assert.equal(find(`.procedure-listing td.procedure-description:contains(${PROCEDURE_HIP})`).length, 1, `Procedure ${PROCEDURE_HIP} is copied from operative plan`);
      assert.equal(find(`.procedure-listing td.procedure-description:contains(${PROCEDURE_FIX_ARM})`).length, 1, `Procedure ${PROCEDURE_FIX_ARM} is copied from operative plan`);
      typeAheadFillIn('.operation-assistant', 'Dr Cindy');
      click('.panel-footer button:contains(Update)');
      waitToAppear('.modal-dialog');
    });
    andThen(() =>{
      assert.equal(find('.modal-title').text(), 'Report Saved', 'Report Saved modal displays');
      click('.modal-footer button:contains(Ok)');
    });
    andThen(() =>{
      click('button:contains(Return)');
    });
    andThen(() =>{
      assert.equal(currentURL(), '/patients/edit/C87BFCB2-F772-7A7B-8FC7-AD00C018C32A', 'Patient edit URL is correct');
      assert.equal(find('a.patient-procedure:contains(fix broken arm)').length, 1, 'Procedure/operative report shows on patient header');
      click('a.patient-procedure:contains(fix broken arm)');
    });
    andThen(() =>{
      assert.equal(find('.view-current-title').text(), 'Edit Operation Report', 'Operation Report appears for editing');
    });
  });
});

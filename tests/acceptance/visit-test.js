import { isEmpty } from '@ember/utils';
import moment from 'moment';
import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

const LOCATION = 'Springfield Hospital';
const EXAMINER = 'Sarah Kearney';
const PRIMARY_DIAGNOSIS = 'ACL deficient knee, right';
const SECONDARY_DIAGNOSIS = 'ACL deficient knee, left';
const OPERATION_DESCRIPTION = 'Describe Operation here';
const PROCEDURE_SPLINT = 'application of long arm post splint';
const ADMISSION_INSTRUCTIONS = 'Admission Instructions here';
const OPD_PROCEDURE_DESCRIPTION = 'Bilateral knee Release';
const OPD_PROCEDURE_PHYSICIAN = 'Sarah Kearney';
const LAB_TYPE = 'Cholesterol';
const IMAGING_TYPE = 'Cervical Spine AP-L';
const APPOINTMENT_START_DATE = moment().add(7, 'days').format('l h =mm A');
const APPOINTMENT_END_DATE = moment().add(8, 'days').format('l h =mm A');
const NOTE_CONTENT = 'OPD notes are entered here';
const PATIENT = 'Joe Bagadonuts';
const PATIENT_ID = 'P00001';

const opdReportTestCases = {
  'Add OPD visit': {},
  'OPD report with always included custom form': {
    customForms: [{ type: 'Lab', alwaysIncluded: true, name: 'Test Custom Form for Lab included' }]
  },
  'OPD report with a custom form': {
    customForms: [{ type: 'Lab', alwaysIncluded: false, name: 'Test Custom Form for Lab NOT included' }]
  },
  'OPD report with always included and regular custom forms': {
    customForms: [
      { type: 'Lab', alwaysIncluded: true, name: 'Test Custom Form for Lab included' },
      { type: 'Lab', alwaysIncluded: false, name: 'Test Custom Form for Lab NOT included' }
    ]
  }
};

moduleForAcceptance('Acceptance | visits');

test('Add admission visit', function(assert) {
  runWithPouchDump('patient', function() {
    authenticateUser();
    addVisit(assert);
    andThen(() => {
      addAdmissionData(assert);
    });
    andThen(() => {
      newReport(assert, 'Discharge');
    });
    andThen(() => {
      checkDischargeReport(assert);
    });
    andThen(() => {
      saveReport(assert, 'Discharge');
    });
    andThen(() => {
      viewReport(assert, 'Discharge');
    });
  });
});

for (let testCase in opdReportTestCases) {
  test(testCase, function(assert) {
    runWithPouchDump('patient', function() {
      authenticateUser();

      (opdReportTestCases[testCase].customForms || []).forEach((f) => {
        createCustomFormForType(f.type, f.alwaysIncluded);
      });

      addVisit(assert, 'Clinic');
      andThen(() => {
        addOutpatientData(assert, opdReportTestCases[testCase]);
      });
      andThen(() => {
        newReport(assert, 'OPD');
      });
      andThen(() => {
        checkOPDReport(assert);
      });
      andThen(() => {
        saveReport(assert, 'OPD');
      });
      andThen(() => {
        viewReport(assert, 'OPD', opdReportTestCases[testCase]);
      });
    });
  });
}

test('Edit visit', function(assert) {
  runWithPouchDump('patient', function() {
    authenticateUser();
    visit('/patients');
    andThen(function() {
      assert.equal(currentURL(), '/patients', 'Patient url is correct');
      click('button:contains(Edit)');
    });
    andThen(function() {
      assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'Joe Bagadonuts patient record displays');
      click('[data-test-selector=visits-tab]');
      waitToAppear('#visits button:contains(Edit)');
    });
    andThen(function() {
      click('#visits button:contains(Edit)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/visits/edit/03C7BF8B-04E0-DD9E-9469-96A5604F5340', 'Visit url is correct');
      click('a:contains(Add Allergy)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('Add Allergy', 'Add Allergy dialog displays');
      fillIn('.test-allergy input', 'Oatmeal');
      click('.modal-footer button:contains(Add)');
      waitToDisappear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('a.allergy-button:contains(Oatmeal)').length, 1, 'New allergy appears');
      click('a:contains(Add Diagnosis)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('Add Diagnosis', 'Add Diagnosis dialog displays');
      fillIn('.diagnosis-text input', 'Broken Arm');
      click('.modal-footer button:contains(Add)');
      waitToAppear('a.primary-diagnosis');
    });
    andThen(function() {
      assert.equal(find('a.primary-diagnosis:contains(Broken Arm)').length, 1, 'New primary diagnosis appears');
      click('button:contains(New Medication)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/medication/edit/new?forVisitId=03C7BF8B-04E0-DD9E-9469-96A5604F5340', 'New medication url is correct');
      assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'New medication prepopulates with patient');
      click('button:contains(Cancel)');
    });
    andThen(function() {
      click('button:contains(New Lab)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/labs/edit/new?forVisitId=03C7BF8B-04E0-DD9E-9469-96A5604F5340', 'New lab url is correct');
      assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'New lab prepopulates with patient');
      click('button:contains(Cancel)');
    });
    andThen(function() {
      click('button:contains(New Imaging)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/imaging/edit/new?forVisitId=03C7BF8B-04E0-DD9E-9469-96A5604F5340', 'New imaging url is correct');
      assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'New imaging prepopulates with patient');
      click('button:contains(Cancel)');
    });
    andThen(function() {
      click('button:contains(New Vitals)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      fillIn('.temperature-text input', '34.56');
      fillIn('.weight-text input', '34.56');
      fillIn('.height-text input', '34.56');
      fillIn('.sbp-text input', '34.56');
      fillIn('.dbp-text input', '34.56');
      fillIn('.heart-rate-text input', '34.56');
      fillIn('.respiratory-rate-text input', '34.56');
      click('.modal-footer button:contains(Add)');
      waitToAppear('#visit-vitals tr:last td:contains(34.56)');
    });
    andThen(function() {
      assert.equal(find('#visit-vitals tr:last td:contains(34.56)').length, 7, 'New vitals appears');
      click('button:contains(Add Item)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      typeAheadFillIn('.charge-item-name', 'Gauze pad');
      click('.modal-footer button:contains(Add)');
    });
    andThen(function() {
      waitToDisappear('.modal-dialog');
      waitToAppear('td.charge-item-name');
    });
    andThen(function() {
      assert.dom('td.charge-item-name').hasText('Gauze pad', 'New charge item appears');
    });
    andThen(function() {
      updateVisit(assert, 'Update');
    });
    andThen(function() {
      click('a.primary-diagnosis:contains(Broken Arm)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('Edit Diagnosis', 'Edit Diagnosis modal appears');
      assert.equal(find('.modal-footer button:contains(Delete)').length, 1, 'Delete button appears');
    });
    andThen(function() {
      click('.modal-footer button:contains(Delete)');
    });
    andThen(function() {
      waitToDisappear('.modal-dialog');
    });
    andThen(function() {
      click('#visit-vitals tr:last button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('Delete Vitals', 'Delete Vitals dialog displays');
      click('.modal-footer button:contains(Delete)');
      click('[data-test-selector=charges-tab]');
    });
    andThen(function() {
      click('.charge-items tr:last button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('Delete Charge Item', 'Delete Charge Item dialog displays');
      click('.modal-footer button:contains(Ok)');
    });
    andThen(function() {
      waitToDisappear('.modal-dialog');
    });
    andThen(function() {
      assert.equal(find('a.primary-diagnosis:contains(Broken Arm)').length, 0, 'New primary diagnosis is deleted');
      assert.equal(find('#visit-vitals tr:last td:contains(34.56)').length, 0, 'Vital is deleted');
      assert.dom('td.charge-item-name').doesNotExist('Charge item is deleted');
    });
  });
});

test('Delete visit', function(assert) {
  runWithPouchDump('patient', function() {
    authenticateUser();
    visit('/patients');
    andThen(function() {
      assert.equal(currentURL(), '/patients', 'Patient url is correct');
      click('button:contains(Edit)');
    });
    andThen(function() {
      assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'Joe Bagadonuts patient record displays');
      click('[data-test-selector=visits-tab]');
      waitToAppear('#visits button:contains(Delete)'); // Make sure visits have been retrieved.
    });
    andThen(function() {
      assert.dom('#visits tr').exists({ count: 2 }, 'One visit is displayed to delete');
      click('#visits button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('Delete Visit', 'Delete Visit confirmation displays');
      click('.modal-footer button:contains(Delete)');
    });
    andThen(function() {
      waitToDisappear('.modal-dialog');
      waitToDisappear('#visits td:contains(Fall from in-line roller-skates, initial encounter)');
    });
    andThen(function() {
      assert.dom('#visits tr').exists({ count: 1 }, 'Visit is deleted');
    });
  });
});

function addVisit(assert, type) {
  visit('/patients');
  andThen(function() {
    assert.equal(currentURL(), '/patients', 'Patient url is correct');
    click('button:contains(Edit)');
  });
  andThen(function() {
    assert.dom('.patient-name .ps-info-data').hasText(PATIENT, `${PATIENT} patient record displays`);
    click('[data-test-selector=visits-tab]');
    waitToAppear('#visits button:contains(Edit)');
  });
  andThen(function() {
    click('#visits button:contains(New Visit)');
    waitToAppear('#visit-info');
  });
  andThen(function() {
    assert.dom('.patient-name .ps-info-data').hasText(PATIENT, `${PATIENT} displays as patient for visit`);
    updateVisit(assert, 'Add', type);
  });
}

function addOutpatientData(assert, testCase) {
  typeAheadFillIn('.visit-location', LOCATION);
  typeAheadFillIn('.visit-examiner', EXAMINER);
  andThen(() => {
    click('a:contains(Add Diagnosis)');
    waitToAppear('.modal-dialog');
  });
  andThen(() => {
    assert.dom('.modal-title').hasText('Add Diagnosis', 'Add Diagnosis dialog displays');
    fillIn('.diagnosis-text input', PRIMARY_DIAGNOSIS);
    click('.modal-footer button:contains(Add)');
  });
  andThen(function() {
    waitToDisappear('.modal-dialog');
  });
  andThen(() => {
    click('a:contains(Add Diagnosis)');
    waitToAppear('.modal-dialog');
  });
  andThen(() => {
    assert.dom('.modal-title').hasText('Add Diagnosis', 'Add Diagnosis dialog displays');
    fillIn('.diagnosis-text input', SECONDARY_DIAGNOSIS);
    click('.secondary-diagnosis input');
  });
  andThen(() => {
    click('.modal-footer button:contains(Add)');
  });
  andThen(function() {
    waitToDisappear('.modal-dialog');
    waitToAppear(`a.secondary-diagnosis:contains(${SECONDARY_DIAGNOSIS})`);
  });
  andThen(() => {
    click('a:contains(Add Operative Plan)');
  });
  andThen(() => {
    assert.ok(currentURL().indexOf('/patients/operative-plan/new?forVisitId') > -1, 'New operative plan URL is visited');
    assert.dom('.patient-name .ps-info-data').hasText(PATIENT, `${PATIENT} patient header displays`);
    assert.dom('.view-current-title').hasText('New Operative Plan', 'New operative plan title is correct');
    fillIn('.operation-description textarea', OPERATION_DESCRIPTION);
    typeAheadFillIn('.procedure-description', PROCEDURE_SPLINT);
    click('button:contains(Add Procedure)');
    waitToAppear('.procedure-listing td.procedure-description');
    fillIn('.admission-instructions textarea', ADMISSION_INSTRUCTIONS);
  });
  updateVisitData(assert, 'Plan Saved');
  andThen(() => {
    click('[data-test-selector=procedures-tab]');
    waitToAppear('[data-test-selector=new-procedure-btn]');
    assert.dom('[data-test-selector=new-procedure-btn]').hasText('New Procedure', 'New Procedure button displayed');
    click('[data-test-selector=new-procedure-btn]');
  });
  andThen(() => {
    assert.ok(currentURL().indexOf('visits/procedures/edit/new?forVisitId') > -1, 'New Procedures URL is visited');
    typeAheadFillIn('.procedure-description', OPD_PROCEDURE_DESCRIPTION);
    typeAheadFillIn('.procedure-physician', OPD_PROCEDURE_PHYSICIAN);
  });
  updateVisitData(assert, 'Procedure Saved');
  andThen(() => {
    click('button:contains(New Lab)');
  });
  andThen(() => {
    assert.ok(currentURL().indexOf('/labs/edit/new?forVisitId') > -1, 'New Lab URL is visited');
    typeAheadFillIn('.test-lab-type', LAB_TYPE);
    (testCase.customForms || []).forEach((f) => {
      if (!f.alwaysIncluded) {
        attachCustomForm(f.name);
      }
      fillCustomForm(f.name);
    });
  });
  updateVisitData(assert, 'Lab Request Saved');
  andThen(() => {
    click('button:contains(New Imaging)');
  });
  andThen(() => {
    assert.ok(currentURL().indexOf('/imaging/edit/new?forVisitId') > -1, 'New Imaging URL is visited');
    typeAheadFillIn('.imaging-type-input', IMAGING_TYPE);
  });
  updateVisitData(assert, 'Imaging Request Saved');
  andThen(() => {
    click('button:contains(New Appointment)');
  });
  andThen(() => {
    assert.ok(currentURL().indexOf('/appointments/edit/new?forVisitId') > -1, 'New Appointment URL is visited');
    click('.appointment-all-day input');
    fillIn('.test-appointment-start input', APPOINTMENT_START_DATE);
    fillIn('.test-appointment-end input', APPOINTMENT_END_DATE);
  });
  updateVisitData(assert, 'Appointment Saved');
  andThen(function() {
    click('[data-test-selector=notes-tab]');
    waitToAppear('[data-test-selector=new-note-btn]');
    click('[data-test-selector=new-note-btn]');
  });
  andThen(() => {
    assert.dom('.modal-title').hasText(`New Note for ${PATIENT}`, 'New Note dialog displays');
    fillIn('.test-note-content textarea', NOTE_CONTENT);
    click('.modal-footer button:contains(Add)');
  });
  andThen(function() {
    waitToDisappear('.modal-dialog');
  });
  andThen(() => {
    assert.ok(currentURL().indexOf('visits/edit/') > -1, 'Returns back to visit URL');
  });
}

function addAdmissionData(assert) {
  typeAheadFillIn('.visit-examiner', EXAMINER);
  andThen(function() {
    click('[data-test-selector=notes-tab]');
    waitToAppear('[data-test-selector=new-note-btn]');
    click('[data-test-selector=new-note-btn]');
  });
  andThen(() => {
    assert.dom('.modal-title').hasText('New Note for Joe Bagadonuts', 'New Note dialog displays');
    fillIn('.test-note-content textarea', NOTE_CONTENT);
    click('.modal-footer button:contains(Add)');
  });
  andThen(function() {
    waitToDisappear('.modal-dialog');
  });
  andThen(() => {
    assert.ok(currentURL().indexOf('visits/edit/') > -1, 'Returns back to visit URL');
  });
}

function newReport(assert, type) {
  andThen(function() {
    click('[data-test-selector=reports-tab]');
    waitToAppear('[data-test-selector=report-btn]');
    assert.dom('[data-test-selector=report-btn]').hasText(
      `New ${type} Report`,
      'Discharge report can be created for this type of visit'
    );
    click('[data-test-selector=report-btn]');
  });
  andThen(function() {
    assert.ok(currentURL().indexOf('visits/reports/edit/new') > -1, 'Report url is correct');
    assert.dom('.view-current-title').hasText(`New ${type} Report`, `${type} report title displayed correctly`);
    assert.dom('.patient-name .ps-info-data').hasText(PATIENT, 'Patient record displays');
  });
}

function checkOPDReport(assert) {
  andThen(() => {
    assert.dom('.patient-id .ps-info-data').hasText(PATIENT_ID, 'Patient ID is displayed');
    assert.dom('.patient-name .ps-info-data').hasText(PATIENT, 'Patient First Name & Last Name is displayed');
    assert.dom('.test-visit-date .test-visit-date-label').hasText('Date of Visit:', 'Visit date label displayed');
    assert.ok(!isEmpty(find('.test-visit-date .test-visit-date-data').text()), 'Visit date is displayed');
    findWithAssert('.test-visit-type .test-visit-type-label:contains(Visit Type)');
    assert.dom('.test-visit-type .test-visit-type-data').hasText('Clinic', 'Visit Type is displayed');
    findWithAssert('.test-examiner .test-examiner-label:contains(Examiner)');
    assert.dom('.test-examiner .test-examiner-data').hasText(EXAMINER, 'Visit Examiner is displayed');
    findWithAssert('.test-location .test-location-label:contains(Visit Location)');
    assert.dom('.test-location .test-location-data').hasText(LOCATION, 'Visit Location is displayed');
    findWithAssert(`.primary-diagnosis:contains(${PRIMARY_DIAGNOSIS})`);
    findWithAssert(`.secondary-diagnosis:contains(${SECONDARY_DIAGNOSIS})`);
    findWithAssert('.test-opd-procedure .test-opd-procedure-label:contains(Procedures)');
    assert.ok(find('.test-opd-procedure .test-opd-procedure-data').text().indexOf(OPD_PROCEDURE_DESCRIPTION) > -1, 'OPD Procedure is displayed');
    findWithAssert('.test-labs .test-labs-label:contains(Labs)');
    assert.ok(find('.test-labs .test-labs-data').text().indexOf(LAB_TYPE) > -1, 'Lab request is displayed');
    findWithAssert('.test-images .test-images-label:contains(Images)');
    assert.ok(find('.test-images .test-images-data').text().indexOf(IMAGING_TYPE) > -1, 'Image request is displayed');
    findWithAssert('.test-operative-plan .test-operative-plan-label:contains(Operative Plan)');
    findWithAssert('.test-operative-plan .test-operative-plan-description-label:contains(Operation Description:)');
    assert.dom('.test-operative-plan .test-operative-plan-description-data').hasText(OPERATION_DESCRIPTION);
    findWithAssert('.test-operative-plan .test-operative-plan-procedures-label:contains(Planned Procedures:)');
    assert.dom('.test-operative-plan .test-operative-plan-procedures-description').hasText(PROCEDURE_SPLINT);
    findWithAssert('.test-operative-plan .test-operative-plan-instructions-label:contains(Instructions upon Admission:)');
    assert.dom('.test-operative-plan .test-operative-plan-instructions-data').hasText(ADMISSION_INSTRUCTIONS, 'Admission Instruction is displayed');
  });
}

function checkDischargeReport(assert) {
  andThen(function() {
    findWithAssert('.test-examiner .test-examiner-label:contains(Examiner)');
    assert.dom('.test-examiner .test-examiner-data').hasText(EXAMINER, 'Examiner is displayed');
    assert.dom('.test-visit-date .test-visit-date-label').hasText('Admission Date:', 'Visit date label displays as admission');
    assert.dom('.test-visit-date .test-visit-discharge-date-label').hasText('Discharge Date:', 'Discharge date label displays');
    findWithAssert('.test-notes .test-notes-label:contains(Notes)');
    assert.ok(find('.test-notes .test-notes-data').text().indexOf(NOTE_CONTENT) > -1, 'Notes are displayed');
  });
}

function saveReport(assert, type) {
  andThen(function() {
    click('.panel-footer button:contains(Add)');
    waitToAppear('.modal-dialog');
  });
  andThen(function() {
    assert.dom('.modal-title').hasText('Report saved', `${type} report saved successfully`);
    click('button:contains(Ok)');
    waitToDisappear('.modal-dialog');
  });
  andThen(function() {
    assert.dom('.view-current-title').hasText(`${type} Report`, 'Report title updated correctly');
    assert.ok(find('.panel-footer button:contains(Print)').is(':visible'), 'Print button is now visible');
    click('button:contains(Return)');
  });
  andThen(function() {
    assert.ok(currentURL().indexOf('visits/edit/') > -1, 'Visit url is correct');
  });
}

function viewReport(assert, type, testCase) {
  andThen(function() {
    click('[data-test-selector=reports-tab]');
    waitToAppear('[data-test-selector=view-report-btn]');
    click('[data-test-selector=view-report-btn]');
  });
  andThen(function() {
    assert.ok(currentURL().indexOf('visits/reports/edit') > -1, 'Edit report url is correct');
    assert.dom('.patient-name .ps-info-data').hasText(PATIENT, 'Patient record displays');
    assert.dom('.view-current-title').hasText(`${type} Report`, 'Report title displayed correctly');
    assert.ok(find('.panel-footer button:contains(Print)').is(':visible'), 'Print button is visible');

    (testCase && testCase.customForms || []).forEach((f) => {
      checkCustomFormIsFilledAndReadonly(assert, f.name);
    });
  });
}

function updateVisitData(assert, modalTitle) {
  andThen(() => {
    click('.panel-footer button:contains(Add)');
    waitToAppear('.modal-dialog');
  });
  andThen(() => {
    assert.dom('.modal-title').hasText(modalTitle, `${modalTitle} modal displays`);
    click('.modal-footer button:contains(Ok)');
  });
  andThen(function() {
    waitToDisappear('.modal-dialog');
  });
  andThen(() => {
    click('button:contains(Return)');
  });
  andThen(() => {
    assert.ok(currentURL().indexOf('visits/edit/') > -1, 'Returns back to visit URL');
  });
}

function updateVisit(assert, buttonText, visitType) {
  andThen(function() {
    if (visitType) {
      select('select[id*="visitType"]', visitType);
      waitToDisappear('label[for*="display_endDate"]');
    }
    click(`.panel-footer button:contains(${buttonText})`);
    waitToAppear('.modal-dialog');
  });
  andThen(function() {
    assert.dom('.modal-title').hasText('Visit Saved', 'Visit Saved dialog displays');
    click('button:contains(Ok)');
  });
}

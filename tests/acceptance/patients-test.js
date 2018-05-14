import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import select from 'hospitalrun/tests/helpers/select';

moduleForAcceptance('Acceptance | patients');

test('visiting /patients route', function(assert) {
  return runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/patients');
    assert.equal(currentURL(), '/patients');

    let noPatientsFound = find('[data-test-selector="no-patients-found"]');
    assert.equal(noPatientsFound.text().trim(), 'No patients found. Create a new patient record?', 'no records found');
    let newPatientButton = find('button:contains(+ new patient)');
    assert.equal(newPatientButton.length, 1, 'Add new patient button is visible');

    await click('button:contains(+ new patient)');
    assert.equal(currentURL(), '/patients/edit/new');
  });
});

test('View reports tab', function(assert) {
  return runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/patients/reports');

    let generateReportButton = find('button:contains(Generate Report)');
    assert.equal(currentURL(), '/patients/reports');
    assert.equal(generateReportButton.length, 1, 'Generate Report button is visible');
    let reportType = find('[data-test-selector="select-report-type"]');
    assert.equal(reportType.length, 1, 'Report type select is visible');
    assert.equal(reportType.find(':selected').text().trim(), 'Admissions Detail', 'Default value selected"');
  });
});

let reportNames = [
  'Admissions Summary',
  'Diagnostic Testing',
  'Discharges Detail',
  'Discharges Summary',
  'Procedures Detail'
];

reportNames.forEach((reportName) => {
  testSimpleReportForm(reportName);
  testExportReportName(reportName);
});

test('View reports tab | Patient Status', function(assert) {
  return runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/patients/reports');
    await select('[data-test-selector="select-report-type"] select', 'Patient Status');

    let generateReportButton = find('button:contains(Generate Report)');
    assert.equal(currentURL(), '/patients/reports');
    assert.equal(generateReportButton.length, 1, 'Generate Report button is visible');
    let reportType = find('[data-test-selector="select-report-type"] select');
    assert.equal(reportType.length, 1, 'Report type select is visible');
    assert.equal(reportType.find(':selected').text().trim(), 'Patient Status', 'Default value selected"');
  });
});

test('Testing admitted patient', function(assert) {
  return runWithPouchDump('patient', async function() {
    await authenticateUser();
    await visit('/patients/admitted');
    assert.equal(currentURL(), '/patients/admitted');
    assert.dom('.clickable').exists({ count: 1 }, 'One patient is listed');

    await click('button:contains(Discharge)');
    await waitToAppear('.view-current-title:contains(Edit Visit)');
    assert.equal(currentURL(), '/visits/edit/03C7BF8B-04E0-DD9E-9469-96A5604F5340', 'should return visits/edit instead');

    await click('.panel-footer button:contains(Discharge)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Patient Discharged', 'Patient has been discharged');

    await click('button:contains(Ok)');
    await visit('/patients/admitted');
    await waitToAppear('.view-current-title:contains(Admitted Patients)');
    assert.dom('.clickable').doesNotExist('No patient is listed');
  });
});

test('Adding a new patient record', function(assert) {
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
    assert.dom('#general').exists();
  });
});

test('Delete a patient record', function(assert) {
  return runWithPouchDump('patient', async function() {
    await authenticateUser();
    await visit('/patients');
    assert.equal(currentURL(), '/patients', 'Patient listing url is correct');
    assert.equal(find('tr.clickable td:contains(Joe)').length, 1, 'One patient exists to delete.');

    await click('tr.clickable button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Delete Patient', 'Delete Patient ');
    assert.dom('.modal-body').hasText(
      'Are you sure you wish to delete Joe Bagadonuts?',
      'Patient information appears in modal'
    );

    await click('.modal-footer button:contains(Delete)');
    await waitToDisappear('.modal-dialog');
    await waitToDisappear('tr.clickable td:contains(Joe)');
    assert.equal(find('tr.clickable td:contains(Joe)').length, 0, 'Patient has been successfully deleted.');
  });
});

test('Searching patients', function(assert) {
  return runWithPouchDump('patient', async function() {
    await authenticateUser();
    await visit('/patients');

    await fillIn('[role="search"] div input', 'Joe');
    await click('.glyphicon-search');
    assert.equal(currentURL(), '/patients/search/Joe', 'Searched for Joe');
    assert.equal(find('button:contains(Delete)').length, 1, 'There is one search item');

    await fillIn('[role="search"] div input', 'joe');
    await click('.glyphicon-search');
    assert.equal(currentURL(), '/patients/search/joe', 'Searched for all lower case joe');
    assert.equal(find('button:contains(Delete)').length, 1, 'There is one search item');

    await fillIn('[role="search"] div input', 'ItemNotFound');
    await click('.glyphicon-search');
    assert.equal(currentURL(), '/patients/search/ItemNotFound', 'Searched for ItemNotFound');
    assert.equal(find('button:contains(Delete)').length, 0, 'There is no search result');
  });
});

function testSimpleReportForm(reportName) {
  test(`View reports tab | ${reportName} shows start and end dates`, function(assert) {
    return runWithPouchDump('default', async function() {
      await authenticateUser();
      await visit('/patients/reports');
      await select('[data-test-selector="select-report-type"] select', reportName);

      let reportStartDate = find('[data-test-selector="select-report-start-date"]');
      let reportEndDate = find('[data-test-selector="select-report-end-date"]');
      assert.equal(reportStartDate.length, 1, 'Report start date select is visible');
      assert.equal(reportEndDate.length, 1, 'Report end date select is visible');
      let reportType = find('[data-test-selector="select-report-type"] select');
      assert.equal(reportType.find(':selected').text().trim(), reportName, `${reportName} option selected`);
    });
  });
}

function testExportReportName(reportName) {
  test(`View reports tab | Export reports name for ${reportName} shows report name, start and end dates`, (assert) => {
    return runWithPouchDump('default', async function() {
      await authenticateUser();
      await visit('/patients/reports');
      await select('[data-test-selector="select-report-type"] select', reportName);
      assert.equal(currentURL(), '/patients/reports');

      await fillIn('[data-test-selector="select-report-start-date"] input', '12/11/2016');
      await fillIn('[data-test-selector="select-report-end-date"] input', '12/31/2016');

      await click('button:contains(Generate Report)');
      await waitToAppear('.panel-title');

      let exportReportButton = findWithAssert('a:contains(Export Report)');
      assert.equal($(exportReportButton).attr('download'), `${reportName} Report 12/11/2016 - 12/31/2016.csv`);
    });
  });
}

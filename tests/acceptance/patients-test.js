import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | patients', {
  beforeEach() {
    this.application = startApp();
  },

  afterEach() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /patients route', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/patients');
    andThen(function() {
      assert.equal(currentURL(), '/patients');
      let noPatientsFound = find('[data-test-selector="no-patients-found"]');
      assert.equal(noPatientsFound.text().trim(), 'No patients found. Create a new patient record?', 'no records found');
      let newPatientButton = find('button:contains(+ new patient)');
      assert.equal(newPatientButton.length, 1, 'Add new patient button is visible');
    });
    click('button:contains(+ new patient)');
    andThen(function() {
      assert.equal(currentURL(), '/patients/edit/new');
    });
  });
});

test('View reports tab', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/patients/reports');

    andThen(function() {
      let generateReportButton = find('button:contains(Generate Report)');
      assert.equal(currentURL(), '/patients/reports');
      assert.equal(generateReportButton.length, 1, 'Generate Report button is visible');
      let reportType = find('[data-test-selector="select-report-type"]');
      assert.equal(reportType.length, 1, 'Report type select is visible');
      assert.equal(reportType.find(':selected').text().trim(), 'Admissions Detail', 'Default value selected"');
    });
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
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/patients/reports');
    select('[data-test-selector="select-report-type"] select', 'Patient Status');

    andThen(function() {
      let generateReportButton = find('button:contains(Generate Report)');
      assert.equal(currentURL(), '/patients/reports');
      assert.equal(generateReportButton.length, 1, 'Generate Report button is visible');
      let reportType = find('[data-test-selector="select-report-type"] select');
      assert.equal(reportType.length, 1, 'Report type select is visible');
      assert.equal(reportType.find(':selected').text().trim(), 'Patient Status', 'Default value selected"');
    });
  });
});

test('Testing admitted patient', function(assert) {
  runWithPouchDump('patient', function() {
    authenticateUser();
    visit('/patients/admitted');
    andThen(function() {
      assert.equal(currentURL(), '/patients/admitted');
      assert.equal(find('.clickable').length, 1, 'One patient is listed');
    });
    click('button:contains(Discharge)');
    waitToAppear('.view-current-title:contains(Edit Visit)');
    andThen(function() {
      assert.equal(currentURL(), '/visits/edit/03C7BF8B-04E0-DD9E-9469-96A5604F5340', 'should return visits/edit instead');
    });
    click('.panel-footer button:contains(Discharge)');
    waitToAppear('.modal-dialog');
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Patient Discharged', 'Patient has been discharged');
    });

    click('button:contains(Ok)');
    visit('/patients/admitted');
    waitToAppear('.view-current-title:contains(Admitted Patients)');
    andThen(() => {
      assert.equal(find('.clickable').length, 0, 'No patient is listed');
    });
  });
});

test('Adding a new patient record', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/patients/edit/new');
    andThen(function() {
      assert.equal(currentURL(), '/patients/edit/new');
    });

    fillIn('.test-first-name input', 'John');
    fillIn('.test-last-name input', 'Doe');
    click('.panel-footer button:contains(Add)');
    waitToAppear('.message:contains(The patient record for John Doe has been saved)');
    andThen(function() {
      assert.equal(find('.message').text().trim(), 'The patient record for John Doe has been saved.');
    });

    waitToAppear('.patient-summary');

    andThen(function() {
      findWithAssert('.patient-summary');
    });
    andThen(function() {
      findWithAssert('#general');
    });

  });
});

test('Delete a patient record', function(assert) {
  runWithPouchDump('patient', function() {
    authenticateUser();
    visit('/patients');
    andThen(() =>{
      assert.equal(currentURL(), '/patients', 'Patient listing url is correct');
      assert.equal(find('tr.clickable td:contains(Joe)').length, 1, 'One patient exists to delete.');
      click('tr.clickable button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(() =>{
      assert.equal(find('.modal-title').text(), 'Delete Patient', 'Delete Patient ');
      assert.equal(find('.modal-body').text().trim(), 'Are you sure you wish to delete Joe Bagadonuts?', 'Patient information appears in modal');
      click('.modal-footer button:contains(Delete)');
      waitToDisappear('.modal-dialog');
      waitToDisappear('tr.clickable td:contains(Joe)');
    });
    andThen(function() {
      assert.equal(find('tr.clickable td:contains(Joe)').length, 0, 'Patient has been successfully deleted.');
    });
  });
});

test('Searching patients', function(assert) {
  runWithPouchDump('patient', function() {
    authenticateUser();
    visit('/patients');

    fillIn('[role="search"] div input', 'Joe');
    click('.glyphicon-search');

    andThen(() => {
      assert.equal(currentURL(), '/patients/search/Joe', 'Searched for Joe');
      assert.equal(find('button:contains(Delete)').length, 1, 'There is one search item');
    });

    fillIn('[role="search"] div input', 'joe');
    click('.glyphicon-search');

    andThen(() => {
      assert.equal(currentURL(), '/patients/search/joe', 'Searched for all lower case joe');
      assert.equal(find('button:contains(Delete)').length, 1, 'There is one search item');
    });
    fillIn('[role="search"] div input', 'ItemNotFound');
    click('.glyphicon-search');

    andThen(() => {
      assert.equal(currentURL(), '/patients/search/ItemNotFound', 'Searched for ItemNotFound');
      assert.equal(find('button:contains(Delete)').length, 0, 'There is no search result');
    });
  });
});

function testSimpleReportForm(reportName) {
  test(`View reports tab | ${reportName} shows start and end dates`, function(assert) {
    runWithPouchDump('default', function() {
      authenticateUser();
      visit('/patients/reports');
      select('[data-test-selector="select-report-type"] select', reportName);

      andThen(function() {
        let reportStartDate = find('[data-test-selector="select-report-start-date"]');
        let reportEndDate = find('[data-test-selector="select-report-end-date"]');
        assert.equal(reportStartDate.length, 1, 'Report start date select is visible');
        assert.equal(reportEndDate.length, 1, 'Report end date select is visible');
        let reportType = find('[data-test-selector="select-report-type"] select');
        assert.equal(reportType.find(':selected').text().trim(), reportName, `${reportName} option selected`);
      });
    });
  });
}

function testExportReportName(reportName) {
  test(`View reports tab | Export reports name for ${reportName} shows report name, start and end dates`, (assert) => {
    runWithPouchDump('default', () => {
      authenticateUser();
      visit('/patients/reports');
      select('[data-test-selector="select-report-type"] select', reportName);

      andThen(() => {
        assert.equal(currentURL(), '/patients/reports');
      });

      fillIn('[data-test-selector="select-report-start-date"] input', '12/11/2016');
      fillIn('[data-test-selector="select-report-end-date"] input', '12/31/2016');

      click('button:contains(Generate Report)');
      waitToAppear('.panel-title');

      andThen(() => {
        let exportReportButton = findWithAssert('a:contains(Export Report)');
        assert.equal($(exportReportButton).attr('download'), `${reportName} Report 12/11/2016 - 12/31/2016.csv`);
      });
    });
  });
}

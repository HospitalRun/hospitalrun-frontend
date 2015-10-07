import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | patients', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});


test('visiting /patients route', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/patients');

  andThen(function() {
    assert.equal(currentURL(), '/patients');
    const noPatientsFound = find('[data-test-selector="no-patients-found"]');
    assert.equal(noPatientsFound.text().trim(), 'No patients found. Create a new patient record?', 'no records found');
    const newPatientButton = find('button:contains(+ new patient)');
    assert.equal(newPatientButton.length, 1, 'Add new patient button is visible');
    assert.equal(find('.nav-pills li:contains(Patient listing)').length, 1, 'Patient listing link is visible');
    assert.equal(find('.nav-pills li:contains(Reports)').length, 1, 'Reports link is visible');
  });
  click('button:contains(+ new patient)');
  andThen(function() {
    assert.equal(currentURL(),'/patients/edit/new');
  });
  destroyDatabases();
});

test('View reports tab', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/patients/reports');

  andThen(function() {
    var generateReportButton = find('button:contains(Generate Report)');
    assert.equal(currentURL(), '/patients/reports');
    assert.equal(generateReportButton.length, 1, 'Generate Report button is visible');
    const reportType = find('[data-test-selector="select-report-type"]');
    assert.equal(reportType.length, 1, 'Report type select is visible');
    assert.equal(reportType.find(':selected').text(), 'Admissions Detail', 'Default value selected"');
  });
  destroyDatabases();
});

testSimpleReportForm('Admissions Summary');
testSimpleReportForm('Diagnostic Testing');
testSimpleReportForm('Discharges Detail');
testSimpleReportForm('Discharges Summary');
testSimpleReportForm('Procedures Detail');

function testSimpleReportForm(reportName) {
  test(`View reports tab | ${reportName} shows start and end dates`, function(assert) {
    loadPouchDump('default');
    authenticateUser();
    visit('/patients/reports');
    select('[data-test-selector="select-report-type"] select', reportName);

    andThen(function() {
      const reportStartDate = find('[data-test-selector="select-report-start-date"]');
      const reportEndDate = find('[data-test-selector="select-report-end-date"]');
      assert.equal(reportStartDate.length, 1, 'Report start date select is visible');
      assert.equal(reportEndDate.length, 1, 'Report end date select is visible');
      const reportType = find('[data-test-selector="select-report-type"] select');
      assert.equal(reportType.find(':selected').text(), reportName, `${reportName} option selected`);
    });
    destroyDatabases();
  });
};

test('View reports tab | Patient Status', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/patients/reports');
  select('[data-test-selector="select-report-type"] select', 'Patient Status');


  andThen(function() {
    var generateReportButton = find('button:contains(Generate Report)');
    assert.equal(currentURL(), '/patients/reports');
    assert.equal(generateReportButton.length, 1, 'Generate Report button is visible');
    const reportType = find('[data-test-selector="select-report-type"] select');
    assert.equal(reportType.length, 1, 'Report type select is visible');
    assert.equal(reportType.find(':selected').text(), 'Patient Status', 'Default value selected"');
  });
  destroyDatabases();
});

test('Adding a new patient record', function(assert) {
  loadPouchDump('default');
  authenticateUser();
  visit('/patients/edit/new');
  // Ember.run(function() {
  //   fillIn('.test-first-name input', 'John');
  //   fillIn('.test-last-name input', 'Doe');
  // });
  fillIn('.test-first-name input', 'John');
  fillIn('.test-last-name input', 'Doe');
  click('.panel-footer button:contains(Add)');
  //return pauseTest();

  andThen(function() {
    assert.equal(currentURL(), '/patients/edit/new');
    assert.equal(find('.modal-title').text(), 'Patient Saved', 'Patient record has been saved');
    assert.equal(find('.modal-body').text().trim(), 'The patient record for John Doe has been saved.', 'Record has been saved');
  });
  click('button:contains("Ok")');
  andThen(function() {
    assert.equal(find('label:contains(Name)').text(), 'Name', 'Name is showing');
  });
  destroyDatabases();
});

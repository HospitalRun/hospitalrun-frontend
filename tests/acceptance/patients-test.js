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

function testSimpleReportForm(reportName) {
  test(`View reports tab | ${reportName} shows start and end dates`, function(assert) {
    loadPouchDump('default');
    authenticateUser();
    visit('/patients/reports');
    fillIn('[data-test-selector="select-report-type"]', reportName);
    andThen(function() {
      const reportStartDate = find('[data-test-selector="select-report-start-date"]');
      const reportEndDate = find('[data-test-selector="select-report-end-date"]');
      assert.equal(reportStartDate.length, 1, 'Report start date select is visible');
      assert.equal(reportEndDate.length, 1, 'Report end date select is visible');
    });
    destroyDatabases();
  });
}

// test('Adding a new patient record', function(assert) {
//   loadPouchDump('default');
//   authenticateUser();
//   visit('/patients/edit/new');
//   andThen(function() {
//     assert.equal(currentURL(), '/patients/edit/new');
//   });
// });

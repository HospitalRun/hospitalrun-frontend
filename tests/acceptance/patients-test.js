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

testSimpleReportForm('Admissions Summary');
testSimpleReportForm('Diagnostic Testing');
testSimpleReportForm('Discharges Detail');
testSimpleReportForm('Discharges Summary');
testSimpleReportForm('Procedures Detail');

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
    waitToAppear('.modal-dialog');
    andThen(function() {
      assert.equal(find('.modal-title').text(), 'Patient Saved', 'Patient record has been saved');
      assert.equal(find('.modal-body').text().trim(), 'The patient record for John Doe has been saved.', 'Record has been saved');
    });
    click('button:contains(Close)');
    waitToAppear('.patient-summary');

    andThen(function() {
      findWithAssert('.patient-summary');
    });
    andThen(function() {
      findWithAssert('#general');
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

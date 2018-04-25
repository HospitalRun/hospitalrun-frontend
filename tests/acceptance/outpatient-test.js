import { test } from 'qunit';
import moment from 'moment';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | outpatient');

test('Check In/Check Out Existing outpatient', function(assert) {
  runWithPouchDump('patient', function() {
    authenticateUser();
    visit('/patients/outpatient');
    andThen(function() {
      assert.equal(currentURL(), '/patients/outpatient', 'Outpatient url is correct');
      assert.dom('.view-current-title').hasText('Today\'s Outpatients', 'Title is correct');
      click('button:contains(Patient Check In)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/visits/edit/checkin', 'Check In url is correct');
      typeAheadFillIn('.patient-name', 'Joe Bagadonuts - P00001');
      waitToAppear('.patient-name .ps-info-data');
    });
    andThen(function() {
      assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'Joe Bagadonuts patient record displays');
      assert.dom('.new-patient-checkbox input').isNotChecked('New Patient checkbox is not checked');
      select('.visit-type', 'Clinic');
      click('button:contains(Check In)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('Patient Checked In', 'Patient has been checked in');
      click('.modal-footer button:contains(Ok)');
    });
    andThen(function() {
      findWithAssert('button:contains(Check Out)');
      click('button:contains(Return)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/patients/outpatient', 'Returned to Outpatient');
      assert.equal(find('.outpatient-list td:contains(Joe Bagadonuts)').length, 1, 'Checked in patient appears in list');
      click('button:contains(Check Out)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('Patient Check Out', 'Patient checkout confirmation displays');
      click('button:contains(Ok)');
      waitToAppear('.modal-title:contains(Patient Checked Out)');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('Patient Checked Out', 'Patient has been checked out confirmation');
      click('button:contains(Ok)');
    });
    andThen(function() {
      assert.equal(find('.outpatient-list td:contains(Joe Bagadonuts)').length, 0, 'Checked out patient no longer appears');
    });
  });
});

test('Check In/Check Out new outpatient', function(assert) {
  runWithPouchDump('patient', function() {
    let visitDate = moment('2015-10-01');
    let visitLocation = 'Outpatient Followup';
    authenticateUser();
    visit('/patients/outpatient');
    andThen(function() {
      assert.equal(currentURL(), '/patients/outpatient', 'Outpatient url is correct');
      assert.dom('.view-current-title').hasText('Today\'s Outpatients', 'Title is correct');
      click('button:contains(Patient Check In)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/visits/edit/checkin', 'Check In url is correct');
      typeAheadFillIn('.patient-name', 'Jane Bagadonuts');
    });
    andThen(function() {
      assert.dom('.new-patient-checkbox input').isChecked('New Patient checkbox is checked');
      selectDate('.checkin-date input', visitDate.toDate());
      select('.visit-type', 'Followup');
      typeAheadFillIn('.visit-location', visitLocation);
    });
    andThen(function() {
      click('button:contains(Check In)');
      waitToAppear('.modal-title:contains(New Patient)');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('New Patient', 'New Patient dialog appears');
      click('.modal-footer button:contains(Add)');
      waitToAppear('.modal-title:contains(Patient Checked In)');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('Patient Checked In', 'Patient has been checked in');
      assert.dom('.modal-body').hasText(
        'Jane Bagadonuts has been created and checked in.',
        'Patient has been created and checked in'
      );
      click('button:contains(Ok)');
    });
    andThen(function() {
      findWithAssert('button:contains(Check Out)');
      click('button:contains(Return)');
    });
    andThen(function() {
      assert.equal(currentURL(), '/patients/outpatient', 'Returned to Outpatient');
      assert.equal(find('.outpatient-list td:contains(Jane Bagadonuts)').length, 0, 'Checked in patient does not appears in list because of date');
      selectDate('.outpatient-date input', visitDate.toDate());
      click('button:contains(Search)');
      waitToAppear(`.view-current-title:contains(Outpatients for ${visitDate.format('l')})`);
    });
    andThen(function() {
      assert.dom('.view-current-title').hasText(
        `Outpatients for ${visitDate.format('l')}`,
        'Title updates to specified date'
      );
      waitToAppear('.outpatient-list td:contains(Jane Bagadonuts)');
    });
    andThen(function() {
      assert.equal(find('.outpatient-list td:contains(Jane Bagadonuts)').length, 1, 'Checked in patient appears with date filtered.');
      select('.outpatient-location', 'Hospital');
      click('button:contains(Search)');
    });
    andThen(function() {
      assert.equal(find('.outpatient-list td:contains(Jane Bagadonuts)').length, 0, 'Checked in patient does not appear because different location.');
      findWithAssert(`.outpatient-location option:contains(${visitLocation})`);
      select('.outpatient-location', visitLocation);
      click('button:contains(Search)');
    });
    andThen(function() {
      assert.equal(find('.outpatient-list td:contains(Jane Bagadonuts)').length, 1, 'Checked in patient appears with date and location filtered.');
      visit('/patients');
    });
    andThen(function() {
      assert.equal(find('tr:last td:contains(Jane)').length, 1, 'New patient appears in patient listing.');
      click('tr:last td button:contains(Check Out)');
      waitToAppear('.view-current-title:contains(Edit Visit)');
    });
    andThen(function() {
      assert.dom('.view-current-title').hasText('Edit Visit', 'Visit displays on checkout from patient listing');
      assert.dom('.patient-name .ps-info-data').hasText('Jane Bagadonuts', 'Jane Bagadonuts patient record displays');
      click('button:contains(Check Out)');
      waitToAppear('.modal-dialog');
    });
    andThen(function() {
      assert.dom('.modal-title').hasText('Patient Checked Out', 'Patient has been checked out confirmation');
      click('button:contains(Ok)');
    });
    andThen(function() {
      let checkoutDate = moment();
      assert.dom('.checkout-date input').hasValue(checkoutDate.format('l h:mm A'), 'Check Out date properly set');
      visit('/patients/outpatient');
    });
    andThen(function() {
      assert.equal(find('.outpatient-list td:contains(Jane Bagadonuts)').length, 0, 'Checked out patient no longer appears');
    });
  });
});

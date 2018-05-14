import { test } from 'qunit';
import moment from 'moment';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import select from 'hospitalrun/tests/helpers/select';
import selectDate from 'hospitalrun/tests/helpers/select-date';
import typeAheadFillIn from 'hospitalrun/tests/helpers/typeahead-fillin';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser } from 'hospitalrun/tests/helpers/authenticate-user';

moduleForAcceptance('Acceptance | outpatient');

test('Check In/Check Out Existing outpatient', function(assert) {
  return runWithPouchDump('patient', async function() {
    await authenticateUser();
    await visit('/patients/outpatient');
    assert.equal(currentURL(), '/patients/outpatient', 'Outpatient url is correct');
    assert.dom('.view-current-title').hasText('Today\'s Outpatients', 'Title is correct');

    await click('button:contains(Patient Check In)');
    assert.equal(currentURL(), '/visits/edit/checkin', 'Check In url is correct');

    await typeAheadFillIn('.patient-name', 'Joe Bagadonuts - P00001');
    await waitToAppear('.patient-name .ps-info-data');
    assert.dom('.patient-name .ps-info-data').hasText('Joe Bagadonuts', 'Joe Bagadonuts patient record displays');
    assert.dom('.new-patient-checkbox input').isNotChecked('New Patient checkbox is not checked');

    await select('.visit-type', 'Clinic');
    await click('button:contains(Check In)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Patient Checked In', 'Patient has been checked in');

    await click('.modal-footer button:contains(Ok)');
    findWithAssert('button:contains(Check Out)');

    await click('button:contains(Return)');
    assert.equal(currentURL(), '/patients/outpatient', 'Returned to Outpatient');
    assert.equal(find('.outpatient-list td:contains(Joe Bagadonuts)').length, 1, 'Checked in patient appears in list');

    await click('button:contains(Check Out)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Patient Check Out', 'Patient checkout confirmation displays');

    await click('button:contains(Ok)');
    await waitToAppear('.modal-title:contains(Patient Checked Out)');
    assert.dom('.modal-title').hasText('Patient Checked Out', 'Patient has been checked out confirmation');

    await click('button:contains(Ok)');
    assert.equal(find('.outpatient-list td:contains(Joe Bagadonuts)').length, 0, 'Checked out patient no longer appears');
  });
});

test('Check In/Check Out new outpatient', function(assert) {
  return runWithPouchDump('patient', async function() {
    let visitDate = moment('2015-10-01');
    let visitLocation = 'Outpatient Followup';
    await authenticateUser();
    await visit('/patients/outpatient');
    assert.equal(currentURL(), '/patients/outpatient', 'Outpatient url is correct');
    assert.dom('.view-current-title').hasText('Today\'s Outpatients', 'Title is correct');

    await click('button:contains(Patient Check In)');
    assert.equal(currentURL(), '/visits/edit/checkin', 'Check In url is correct');

    await typeAheadFillIn('.patient-name', 'Jane Bagadonuts');
    assert.dom('.new-patient-checkbox input').isChecked('New Patient checkbox is checked');

    await selectDate('.checkin-date input', visitDate.toDate());
    await select('.visit-type', 'Followup');
    await typeAheadFillIn('.visit-location', visitLocation);
    await click('button:contains(Check In)');
    await waitToAppear('.modal-title:contains(New Patient)');
    assert.dom('.modal-title').hasText('New Patient', 'New Patient dialog appears');

    await click('.modal-footer button:contains(Add)');
    await waitToAppear('.modal-title:contains(Patient Checked In)');
    assert.dom('.modal-title').hasText('Patient Checked In', 'Patient has been checked in');
    assert.dom('.modal-body').hasText(
      'Jane Bagadonuts has been created and checked in.',
      'Patient has been created and checked in'
    );

    await click('button:contains(Ok)');
    findWithAssert('button:contains(Check Out)');

    await click('button:contains(Return)');
    assert.equal(currentURL(), '/patients/outpatient', 'Returned to Outpatient');
    assert.equal(find('.outpatient-list td:contains(Jane Bagadonuts)').length, 0, 'Checked in patient does not appears in list because of date');

    await selectDate('.outpatient-date input', visitDate.toDate());
    await click('button:contains(Search)');
    await waitToAppear(`.view-current-title:contains(Outpatients for ${visitDate.format('l')})`);
    assert.dom('.view-current-title').hasText(
      `Outpatients for ${visitDate.format('l')}`,
      'Title updates to specified date'
    );

    await waitToAppear('.outpatient-list td:contains(Jane Bagadonuts)');
    assert.equal(find('.outpatient-list td:contains(Jane Bagadonuts)').length, 1, 'Checked in patient appears with date filtered.');

    await select('.outpatient-location', 'Hospital');
    await click('button:contains(Search)');
    assert.equal(find('.outpatient-list td:contains(Jane Bagadonuts)').length, 0, 'Checked in patient does not appear because different location.');
    findWithAssert(`.outpatient-location option:contains(${visitLocation})`);

    await select('.outpatient-location', visitLocation);
    await click('button:contains(Search)');
    assert.equal(find('.outpatient-list td:contains(Jane Bagadonuts)').length, 1, 'Checked in patient appears with date and location filtered.');

    await visit('/patients');
    assert.equal(find('tr:last td:contains(Jane)').length, 1, 'New patient appears in patient listing.');

    await click('tr:last td button:contains(Check Out)');
    await waitToAppear('.view-current-title:contains(Edit Visit)');
    assert.dom('.view-current-title').hasText('Edit Visit', 'Visit displays on checkout from patient listing');
    assert.dom('.patient-name .ps-info-data').hasText('Jane Bagadonuts', 'Jane Bagadonuts patient record displays');

    await click('button:contains(Check Out)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Patient Checked Out', 'Patient has been checked out confirmation');

    await click('button:contains(Ok)');

    let checkoutDate = moment();
    assert.dom('.checkout-date input').hasValue(checkoutDate.format('l h:mm A'), 'Check Out date properly set');

    await visit('/patients/outpatient');
    assert.equal(find('.outpatient-list td:contains(Jane Bagadonuts)').length, 0, 'Checked out patient no longer appears');
  });
});

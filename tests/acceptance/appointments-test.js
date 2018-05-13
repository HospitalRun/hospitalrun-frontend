import { test } from 'qunit';
import moment from 'moment';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';

const DATE_TIME_FORMAT = 'l h:mm A';
const DATE_FORMAT = 'l';
const TIME_FORMAT = 'h:mm';

moduleForAcceptance('Acceptance | appointments');

test('visiting /appointments', function(assert) {
  return runWithPouchDump('default', async function() {
    await authenticateUser();
    await visit('/appointments');
    assert.equal(currentURL(), '/appointments');
    findWithAssert('button:contains(new appointment)');
    assert.dom('.table-header').exists();
  });
});

test('visiting /appointments/missed', function(assert) {
  return runWithPouchDump('appointments', async function() {
    await authenticateUser();
    let url = '/appointments';
    let today = moment();
    let tomorrow = moment().add(1, 'days');
    let status = 'Missed';
    await createAppointment(assert, {
      startDate: today,
      endDate: tomorrow,
      allDay: false,
      status
    });
    await visit(url);
    assert.equal(currentURL(), url);
    findWithAssert(`.appointment-status:contains(${status})`);
  });
});

test('test appointment for today', function(assert) {
  return runWithPouchDump('appointments', async function() {
    await authenticateUser();
    await visit('/appointments/today');
    assert.dom('.appointment-date').doesNotExist('should have 0 appointment today');
    await visit('/appointments/edit/new');
    assert.equal(currentURL(), '/appointments/edit/new');
    findWithAssert('button:contains(Cancel)');
    findWithAssert('button:contains(Add)');

    await createAppointment(assert);

    await visit('/appointments/today');
    assert.equal(currentURL(), '/appointments/today');
    assert.dom('.appointment-status').hasText('Scheduled', 'should have 1 appointment today');
  });
});

test('Creating a new appointment', function(assert) {
  return runWithPouchDump('appointments', async function() {
    await authenticateUser();
    await visit('/appointments/edit/new');

    assert.equal(currentURL(), '/appointments/edit/new');
    findWithAssert('button:contains(Cancel)');
    findWithAssert('button:contains(Add)');

    await createAppointment(assert);

    assert.equal(currentURL(), '/appointments');
    assert.dom('tr').exists({ count: 2 }, 'New appointment has been added');
    findWithAssert('button:contains(Check In)');
    findWithAssert('button:contains(Edit)');
    findWithAssert('button:contains(Delete)');
  });
});

test('Creating a new appointment from patient screen', function(assert) {
  return runWithPouchDump('appointments', async function() {
    let today = moment().startOf('day');
    let tomorrow =  moment(today).add(24, 'hours');
    await authenticateUser();
    await visit('/patients');
    findWithAssert('button:contains(Edit)');

    await click('button:contains(Edit)');
    assert.dom('button[data-test-selector="appointments-btn"]').exists({ count: 1 }, 'Tab Appointments shown AFTER clicking edit');

    await click('button[data-test-selector="appointments-btn"]');

    assert.equal(currentURL().substr(0, 19), '/appointments/edit/', 'Creating appointment');

    await click('.appointment-all-day input');
    await fillIn('.test-appointment-start input', today.format(DATE_FORMAT));
    await fillIn('.test-appointment-end input', tomorrow.format(DATE_FORMAT));
    await typeAheadFillIn('.test-appointment-location', 'Harare');
    await typeAheadFillIn('.test-appointment-with', 'Dr Test');
    await click('button:contains(Add)');

    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Appointment Saved', 'Appointment has been saved');
    await click('.modal-footer button:contains(Ok)');

    await click('button:contains(Return)');
    assert.equal(currentURL().substr(0, 15), '/patients/edit/', 'Back on patient edit screen');
  });
});

test('Change appointment type', function(assert) {
  return runWithPouchDump('appointments', async function() {
    let today = moment().startOf('day');
    await authenticateUser();
    await visit('/appointments/edit/new');

    assert.equal(currentURL(), '/appointments/edit/new');
    findWithAssert('button:contains(Cancel)');
    findWithAssert('button:contains(Add)');

    await createAppointment(assert);

    assert.equal(currentURL(), '/appointments');
    assert.dom('tr').exists({ count: 2 }, 'New appointment has been added');
    findWithAssert('button:contains(Edit)');

    await click('button:contains(Edit)');

    assert.equal(currentURL().substring(0, 19), '/appointments/edit/');
    assert.dom('.appointment-all-day input').hasValue('on', 'All day appointment is on');

    await select('.test-appointment-type', 'Clinic');

    assert.dom('.test-appointment-date input').hasValue(today.format(DATE_FORMAT), 'Single date field found');
    assert.equal(find('.appointment-all-day').val(), '', 'All day appointment was turned off');
  });
});

test('Checkin to a visit from appointment', function(assert) {
  return runWithPouchDump('appointments', async function() {
    await authenticateUser();
    await createAppointment(assert);
    await visit('/appointments');

    assert.equal(currentURL(), '/appointments');
    assert.dom('tr').exists({ count: 2 }, 'New appointment has been added');
    findWithAssert('button:contains(Check In)');
    findWithAssert('button:contains(Edit)');
    findWithAssert('button:contains(Delete)');

    await click('button:contains(Check In)');

    assert.equal(currentURL(), '/visits/edit/checkin', 'Now in add visiting information route');

    await click('.panel-footer button:contains(Check In)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText('Patient Checked In', 'Patient has been checked in');

    await click('button:contains(Ok)');
    findWithAssert('button:contains(New Note)');
    findWithAssert('button:contains(New Procedure)');
    findWithAssert('button:contains(New Medication)');
    findWithAssert('button:contains(New Lab)');
    findWithAssert('button:contains(New Imaging)');
    findWithAssert('button:contains(New Vitals)');
    findWithAssert('button:contains(Add Item)');

    await click('button:contains(Return)');
    assert.equal(currentURL(), '/appointments');
    assert.equal(find('button:contains(Check In)').length, 0, 'Check In button no longer appears');
    findWithAssert('button:contains(Edit)');
    findWithAssert('button:contains(Delete)');
  });
});

test('Delete an appointment', function(assert) {
  return runWithPouchDump('appointments', async function() {
    await authenticateUser();
    await createAppointment(assert);
    await visit('/appointments');

    assert.equal(currentURL(), '/appointments');
    assert.dom('.appointment-date').exists({ count: 1 }, 'One appointment is listed');
    findWithAssert('button:contains(Check In)');
    findWithAssert('button:contains(Edit)');
    findWithAssert('button:contains(Delete)');

    await click('button:contains(Delete)');
    await waitToAppear('.modal-dialog');
    assert.dom('.modal-title').hasText(
      'Delete Appointment',
      'Delete Appointment confirmation modal has been displayed'
    );

    await click('.modal-dialog button:contains(Delete)');
    await waitToDisappear('.appointment-date');
    assert.dom('.appointment-date').doesNotExist('No appointments are displayed');
  });
});

test('Appointment calendar', function(assert) {
  return runWithPouchDump('appointments', async function() {
    await authenticateUser();
    let today = moment().startOf('day');
    let later =  moment(today).add(1, 'hours');
    let startTime = today.format(TIME_FORMAT);
    let endTime = later.format(TIME_FORMAT);
    let timeString = `${startTime} - ${endTime}`;

    await createAppointment(assert, {
      startDate: today,
      endDate: later,
      allDay: false,
      status: 'Scheduled'
    });

    await visit('/appointments/calendar');
    assert.equal(currentURL(), '/appointments/calendar');
    assert.dom('.view-current-title').hasText('Appointments Calendar', 'Appoinment Calendar displays');
    assert.dom('.fc-content .fc-time').hasText(timeString, 'Time appears in calendar');
    assert.dom('.fc-title').hasText('Lennex ZinyandoDr Test', 'Appoinment displays in calendar');

    await click('.fc-title');
    assert.dom('.view-current-title').hasText('Edit Appointment', 'Edit Appointment displays');
    assert.dom('.test-appointment-start input').hasValue(today.format(DATE_TIME_FORMAT), 'Start date/time are correct');
    assert.dom('.test-appointment-end input').hasValue(later.format(DATE_TIME_FORMAT), 'End date/time are correct');
  });
});

test('visiting /appointments/search', function(assert) {
  return runWithPouchDump('appointments', async function() {
    await authenticateUser();

    await createAppointment(assert);
    await createAppointment(assert, {
      startDate: moment().startOf('day').add(1, 'years'),
      startTime: moment().startOf('day').add(1, 'years').format(TIME_FORMAT),
      endDate: moment().endOf('day').add(1, 'years').add(2, 'days'),
      endTime: moment().endOf('day').add(1, 'years').add(2, 'days').format(TIME_FORMAT)
    });

    await visit('/appointments/search');

    findWithAssert(':contains(Search Appointments)');
    findWithAssert(':contains(Show Appointments On Or After)');
    findWithAssert(':contains(Status)');
    findWithAssert(':contains(Type)');
    findWithAssert(':contains(With)');

    let desiredDate = moment().endOf('day').add(363, 'days').format('l');
    let datePicker = '.test-selected-start-date input';
    await selectDate(datePicker, desiredDate);
    await click('button:contains(Search)');

    let date = moment().endOf('day').add(1, 'years').add(2, 'days').format('l');
    findWithAssert(`.appointment-status:contains(${status})`);
    let element = `tr:contains(${date})`;
    findWithAssert(element);
    date = moment().startOf('day').add(1, 'years');
    element = find(`tr:contains(${date})`);
    assert.equal(element.length, 0);
  });
});

test('Theater scheduling', function(assert) {
  return runWithPouchDump('appointments', async function() {
    await authenticateUser();

    let later = moment();
    later.hour(11);
    later.minute(30);
    let today = moment();
    today.hour(10);
    today.minute(30);
    let startTime = today.format(TIME_FORMAT);
    let endTime = later.format(TIME_FORMAT);
    let timeString = `${startTime} - ${endTime}`;

    await createAppointment(assert, {
      endDate: later,
      startDate: today,
      isSurgery: true
    });

    await visit('/appointments/theater');

    assert.equal(currentURL(), '/appointments/theater', 'Theater schedule url is correct.');
    assert.dom('.view-current-title').hasText('Theater Schedule', 'Theater Schedule displays');
    assert.dom('.fc-content .fc-time').hasText(timeString, 'Time appears in calendar');
    assert.dom('.fc-title').hasText('Lennex ZinyandoDr Test', 'Appoinment displays in calendar');

    await click('.fc-title');
    assert.dom('.view-current-title').hasText('Edit Surgical Appointment', 'Edit Surgical Appointment displays');
    assert.dom('.test-appointment-date input').hasValue(today.format('l'), 'Date is correct');
    assert.dom('.start-hour').hasValue('10', 'Start hour is correct');
    assert.dom('.start-minute').hasValue('30', 'Start minute is correct');
    assert.dom('.end-hour').hasValue('11', 'End hour is correct');
    assert.dom('.end-minute').hasValue('30', 'End minute is correct');
  });
});

async function createAppointment(assert, appointment = { startDate: new Date(), endDate: moment().add(1, 'day').toDate(), allDay: true, status: 'Scheduled' }) {
  if (appointment.isSurgery) {
    await visit('/appointments/edit/newsurgery');
  } else {
    await visit('/appointments/edit/new');
  }

  await typeAheadFillIn('.test-patient-input', 'Lennex Zinyando - P00017');

  if (appointment.isSurgery) {
    await selectDate('.test-appointment-date input', appointment.startDate);
    let endHour = getHour(appointment.endDate);
    let endMinute = appointment.endDate.format('mm');
    let startHour = getHour(appointment.startDate);
    let startMinute = appointment.startDate.format('mm');
    await select('.end-hour', endHour);
    await select('.end-minute', endMinute);
    await select('.start-hour', startHour);
    await select('.start-minute', startMinute);

  } else {
    await select('.test-appointment-status', appointment.status);
    if (!appointment.allDay) {
      await click('.appointment-all-day input');
      await fillIn('.test-appointment-start input', appointment.startDate.format(DATE_TIME_FORMAT));
      await fillIn('.test-appointment-end input', appointment.endDate.format(DATE_TIME_FORMAT));
    } else {
      await selectDate('.test-appointment-start input', appointment.startDate);
      await selectDate('.test-appointment-end input', appointment.endDate);
    }
  }

  await typeAheadFillIn('.test-appointment-location', 'Harare');
  await typeAheadFillIn('.test-appointment-with', 'Dr Test');
  await click('button:contains(Add)');
  await waitToAppear('.modal-dialog');
  assert.dom('.modal-title').hasText('Appointment Saved', 'Appointment has been saved');

  await click('.modal-footer button:contains(Ok)');
  await click('button:contains(Return)');
}

function getHour(date) {
  let hour = date.format('h A');
  if (hour.indexOf('12') === 0) {
    if (hour === '12 AM') {
      hour = 'Midnight';
    } else {
      hour = 'Noon';
    }
  }
  return hour;
}

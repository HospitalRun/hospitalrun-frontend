import Ember from 'ember';
import { module, test } from 'qunit';
import moment from 'moment';
import startApp from 'hospitalrun/tests/helpers/start-app';

const DATE_TIME_FORMAT = 'l h:mm A';
const TIME_FORMAT = 'h:mm';

module('Acceptance | appointments', {
  beforeEach() {
    this.application = startApp();
  },

  afterEach() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /appointments', function(assert) {
  runWithPouchDump('default', function() {
    authenticateUser();
    visit('/appointments');
    andThen(function() {
      assert.equal(currentURL(), '/appointments');
      findWithAssert('button:contains(new appointment)');
      findWithAssert('.table-header');
    });
  });
});

test('visiting /appointments/missed', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    let url = '/appointments';
    let today = moment();
    let tomorrow = moment().add(1, 'days');
    let status = 'Missed';
    createAppointment(assert, {
      startDate: today,
      endDate: tomorrow,
      allDay: false,
      status
    });
    visit(url);
    andThen(function() {
      assert.equal(currentURL(), url);
      findWithAssert(`.appointment-status:contains(${status})`);
    });
  });
});

test('test appointment for today', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    visit('/appointments/today');
    assert.equal(find('.appointment-date').length, 0, 'should have 0 appointment today');
    visit('/appointments/edit/new');
    andThen(function() {
      assert.equal(currentURL(), '/appointments/edit/new');
      findWithAssert('button:contains(Cancel)');
      findWithAssert('button:contains(Add)');
    });

    createAppointment(assert);

    visit('/appointments/today');
    andThen(() => {
      assert.equal(currentURL(), '/appointments/today');
      assert.equal(find('.appointment-status').text(), 'Scheduled', 'should have 1 appointment today');
    });
  });
});

test('Creating a new appointment', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    visit('/appointments/edit/new');

    andThen(function() {
      assert.equal(currentURL(), '/appointments/edit/new');
      findWithAssert('button:contains(Cancel)');
      findWithAssert('button:contains(Add)');
    });

    createAppointment(assert);

    andThen(() => {
      assert.equal(currentURL(), '/appointments');
      assert.equal(find('tr').length, 2, 'New appointment has been added');
      findWithAssert('button:contains(Check In)');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
    });
  });
});

test('Checkin to a visit from appointment', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    createAppointment(assert);
    visit('/appointments');

    andThen(function() {
      assert.equal(currentURL(), '/appointments');
      assert.equal(find('tr').length, 2, 'New appointment has been added');
      findWithAssert('button:contains(Check In)');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
    });

    click('button:contains(Check In)');
    andThen(() => {
      assert.equal(currentURL(), '/visits/edit/checkin', 'Now in add visiting information route');
    });
    click('.panel-footer button:contains(Check In)');
    waitToAppear('.modal-dialog');
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Patient Checked In', 'Patient has been checked in');
    });
    click('button:contains(Ok)');
    andThen(() => {
      findWithAssert('button:contains(New Note)');
      findWithAssert('button:contains(New Procedure)');
      findWithAssert('button:contains(New Medication)');
      findWithAssert('button:contains(New Lab)');
      findWithAssert('button:contains(New Imaging)');
      findWithAssert('button:contains(New Vitals)');
      findWithAssert('button:contains(Add Item)');
    });
    click('button:contains(Return)');

    andThen(() => {
      assert.equal(currentURL(), '/appointments');
      assert.equal(find('button:contains(Check In)').length, 0, 'Check In button no longer appears');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
    });
  });
});

test('Delete an appointment', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    createAppointment(assert);
    visit('/appointments');

    andThen(function() {
      assert.equal(currentURL(), '/appointments');
      assert.equal(find('.appointment-date').length, 1, 'One appointment is listed');
      findWithAssert('button:contains(Check In)');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
      click('button:contains(Delete)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('.modal-title').text().trim(), 'Delete Appointment', 'Delete Appointment confirmation modal has been displayed');
      click('.modal-dialog button:contains(Delete)');
    });
    andThen(() => {
      waitToDisappear('.appointment-date');
    });
    andThen(() => {
      assert.equal(find('.appointment-date').length, 0, 'No appointments are displayed');
    });
  });
});

test('Appointment calendar', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    let today = moment().startOf('day');
    let later =  moment(today).add(1, 'hours');
    let startTime = today.format(TIME_FORMAT);
    let endTime = later.format(TIME_FORMAT);
    let timeString = `${startTime} - ${endTime}`;
    createAppointment(assert, {
      startDate: today,
      endDate: later,
      allDay: false,
      status: 'Scheduled'
    });

    andThen(function() {
      visit('/appointments/calendar');
    });

    andThen(function() {
      assert.equal(currentURL(), '/appointments/calendar');
      assert.equal(find('.view-current-title').text(), 'Appointments Calendar', 'Appoinment Calendar displays');
      assert.equal(find('.fc-content .fc-time').text(), timeString, 'Time appears in calendar');
      assert.equal(find('.fc-title').text(), 'Lennex ZinyandoDr Test', 'Appoinment displays in calendar');
      click('.fc-title');
    });

    andThen(() => {
      assert.equal(find('.view-current-title').text(), 'Edit Appointment', 'Edit Appointment displays');
      assert.equal(find('.test-appointment-start input').val(), today.format(DATE_TIME_FORMAT), 'Start date/time are correct');
      assert.equal(find('.test-appointment-end input').val(), later.format(DATE_TIME_FORMAT), 'End date/time are correct');
    });
  });
});

test('Theater scheduling', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    let later = moment();
    later.hour(11);
    later.minute(30);
    let today = moment();
    today.hour(10);
    today.minute(30);
    let startTime = today.format(TIME_FORMAT);
    let endTime = later.format(TIME_FORMAT);
    let timeString = `${startTime} - ${endTime}`;

    createAppointment(assert, {
      endDate: later,
      startDate: today,
      isSurgery: true
    });

    andThen(function() {
      visit('/appointments/theater');
    });

    andThen(function() {
      assert.equal(currentURL(), '/appointments/theater', 'Theater schedule url is correct.');
      assert.equal(find('.view-current-title').text(), 'Theater Schedule', 'Theater Schedule displays');
      assert.equal(find('.fc-content .fc-time').text(), timeString, 'Time appears in calendar');
      assert.equal(find('.fc-title').text(), 'Lennex ZinyandoDr Test', 'Appoinment displays in calendar');
      click('.fc-title');
    });

    andThen(() => {
      assert.equal(find('.view-current-title').text(), 'Edit Surgical Appointment', 'Edit Surgical Appointment displays');
      assert.equal(find('.test-appointment-date input').val(), today.format('l'), 'Date is correct');
      assert.equal(find('.start-hour').val(), today.hour(), 'Start hour is correct');
      assert.equal(find('.start-minute').val(), today.minute(), 'Start minute is correct');
      assert.equal(find('.end-hour').val(), later.hour(), 'End hour is correct');
      assert.equal(find('.end-minute').val(), later.minute(), 'End minute is correct');
    });
  });
});

function createAppointment(assert, appointment = { startDate: new Date(), endDate: moment().add(1, 'day').toDate(), allDay: true, status: 'Scheduled' }) {
  if (appointment.isSurgery) {
    visit('/appointments/edit/newsurgery');
  } else {
    visit('/appointments/edit/new');
  }
  typeAheadFillIn('.test-patient-input', 'Lennex Zinyando - P00017');
  if (appointment.isSurgery) {
    selectDate('.test-appointment-date input', appointment.startDate);
    let endHour = getHour(appointment.endDate);
    let endMinute = appointment.endDate.format('mm');
    let startHour = getHour(appointment.startDate);
    let startMinute = appointment.startDate.format('mm');
    select('.end-hour', endHour);
    select('.end-minute', endMinute);
    select('.start-hour', startHour);
    select('.start-minute', startMinute);
  } else {
    select('.test-appointment-status', appointment.status);
    if (!appointment.allDay) {
      click('.appointment-all-day input');
      fillIn('.test-appointment-start input', appointment.startDate.format(DATE_TIME_FORMAT));
      fillIn('.test-appointment-end input', appointment.endDate.format(DATE_TIME_FORMAT));
    } else {
      selectDate('.test-appointment-start input', appointment.startDate);
      selectDate('.test-appointment-end input', appointment.endDate);
    }
  }
  typeAheadFillIn('.test-appointment-location', 'Harare');
  typeAheadFillIn('.test-appointment-with', 'Dr Test');
  click('button:contains(Add)');
  waitToAppear('.modal-dialog');
  andThen(() => {
    assert.equal(find('.modal-title').text(), 'Appointment Saved', 'Appointment has been saved');
    click('.modal-footer button:contains(Ok)');
  });
  andThen(() => {
    click('button:contains(Return)');
  });
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

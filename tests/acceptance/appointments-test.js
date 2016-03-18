import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | appointments', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
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

test('Creating a new appointment', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    visit('/appointments/edit/new');

    andThen(function() {
      assert.equal(currentURL(), '/appointments/edit/new');
      findWithAssert('button:contains(Cancel)');
      findWithAssert('button:contains(Add)');
    });

    fillIn('.test-patient-input .tt-input', 'Lennex Zinyando - P00017');
    triggerEvent('.test-patient-input .tt-input', 'input');
    triggerEvent('.test-patient-input .tt-input', 'blur');
    select('.test-appointment-type', 'Followup');
    waitToAppear('.test-appointment-date input');
    andThen(function() {
      selectDate('.test-appointment-date input', new Date());
    });
    fillIn('.test-appointment-location .tt-input', 'Harare');
    triggerEvent('.test-appointment-location .tt-input', 'input');
    triggerEvent('.test-appointment-location .tt-input', 'blur');
    fillIn('.test-appointment-with', 'Dr Test');
    click('button:contains(Add)');
    waitToAppear('.table-header');

    andThen(() => {
      assert.equal(currentURL(), '/appointments');
      assert.equal(find('tr').length, 2, 'New appointment has been added');
      findWithAssert('button:contains(Add Visit)');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
    });
  });
});

test('Adding a visit to an appointment', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    createAppointment();
    visit('/appointments');

    andThen(function() {
      assert.equal(currentURL(), '/appointments');
      assert.equal(find('tr').length, 2, 'New appointment has been added');
      findWithAssert('button:contains(Add Visit)');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
    });

    click('button:contains(Add Visit)');
    andThen(() => {
      assert.equal(currentURL(), '/visits/edit/new', 'Now in add visiting information route');
    });
    click('.panel-footer button:contains(Add)');
    waitToAppear('.modal-dialog');
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Visit Saved', 'New visit has been saved');
    });
    click('button:contains(Ok)');
    andThen(() => {
      findWithAssert('button:contains(New Procedure)');
      findWithAssert('button:contains(New Medication)');
      findWithAssert('button:contains(New Lab)');
      findWithAssert('button:contains(New Imaging)');
      findWithAssert('button:contains(New Vitals)');
      findWithAssert('button:contains(Add Item)');
    });

    click('button:contains(Return)');

    click('button:contains(Return)');
    andThen(() => {
      assert.equal(currentURL(), '/patients');
      findWithAssert('button:contains(Discharge)');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
    });
  });
});

test('Delete an appointment', function(assert) {
  runWithPouchDump('appointments', function() {
    authenticateUser();
    createAppointment();
    visit('/appointments');

    andThen(function() {
      assert.equal(currentURL(), '/appointments');
      assert.equal(find('.appointment-date').length, 1, 'One appointment is listed');
      findWithAssert('button:contains(Add Visit)');
      findWithAssert('button:contains(Edit)');
      findWithAssert('button:contains(Delete)');
    });

    click('button:contains(Delete)');
    waitToAppear('.modal-dialog');
    andThen(() => {
      assert.equal(find('.modal-title').text().trim(), 'Delete Appointment', 'Delete Appointment confirmation modal has been displayed');
    });
    click('button:contains(Delete)');
    waitToDisappear('.appointment-date');
    andThen(() => {
      assert.equal(find('.appointment-date').length, 0, 'No appointments are displayed');
    });
  });
});

function createAppointment() {
  visit('/appointments/edit/new');
  fillIn('.test-patient-input .tt-input', 'Lennex Zinyando - P00017');
  triggerEvent('.test-patient-input .tt-input', 'input');
  triggerEvent('.test-patient-input .tt-input', 'blur');
  select('.test-appointment-type', 'Admission');
  waitToAppear('.test-appointment-start input');
  andThen(function() {
    selectDate('.test-appointment-start input', new Date());
  });
  andThen(function() {
    selectDate('.test-appointment-end input', moment().add(1, 'day').toDate());
  });
  fillIn('.test-appointment-location .tt-input', 'Harare');
  triggerEvent('.test-appointment-location .tt-input', 'input');
  triggerEvent('.test-appointment-location .tt-input', 'blur');
  fillIn('.test-appointment-with', 'Dr Test');
  click('button:contains(Add)');
  waitToAppear('.table-header');
}

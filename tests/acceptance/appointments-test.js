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
  loadPouchDump('default');
  authenticateUser();
  visit('/appointments');

  andThen(function() {
    assert.equal(currentURL(), '/appointments');
    findWithAssert('a:contains(This Week)');
    findWithAssert('a:contains(Today)');
    findWithAssert('a:contains(Search)');
    findWithAssert('button:contains(new appointment)');
    findWithAssert('.table-header');
  });
  destroyDatabases();
});

test('Creating a new appointment', function(assert) {
  loadPouchDump('appointments');
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
  fillIn('.test-appointment-date input', Date.now());
  select('.test-appointment-type', 'Admission');
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
  destroyDatabases();
});

test('Adding a visit to an appointment', function(assert) {
  loadPouchDump('appointments');
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

  andThen(() => {
    findWithAssert('.panel-heading h3:contains(General Information)');
  });

  click('button:contains(Return)');
  andThen(() => {
    assert.equal(currentURL(), '/patients');
    findWithAssert('button:contains(Discharge)');
    findWithAssert('button:contains(Edit)');
    findWithAssert('button:contains(Delete)');
  });
  destroyDatabases();
});

test('Delete an appointment', function(assert) {
  loadPouchDump('appointments');
  authenticateUser();
  createAppointment();
  visit('/appointments');

  andThen(function() {
    assert.equal(currentURL(), '/appointments');
    assert.equal(find('tr').length, 2, 'One appointment is listed');
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
  andThen(() => {
    assert.equal(find('tr').length, 1, 'No appointments are displayed');
  });
  destroyDatabases();
});

function createAppointment() {
  visit('/appointments/edit/new');
  fillIn('.test-patient-input .tt-input', 'Lennex Zinyando - P00017');
  triggerEvent('.test-patient-input .tt-input', 'input');
  triggerEvent('.test-patient-input .tt-input', 'blur');
  fillIn('.test-appointment-date input', Date.now());
  select('.test-appointment-type', 'Admission');
  fillIn('.test-appointment-location .tt-input', 'Harare');
  triggerEvent('.test-appointment-location .tt-input', 'input');
  triggerEvent('.test-appointment-location .tt-input', 'blur');
  fillIn('.test-appointment-with', 'Dr Test');
  click('button:contains(Add)');
  waitToAppear('.table-header');
}

import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'hospitalrun/tests/helpers/start-app';

module('Acceptance | roles', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('visiting /admin/roles', function(assert) {
  runWithPouchDump('admin', function() {
    authenticateUser();
    visit('/admin/roles');
    andThen(function() {
      assert.equal(currentURL(), '/admin/roles');
      select('.role-select', 'Doctor');
    });
    andThen(() => {
      assert.equal(find('.checkbox-appointments input:checked').length, 0, 'Appointments checkbox is not checked');
      assert.equal(find('.checkbox-addAppointment input:checked').length, 0, 'Add appointments checkbox is not checked');
    });
    click('.checkbox-appointments input');
    click('.checkbox-addAppointment input');
    andThen(() => {
      assert.equal(find('.checkbox-appointments input:checked').length, 1, 'Appointments checkbox is checked');
      assert.equal(find('.checkbox-addAppointment input:checked').length, 1, 'Add appointments checkbox is checked');
      click('button:contains(Update)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.equal(find('.modal-title').text(), 'Role Saved', 'Role has been saved');
      assert.equal(find('.modal-body').text().trim(), 'The Doctor role has been saved.', 'Doctor role has been saved');
      click('button:contains(Ok)');
      invalidateSession();
      visit('/login');
    });
    andThen(() => {
      authenticateUser({
        name: 'doctor@hospitalrun.io',
        roles: ['Doctor', 'user'],
        role: 'Doctor',
        prefix: 'p1'
      });
    });
    visit('/appointments/edit/new');
    andThen(function() {
      assert.equal(currentURL(), '/appointments/edit/new', 'Doctor can now navigate to new appointments');
      assert.equal(find('.view-current-title').text(), 'New Appointment', 'New appointment screen displays');
    });
  });
});

import { test } from 'qunit';
import moduleForAcceptance from 'hospitalrun/tests/helpers/module-for-acceptance';
import { PREDEFINED_USER_ROLES } from 'hospitalrun/mixins/user-roles';

moduleForAcceptance('Acceptance | roles');

test('visiting /admin/roles', function(assert) {
  runWithPouchDump('admin', function() {
    authenticateUser();
    visit('/admin/roles');
    andThen(function() {
      assert.equal(currentURL(), '/admin/roles');
      select('.role-select', 'Doctor');
    });
    andThen(() => {
      assert.dom('.checkbox-appointments input').isNotChecked('Appointments checkbox is not checked');
      assert.dom('.checkbox-addAppointment input').isNotChecked('Add appointments checkbox is not checked');
    });
    click('.checkbox-appointments input');
    click('.checkbox-addAppointment input');
    andThen(() => {
      assert.dom('.checkbox-appointments input').isChecked('Appointments checkbox is checked');
      assert.dom('.checkbox-addAppointment input').isChecked('Add appointments checkbox is checked');
      click('button:contains(Update)');
      waitToAppear('.modal-dialog');
    });
    andThen(() => {
      assert.dom('.modal-title').hasText('Role Saved', 'Role has been saved');
      assert.dom('.modal-body').hasText('The Doctor role has been saved.', 'Doctor role has been saved');
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
      assert.dom('.view-current-title').hasText('New Appointment', 'New appointment screen displays');
    });
  });
});

PREDEFINED_USER_ROLES.forEach((role) => {
  if (role.defaultRoute && role.name !== 'User Administrator') {
    test(`Testing User Role homescreen for ${role.name}`, (assert) =>{
      runWithPouchDump('default', () => {
        authenticateUser({
          roles: role.roles,
          role: role.name,
          authenticated: {
            role: role.name
          }
        });
        visit('/');
        waitToAppear('.view-current-title');
        andThen(() => {
          let defaultURL = role.defaultRoute.replace('.index', '');
          if (defaultURL === 'users') {
            defaultURL = 'admin/users';
          }
          assert.equal(currentURL(), `/${defaultURL}`, `Correct homepage displays for role ${role.name}`);
          invalidateSession();
        });
      });
    });
  }
});

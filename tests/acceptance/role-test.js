import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import runWithPouchDump from 'hospitalrun/tests/helpers/run-with-pouch-dump';
import select from 'hospitalrun/tests/helpers/select';
import { waitToAppear } from 'hospitalrun/tests/helpers/wait-to-appear';
import { authenticateUser, invalidateSession } from 'hospitalrun/tests/helpers/authenticate-user';
import { PREDEFINED_USER_ROLES } from 'hospitalrun/mixins/user-roles';

module('Acceptance | roles', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /admin/roles', function(assert) {
    return runWithPouchDump('admin', async function() {
      await authenticateUser();
      await visit('/admin/roles');
      assert.equal(currentURL(), '/admin/roles');

      await select('.role-select', 'Doctor');
      assert.dom('.checkbox-appointments input').isNotChecked('Appointments checkbox is not checked');
      assert.dom('.checkbox-addAppointment input').isNotChecked('Add appointments checkbox is not checked');

      await click('.checkbox-appointments input');
      await click('.checkbox-addAppointment input');
      assert.dom('.checkbox-appointments input').isChecked('Appointments checkbox is checked');
      assert.dom('.checkbox-addAppointment input').isChecked('Add appointments checkbox is checked');

      await click('button:contains(Update)');
      await waitToAppear('.modal-dialog');
      assert.dom('.modal-title').hasText('Role Saved', 'Role has been saved');
      assert.dom('.modal-body').hasText('The Doctor role has been saved.', 'Doctor role has been saved');

      await click('button:contains(Ok)');
      await invalidateSession();
      await visit('/login');

      await authenticateUser({
        name: 'doctor@hospitalrun.io',
        roles: ['Doctor', 'user'],
        role: 'Doctor',
        prefix: 'p1'
      });

      await visit('/appointments/edit/new');
      assert.equal(currentURL(), '/appointments/edit/new', 'Doctor can now navigate to new appointments');
      assert.dom('.view-current-title').hasText('New Appointment', 'New appointment screen displays');
    });
  });

  PREDEFINED_USER_ROLES.forEach((role) => {
    if (role.defaultRoute && role.name !== 'User Administrator') {
      test(`Testing User Role homescreen for ${role.name}`, (assert) =>{
        return runWithPouchDump('default', async function() {
          await authenticateUser({
            roles: role.roles,
            role: role.name,
            authenticated: {
              role: role.name
            }
          });

          await visit('/');
          await waitToAppear('.view-current-title');

          let defaultURL = role.defaultRoute.replace('.index', '');
          if (defaultURL === 'users') {
            defaultURL = 'admin/users';
          }
          assert.equal(currentURL(), `/${defaultURL}`, `Correct homepage displays for role ${role.name}`);

          await invalidateSession();
        });
      });
    }
  });
});

import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
import UserRoles from 'hospitalrun/mixins/user-roles';

export default AbstractPagedController.extend(UserSession, UserRoles, {
  addPermission: 'add_user',
  deletePermission: 'delete_user',
  sortProperties: ['displayName'],
  namedRolesChanged: Ember.observer('namedRoles', function() {
    let namedRoles = this.get('namedRoles');
    this.get('model').forEach((user) => {
      let roleId = user.get('roleId');
      if (roleId === undefined) {
        roleId = user.get('displayRole').dasherize();
        user.set('roleId', roleId);
      }
      let namedRole = namedRoles.findBy('id', roleId);
      if (namedRole === undefined) {
        return;
      }
      user.set('displayRole', namedRole.name);
    });
  })
});

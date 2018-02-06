import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
import UserRoles from 'hospitalrun/mixins/user-roles';

export default AbstractPagedController.extend(UserSession, UserRoles, {
  addPermission: 'add_user',
  deletePermission: 'delete_user',
  sortProperties: ['displayName'],
  users: Ember.computed.map('model', function(user) {
    this.loadRoles().then(function(named) {
      let namedRoles = named.get('content');
      let roleId = user.get('roleId');
      if (roleId === undefined) {
        roleId = user.get('displayRole').dasherize();
        user.set('roleId', roleId);
      }
      let namedRole = namedRoles.findBy('id', roleId);
      if (namedRole === undefined) {
        return;
      }
      user.set('displayRole', namedRole.getRecord().get('name'));
    });
    return user;
  })
});

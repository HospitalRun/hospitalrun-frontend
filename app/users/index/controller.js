import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractPagedController.extend(UserSession, {
  addPermission: 'add_user',
  deletePermission: 'delete_user',
  sortProperties: ['displayName']

});

import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import UserSession from 'hospitalrun/mixins/user-session';
import Ember from 'ember';
export default AbstractPagedController.extend(UserSession, {
  addPermission: 'add_user',
  config: Ember.inject.service(),
  deletePermission: 'delete_user',
  init() {
    let user = this.get('model');
    if (!Ember.isEmpty(user)) {
      this.get('config').markUserSetupComplete();
    }
  },
  sortProperties: ['displayName']
});

import { isEmpty } from '@ember/utils';
import { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import UserRoles from 'hospitalrun/mixins/user-roles';
import uuid from 'uuid';

export default AbstractEditController.extend(UserRoles, {
  config: service(),
  usersController: controller('users/index'),
  updateCapability: 'add_user',

  users: null,

  actions: {
    update() {
      let updateModel = this.get('model');
      let users = this.get('users');

      if (updateModel.get('isNew')) {
        let newData = updateModel.getProperties('password', 'email', 'roles', 'displayName');
        newData.name = newData.email;
        newData.id = `org.couchdb.user:${newData.email}`;
        if (isEmpty(newData.password)) {
          newData.password = uuid.v4() + uuid.v4();
        }
        updateModel.deleteRecord();
        updateModel = this.get('store').createRecord('user', newData);
        this.set('model', updateModel);
      }

      if (isEmpty(updateModel.get('userPrefix'))) {
        let counter = 1;
        let prefix = 'p';
        let userPrefix = prefix + 0;
        let usedPrefix = users.findBy('userPrefix', prefix);

        while (!isEmpty(usedPrefix)) {
          prefix = userPrefix + counter++;
          usedPrefix = users.findBy('userPrefix', prefix);
        }
        updateModel.set('userPrefix', prefix);
      }
      updateModel.save().then(() => {
        this.displayAlert(get(this, 'intl').t('messages.userSaved'), get(this, 'intl').t('messages.userHasBeenSaved'));
        let editTitle = get(this, 'intl').t('labels.editUser');
        let sectionDetails = {};
        sectionDetails.currentScreenTitle = editTitle;
        this.send('setSectionHeader', sectionDetails);
        get(this, 'config').markUserSetupComplete();
      }).catch((error) =>  {
        this._handleError(error);
      });
    }
  }
});

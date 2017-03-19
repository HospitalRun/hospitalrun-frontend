import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import UserRoles from 'hospitalrun/mixins/user-roles';
import uuid from 'npm:uuid';

const {
  get
} = Ember;

export default AbstractEditController.extend(UserRoles, {
  config: Ember.inject.service(),
  usersController: Ember.inject.controller('users/index'),
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
        if (Ember.isEmpty(newData.password)) {
          newData.password = uuid.v4() + uuid.v4();
        }
        updateModel.deleteRecord();
        updateModel = this.get('store').createRecord('user', newData);
        this.set('model', updateModel);
      }

      if (Ember.isEmpty(updateModel.get('userPrefix'))) {
        let counter = 1;
        let prefix = 'p';
        let userPrefix = prefix + 0;
        let usedPrefix = users.findBy('userPrefix', prefix);

        while (!Ember.isEmpty(usedPrefix)) {
          prefix = userPrefix + counter++;
          usedPrefix = users.findBy('userPrefix', prefix);
        }
        updateModel.set('userPrefix', prefix);
      }
      updateModel.save().then(() => {
        this.get('config').markSetupComplete();
        this.displayAlert(get(this, 'i18n').t('messages.userSaved'), get(this, 'i18n').t('messages.userHasBeenSaved'));
        let editTitle = get(this, 'i18n').t('labels.editUser');
        let sectionDetails = {};
        sectionDetails.currentScreenTitle = editTitle;
        this.send('setSectionHeader', sectionDetails);
      }).catch((error) =>  {
        this._handleError(error);
      });
    }
  }
});

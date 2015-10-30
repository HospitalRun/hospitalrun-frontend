import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import UserRoles from 'hospitalrun/mixins/user-roles';

export default AbstractEditController.extend(UserRoles, {
  needs: 'users/index',
  usersController: Ember.inject.controller('users/index'),
  updateCapability: 'add_user',

  users: Ember.computed.alias('usersController.model'),

  actions: {
    update: function() {
      var updateModel = this.get('model'),
        users = this.get('users');

      if (updateModel.get('isNew')) {
        var newData = updateModel.getProperties('password', 'email', 'roles', 'displayName');
        newData.name = newData.email;
        newData.id = 'org.couchdb.user:' + newData.email;
        if (Ember.isEmpty(newData.password)) {
          newData.password = uuid.v4() + uuid.v4();
        }
        updateModel.deleteRecord();
        updateModel = this.get('store').createRecord('user', newData);
        this.set('model', updateModel);
      }

      if (Ember.isEmpty(updateModel.get('userPrefix'))) {
        var counter = 1,
          prefix = 'p',
          userPrefix = prefix + 0,
          usedPrefix = users.findBy('userPrefix', prefix);

        while (!Ember.isEmpty(usedPrefix)) {
          prefix = userPrefix + counter++;
          usedPrefix = users.findBy('userPrefix', prefix);
        }
        updateModel.set('userPrefix', prefix);
      }
      updateModel.save().then(function() {
        this.displayAlert('User Saved', 'The user has been saved.');
      }.bind(this));
    }
  }
});

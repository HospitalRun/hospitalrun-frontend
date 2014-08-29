import UserRoles from 'hospitalrun/mixins/user-roles';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(UserRoles, {
    updateCapability: 'add_user',

    actions: {
        update: function() {
            var updateModel = this.get('model'),
                users = this.get('users');
            
            if (this.get('isNew')) {
                var newData = updateModel.getProperties('password', 'email', 'roles', 'displayName');
                newData.name = newData.email;
                newData.id = 'org.couchdb.user:'+newData.email;
                if (Ember.isEmpty(newData.password)) {
                    newData.password = uuid.v4()+uuid.v4();
                }        
                updateModel.deleteRecord();
                updateModel = this.get('store').createRecord('user', newData);
                this.set('model', updateModel);
            } 
            
            if (Ember.isEmpty(this.get('userPrefix'))) {
                var counter = 1,
                    prefix = updateModel.get('name').toLowerCase().substr(0,3),
                    userPrefix = prefix,
                    usedPrefix = users.findBy('userPrefix', prefix);
                
                while (!Ember.isEmpty(usedPrefix)) {
                    prefix = userPrefix + counter++;
                    usedPrefix =users.findBy('userPrefix', prefix);
                }
                this.set('userPrefix', prefix);                
            }            
            updateModel.save().then(function() {
                this.send('closeModal');
            }.bind(this));
        }
    }
});

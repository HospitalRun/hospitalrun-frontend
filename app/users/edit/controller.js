import UserRoles from 'hospitalrun/mixins/user-roles';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(UserRoles, {
    title: function() {
        if (this.get('isNew')) {
            return 'New User';
        } else {
            return 'Edit User';
        }
    }.property('isNew'),

    actions: {
        update: function() {        
            var updateModel = this.get('model');        
            if (this.get('isNew')) {
                var newData = updateModel.getProperties('password', 'email', 'roles');    
                newData.name = newData.email;
                newData.id = 'org.couchdb.user:'+newData.email;
                if (Ember.isEmpty(newData.password)) {
                    newData.password = uuid.v4()+uuid.v4();
                }        
                updateModel.deleteRecord();
                updateModel = this.get('store').createRecord('user', newData);        
                this.set('model', updateModel);
            } 
            updateModel.save().then(function() {
                this.send('closeModal');
            }.bind(this));                
        }
    }
});

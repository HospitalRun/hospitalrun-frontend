export default Ember.ObjectController.extend({
    
    needs: ['users'],
    
    isEditing: false,
    
    actions: {
        cancelUpdate: function() {
            this.set('isEditing', false);
            this.get('model').rollback();
        },
        
        createUser: function() {
            var newUser = this.get('newUser');
            if (newUser && !newUser.trim()) {
                this.set('newUser', '');
                return;
            }
            var newPassword = this.get('newUserPw');

            // Create the new User model
            var user = this.store.createRecord('user', {
                id: 'org.couchdb.user:'+newUser,
                name: newUser,
                password: newPassword,
                roles: ['user']
            });

            // Save the new model
            user.save();
        },        
        deleteUser: function() {
            var user = this.get('model'); 
            user.deleteRecord();      
            user.save();    
        },
        editUser: function () {
            this.set('isEditing', true);
        },
        updateUser: function() {
            this.set('isEditing', false);
            this.get('model').save();
        }
    }
});

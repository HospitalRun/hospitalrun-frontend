export default Ember.ArrayController.extend({
    actions: {
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
                roles: this.get('newRoles')
            });

            // Save the new model
            var controller = this;
            user.save().then(function(record){                
                controller.store.reloadRecord(record);
                // Success callback
            }, function() {
                // Error callback
            });
        }
    }
});

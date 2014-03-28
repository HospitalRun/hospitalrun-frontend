export default Ember.ObjectController.extend({
    
    needs: ['users'],
    
    isEditing: false,
    
    userRoles: [
        {name: "Admin", roles: [
            'admin', 'user'
        ]},
        {name: "Business Office", roles: [
            'business_office', 
            'user']
        },
        {name: "Data Entry", roles: [
            'data_entry',
            'user'
        ]},
        {name: "Doctor", roles: ['doctor', 'user']},
        {name: "Hospital Manager", roles: ['hospital_manager', 'user']},
        {name: "Imaging Technician", roles: ['imaging_tech', 'user']},
        {name: "Lab Technician", roles: ['lab_tech', 'user']},
        {name: "Medical Records Officer", roles: ['medrec_officer', 'user']},
        {name: "Nurse", roles: ['nurse', 'user']},
        {name: "Patient Administration", roles: ['patient_admin', 'user']},
        {name: "Pharmacist", roles: ['pharmacist', 'user']},
    ],
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

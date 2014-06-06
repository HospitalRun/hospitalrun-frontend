export default Ember.Mixin.create({
    userRoles: [
        {name: 'Business Office', roles: ['Business Office', 'user']},
        {name: 'Data Entry', roles: ['Data Entry', 'user']},
        {name: 'Doctor', roles: ['Doctor', 'user']},
        {name: 'Hospital Manager', roles: ['Hospital Manager', 'user']},
        {name: 'Imaging Technician', roles: ['Imaging Technician', 'user']},
        {name: 'Lab Technician', roles: ['Lab Technician', 'user']},
        {name: 'Medical Records Officer', roles: ['Medical Records Officer', 'user']},
        {name: 'Nurse', roles: ['Nurse', 'user']},
        {name: 'Patient Administration', roles: ['Patient Administration', 'user']},
        {name: 'Pharmacist', roles: ['Pharmacist', 'user']},
        {name: 'System Administrator', roles: ['System Administrator','admin','user']}
    ]
});
    
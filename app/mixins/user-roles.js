import Ember from 'ember';
export default Ember.Mixin.create({
  userRoles: [
    { name: 'Data Entry', roles: ['Data Entry', 'user'] },
    { name: 'Doctor', roles: ['Doctor', 'user'] },
    { name: 'Finance', roles: ['Finance', 'user'] },
    { name: 'Finance Manager', roles: ['Finance Manager', 'user'] },
    { name: 'Hospital Administrator', roles: ['Hospital Administrator', 'user'] },
    { name: 'Inventory Manager', roles: ['Inventory Manager', 'user'] },
    { name: 'Imaging Technician', roles: ['Imaging Technician', 'user'] },
    { name: 'Lab Technician', roles: ['Lab Technician', 'user'] },
    { name: 'Medical Records Officer', roles: ['Medical Records Officer', 'user'] },
    { name: 'Nurse', roles: ['Nurse', 'user'] },
    { name: 'Nurse Manager', roles: ['Nurse Manager', 'user'] },
    { name: 'Patient Administration', roles: ['Patient Administration', 'user'] },
    { name: 'Pharmacist', roles: ['Pharmacist', 'user'] },
    { name: 'Social Worker', roles: ['Social Worker', 'user'] },
    { name: 'System Administrator', roles: ['System Administrator', 'admin', 'user'] },
    { name: 'User Administrator', roles: ['User Administrator', 'admin', 'user'] }
  ]
});

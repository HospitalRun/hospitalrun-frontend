import Ember from 'ember';
export default Ember.Mixin.create({
  userRoles: [
    { name: 'Data Entry', roles: ['Data Entry', 'user'], defaultRoute: 'patients' },
    { name: 'Doctor', roles: ['Doctor', 'user'], defaultRoute: 'patients'  },
    { name: 'Finance', roles: ['Finance', 'user'], defaultRoute: 'invoices'  },
    { name: 'Finance Manager', roles: ['Finance Manager', 'user'], defaultRoute: 'invoices' },
    { name: 'Hospital Administrator', roles: ['Hospital Administrator', 'user'], defaultRoute: 'invoices' },
    { name: 'Inventory Manager', roles: ['Inventory Manager', 'user'], defaultRoute: 'inventory' },
    { name: 'Imaging Technician', roles: ['Imaging Technician', 'user'], defaultRoute: 'imaging' },
    { name: 'Lab Technician', roles: ['Lab Technician', 'user'], defaultRoute: 'labs' },
    { name: 'Medical Records Officer', roles: ['Medical Records Officer', 'user'], defaultRoute: 'admin' },
    { name: 'Nurse', roles: ['Nurse', 'user'], defaultRoute: 'patients' },
    { name: 'Nurse Manager', roles: ['Nurse Manager', 'user'], defaultRoute: 'patients' },
    { name: 'Patient Administration', roles: ['Patient Administration', 'user'], defaultRoute: 'patients' },
    { name: 'Pharmacist', roles: ['Pharmacist', 'user'], defaultRoute: 'medication' },
    { name: 'Social Worker', roles: ['Social Worker', 'user'], defaultRoute: 'patients' },
    { name: 'System Administrator', roles: ['System Administrator', 'admin', 'user'], defaultRoute: 'admin' },
    { name: 'User Administrator', roles: ['User Administrator', 'admin', 'user'], defaultRoute: 'admin' }
  ]
});

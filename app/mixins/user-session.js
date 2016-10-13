import Ember from 'ember';
export default Ember.Mixin.create({
  session: Ember.inject.service(),
  defaultCapabilities: {
    admin: [
      'User Administrator',
      'System Administrator'
    ],
    appointments: [
      'Data Entry',
      'Finance',
      'Hospital Administrator',
      'Medical Records Officer',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],
    add_appointment: [
      'Data Entry',
      'Finance',
      'Hospital Administrator',
      'Medical Records Officer',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],
    add_charge: [
      'Data Entry',
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    add_diagnosis: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Patient Administration',
      'System Administrator'
    ],
    add_medication: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Pharmacist',
      'System Administrator'
    ],
    add_photo: [
      'Data Entry',
      'Hospital Administrator',
      'Medical Records Officer',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],
    add_patient: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],
    add_pricing: [
      'Data Entry',
      'Finance',
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    add_pricing_profile: [
      'Data Entry',
      'Finance',
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    add_lab: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Lab Technician',
      'System Administrator'
    ],
    add_imaging: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Imaging Technician',
      'Medical Records Officer',
      'System Administrator'
    ],
    add_inventory_request: [
      'Data Entry',
      'Hospital Administrator',
      'Inventory Manager',
      'Medical Records Officer',
      'Nurse Manager',
      'Pharmacist',
      'System Administrator'
    ],
    add_inventory_item: [
      'Data Entry',
      'Hospital Administrator',
      'Inventory Manager',
      'Medical Records Officer',
      'System Administrator'
    ],
    add_inventory_purchase: [
      'Data Entry',
      'Hospital Administrator',
      'Inventory Manager',
      'Medical Records Officer',
      'System Administrator'
    ],
    add_invoice: [
      'Data Entry',
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    add_payment: [
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    add_procedure: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Nurse',
      'Nurse Manager',
      'Patient Administration',
      'System Administrator'
    ],
    add_socialwork: [
      'Hospital Administrator',
      'Medical Records Officer',
      'Social Worker',
      'System Administrator'
    ],
    add_user: [
      'User Administrator',
      'System Administrator'
    ],
    add_visit: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Nurse',
      'Nurse Manager',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],
    add_vitals: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Nurse',
      'Nurse Manager',
      'System Administrator'
    ],
    admit_patient: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Nurse',
      'Nurse Manager',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],
    adjust_inventory_location: [
      'Hospital Administrator',
      'Inventory Manager',
      'Medical Records Officer',
      'System Administrator'
    ],
    billing: [
      'Hospital Administrator',
      'Finance',
      'Finance Manager',
      'System Administrator'
    ],
    complete_imaging: [
      'Imaging Technician',
      'Medical Records Officer',
      'System Administrator'
    ],
    complete_lab: [
      'Lab Technician',
      'Medical Records Officer',
      'System Administrator'
    ],
    delete_appointment: [
      'Hospital Administrator',
      'Medical Records Officer',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],
    delete_diagnosis: [
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Patient Administration',
      'System Administrator'
    ],
    delete_inventory_item: [
      'Hospital Administrator',
      'Inventory Manager',
      'Medical Records Officer',
      'System Administrator'
    ],
    delete_imaging: [
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    delete_invoice: [
      'Hospital Administrator',
      'System Administrator'
    ],
    delete_lab: [
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    delete_medication: [
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    delete_photo: [
      'Data Entry',
      'Hospital Administrator',
      'Medical Records Officer',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],
    delete_patient: [
      'Hospital Administrator',
      'Medical Records Officer',
      'Patient Administration',
      'System Administrator'
    ],
    delete_pricing: [
      'Finance',
      'Data Entry',
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    delete_pricing_profile: [
      'Finance',
      'Data Entry',
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    delete_procedure: [
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Nurse',
      'Nurse Manager',
      'Patient Administration',
      'System Administrator'
    ],
    delete_socialwork: [
      'Hospital Administrator',
      'Medical Records Officer',
      'Social Worker',
      'System Administrator'
    ],
    delete_vitals: [
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Nurse',
      'Nurse Manager',
      'System Administrator'
    ],
    delete_visit: [
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Nurse',
      'Nurse Manager',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],
    delete_user: [
      'User Administrator',
      'System Administrator'
    ],
    discharge_patient: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Nurse',
      'Nurse Manager',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],
    edit_invoice: [
      'Data Entry',
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    fulfill_inventory: [
      'Hospital Administrator',
      'Inventory Manager',
      'Medical Records Officer',
      'Pharmacist',
      'System Administrator'
    ],
    fulfill_medication: [
      'Medical Records Officer',
      'Pharmacist',
      'System Administrator'
    ],
    imaging: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Imaging Technician',
      'Medical Records Officer',
      'System Administrator'
    ],
    invoices: [
      'Hospital Administrator',
      'Finance',
      'Finance Manager',
      'System Administrator'
    ],
    labs: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Lab Technician',
      'Medical Records Officer',
      'System Administrator'
    ],
    medication: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Pharmacist',
      'System Administrator'
    ],
    inventory: [
      'Data Entry',
      'Hospital Administrator',
      'Inventory Manager',
      'Medical Records Officer',
      'Nurse Manager',
      'Pharmacist',
      'System Administrator'
    ],
    load_db: [
      'System Administrator'
    ],
    override_invoice: [
      'Hospital Administrator',
      'System Administrator'
    ],
    query_db: [
      'System Administrator'
    ],
    patients: [
      'Data Entry',
      'Doctor',
      'Finance',
      'Finance Manager',
      'Hospital Administrator',
      'Imaging Technician',
      'Lab Technician',
      'Medical Records Officer',
      'Nurse',
      'Nurse Manager',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],

    patient_reports: [
      'Hospital Administrator',
      'Patient Administration',
      'System Administrator'
    ],

    pricing: [
      'Data Entry',
      'Finance',
      'Hospital Administrator',
      'Medical Records Officer',
      'System Administrator'
    ],
    visits: [
      'Data Entry',
      'Doctor',
      'Hospital Administrator',
      'Medical Records Officer',
      'Nurse Manager',
      'Nurse',
      'Patient Administration',
      'Social Worker',
      'System Administrator'
    ],
    update_config: [
      'System Administrator'
    ],
    users: [
      'User Administrator',
      'System Administrator'
    ],
    add_note: [
      'Doctor',
      'Medical Records Officer',
      'Nurse',
      'Nurse Manager',
      'Patient Administration',
      'System Administrator'
    ],
    delete_note: [
      'Medical Records Officer',
      'Nurse Manager',
      'Patient Administration',
      'System Administrator'
    ],
    'user_roles': [
      'System Administrator'
    ]
  },

  _getUserSessionVars: function() {
    let session = this.get('session');
    if (!Ember.isEmpty(session) && session.get('isAuthenticated')) {
      return session.get('data.authenticated');
    }
  },

  currentUserCan: function(capability) {
    let sessionVars = this._getUserSessionVars();
    if (!Ember.isEmpty(sessionVars) && !Ember.isEmpty(sessionVars.role)) {
      let userCaps = this.get('session').get('data.authenticated.userCaps');
      if (Ember.isEmpty(userCaps)) {
        let capabilities = this.get('defaultCapabilities');
        let supportedRoles = capabilities[capability];
        if (!Ember.isEmpty(supportedRoles)) {
          return supportedRoles.includes(sessionVars.role);
        }
      } else {
        return userCaps.includes(capability);
      }
    }
    return false;
  },

  /**
   * Returns the display name of the user or the username if
   * the display name is not set or if the username is explictly requested.
   * @param {boolean} returnUserName if true, always return the username instead
   * of the display name even if the display name is set.
   */
  getUserName: function(returnUserName) {
    let returnName;
    let sessionVars = this._getUserSessionVars();
    if (!Ember.isEmpty(sessionVars)) {
      if (returnUserName) {
        returnName = sessionVars.name;
      } else if (!Ember.isEmpty(sessionVars.displayName)) {
        returnName = sessionVars.displayName;
      } else if (!Ember.isEmpty(sessionVars.name)) {
        returnName = sessionVars.name;
      }
    }
    return returnName;
  }
});

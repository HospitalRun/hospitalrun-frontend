export default Ember.Mixin.create({
    defaultCapabilities: {
        appointments: [
            'Data Entry',
            'Hospital Manager',
            'Medical Records Officer',
            'Patient Administration', 
            'Social Worker', 
            'System Administrator'
        ],
        add_appointment: [
            'Data Entry',
            'Medical Records Officer',
            'Patient Administration',  
            'Social Worker', 
            'System Administrator'
        ],
        add_diagnosis: [
            'Data Entry',
            'Doctor',
            'Medical Records Officer',
            'Patient Administration', 
            'System Administrator'
        ],
        add_medication: [
            'Data Entry',
            'Doctor',
            'Medical Records Officer',
            'Pharmacist', 
            'System Administrator'
        ],
        add_patient: [
            'Data Entry',
            'Doctor', 
            'Medical Records Officer',
            'Patient Administration', 
            'Social Worker', 
            'System Administrator'
        ],
        add_lab: [
            'Data Entry',
            'Doctor', 
            'Medical Records Officer',
            'Lab Technician', 
            'System Administrator'
        ],
        add_imaging: [
            'Data Entry',
            'Doctor', 
            'Imaging Technician', 
            'Medical Records Officer',
            'System Administrator'
        ],
        add_inventory_request: [
            'Data Entry',
            'Inventory Manager', 
            'Medical Records Officer',
            'Nurse Manager',
            'Pharmacist',
            'System Administrator'
        ],        
        add_inventory_item: [
            'Data Entry',
            'Inventory Manager',
            'Medical Records Officer',
            'System Administrator'
        ],
        add_inventory_purchase: [
            'Data Entry',
            'Inventory Manager', 
            'Medical Records Officer',
            'System Administrator'
        ],
        add_invoice: [
            'Data Entry',
            'Business Office', 
            'Medical Records Officer',
            'System Administrator' 
        ],
        add_procedure: [
            'Data Entry',
            'Doctor',
            'Medical Records Officer',
            'Nurse', 
            'Nurse Manager', 
            'Patient Administration', 
            'System Administrator'
        ],
        add_user: [
            'System Administrator'
        ],
        add_visit: [
            'Data Entry',
            'Doctor',
            'Medical Records Officer',
            'Nurse', 
            'Nurse Manager', 
            'Patient Administration', 
            'System Administrator'
        ],        
        add_vitals: [
            'Data Entry',
            'Doctor',
            'Medical Records Officer',
            'Nurse', 
            'Nurse Manager', 
            'System Administrator'
        ],        
        adjust_inventory_location: [
            'Inventory Manager',
            'Medical Records Officer',
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
            'Medical Records Officer',
            'Patient Administration', 
            'Social Worker', 
            'System Administrator'
        ],
        delete_diagnosis: [
            'Doctor',
            'Medical Records Officer',
            'Patient Administration', 
            'System Administrator'
        ],        
        delete_inventory_item: [
            'Inventory Manager', 
            'Medical Records Officer',
            'System Administrator'
        ],
        delete_inventory_purchase: [
            'Inventory Manager', 
            'Medical Records Officer',
            'System Administrator'
        ],
        delete_imaging: [
            'Doctor', 
            'Medical Records Officer',
            'System Administrator'
        ],
        delete_lab: [
            'Doctor', 
            'Medical Records Officer',
            'System Administrator'
        ],
        delete_medication: [
            'Doctor', 
            'Medical Records Officer',
            'System Administrator'
        ],
        delete_patient: [
            'Medical Records Officer',
            'Patient Administration', 
            'System Administrator'
        ],
        delete_procedure: [
            'Doctor', 
            'Medical Records Officer',
            'Nurse', 
            'Nurse Manager', 
            'Patient Administration', 
            'System Administrator'
        ],
        delete_vitals: [
            'Doctor',
            'Medical Records Officer',
            'Nurse', 
            'Nurse Manager', 
            'System Administrator'
        ],
        delete_visit: [
            'Doctor',
            'Medical Records Officer',
            'Nurse', 
            'Nurse Manager', 
            'Patient Administration', 
            'System Administrator'
        ],
        delete_user: [
            'System Administrator'
        ],
        fulfill_inventory: [
            'Inventory Manager',
            'Medical Records Officer',
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
            'Hospital Manager',
            'Imaging Technician', 
            'Medical Records Officer',
            'System Administrator'
        ],
        labs: [
            'Data Entry',
            'Doctor', 
            'Hospital Manager',
            'Lab Technician',
            'Medical Records Officer',
            'System Administrator'
        ],
        medication: [
            'Data Entry',
            'Doctor', 
            'Hospital Manager',
            'Medical Records Officer',
            'Pharmacist', 
            'System Administrator'
        ],
        inventory: [
            'Data Entry',
            'Hospital Manager',
            'Inventory Manager',
            'Medical Records Officer',
            'Nurse Manager', 
            'Pharmacist',
            'System Administrator'
        ],
        patients: [
            'Data Entry',
            'Doctor', 
            'Hospital Manager',
            'Medical Records Officer',
            'Nurse', 
            'Nurse Manager', 
            'Patient Administration', 
            'Social Worker', 
            'System Administrator'
        ],
        visits: [
            'Data Entry',
            'Doctor', 
            'Hospital Manager',
            'Medical Records Officer',
            'Nurse Manager', 
            'Nurse',  
            'Patient Administration', 
            'System Administrator'
        ],
        users: [
            'System Administrator'
        ]
    },    
    
    _getUserSessionVars: function() {
        var session = this.get('session');
        if (!Ember.isEmpty(session) && session.isAuthenticated) {
            var sessionVars = session.store.restore();
            return sessionVars;
        }
    },
    
    currentUserCan: function(capability) {
        var sessionVars = this._getUserSessionVars();
        if (!Ember.isEmpty(sessionVars) && !Ember.isEmpty(sessionVars.role)) {
            var capabilities = this.get('defaultCapabilities'),
                supportedRoles = capabilities[capability];
            if (!Ember.isEmpty(supportedRoles)) {
                return supportedRoles.contains(sessionVars.role);
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
        var returnName,
            sessionVars = this._getUserSessionVars();
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
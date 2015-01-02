import Ember from "ember";
export default Ember.Mixin.create({
    defaultCapabilities: {
        admin: [
            'User Administrator',
            'System Administrator'
        ],
        appointments: [
            'Data Entry',
            'Hospital Administrator',
            'Medical Records Officer',
            'Patient Administration', 
            'Social Worker', 
            'System Administrator'
        ],
        add_appointment: [
            'Data Entry',
            'Hospital Administrator',
            'Medical Records Officer',
            'Patient Administration',  
            'Social Worker', 
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
            'Business Office', 
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
            'Data Entry',
            'Hospital Administrator',
            'Medical Records Officer',
            'Patient Administration', 
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
        delete_inventory_purchase: [
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
            'Business Office', 
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
            'Data Entry',
            'Hospital Administrator',
            'Medical Records Officer',
            'Patient Administration', 
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
        edit_invoice: [
            'Data Entry',
            'Business Office', 
            'Hospital Administrator',
            'Medical Records Officer',
            'System Administrator' 
        ],
        fulfill_inventory: [
            'Hospital Administrator',
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
            'Hospital Administrator',
            'Imaging Technician', 
            'Medical Records Officer',
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
        override_invoice: [
            'Business Office', 
            'Hospital Administrator',
            'System Administrator' 
        ],
        query_db: [
            'System Administrator'
        ],
        patients: [
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
export default Ember.Mixin.create({
    defaultCapabilities: {
        appointments: [
            'Data Entry',
            'Hospital Manager',
            'Patient Administration', 
            'Social Worker', 
            'System Administrator'
        ],
        add_appointment: [
            'Data Entry',
            'Patient Administration',  'Social Worker', 'System Administrator'
        ],
        add_diagnosis: [
            'Data Entry',
            'Doctor', 'Patient Administration', 'System Administrator'
        ],
        add_medication: [
            'Data Entry',
            'Doctor', 'Pharmacist', 'System Administrator'
        ],
        add_patient: [
            'Data Entry',
            'Patient Administration', 'Social Worker', 'Doctor', 'System Administrator'
        ],
        add_lab: [
            'Data Entry',
            'Doctor', 'Lab Technician', 'System Administrator'
        ],
        add_imaging: [
            'Data Entry',
            'Doctor', 'Imaging Technician', 'System Administrator'
        ],
        add_inventory_request: [
            'Data Entry',
            'Inventory Manager', 'Nurse Manager',
            'Pharmacist',
            'System Administrator'
        ],        
        add_inventory_item: [
            'Data Entry',
            'Inventory Manager', 'System Administrator'
        ],
        add_inventory_purchase: [
            'Data Entry',
            'Inventory Manager', 'System Administrator'
        ],
        add_invoice: [
            'Data Entry',
            'Business Office', 'System Administrator' 
        ],
        add_procedure: [
            'Data Entry',
            'Doctor', 'Nurse', 'Nurse Manager', 'Patient Administration', 'System Administrator'
        ],
        add_user: [
            'System Administrator'
        ],
        add_visit: [
            'Data Entry',
            'Doctor', 'Nurse', 'Nurse Manager', 'Patient Administration', 'System Administrator'
        ],        
        add_vitals: [
            'Data Entry',
            'Doctor', 'Nurse', 'Nurse Manager', 'System Administrator'
        ],        
        adjust_inventory_location: [
            'Inventory Manager', 'System Administrator'
        ],        
        complete_imaging: [
            'Imaging Technician', 'System Administrator'
        ],
        complete_lab: [
            'Lab Technician', 'System Administrator'
        ],
        delete_appointment: [
            'Patient Administration', 'Social Worker', 'System Administrator'
        ],
        delete_diagnosis: [
            'Doctor', 'Patient Administration', 'System Administrator'
        ],        
        delete_inventory_item: [
            'Inventory Manager', 'System Administrator'
        ],
        delete_inventory_purchase: [
            'Inventory Manager', 'System Administrator'
        ],
        delete_imaging: [
            'Doctor', 'System Administrator'
        ],
        delete_lab: [
            'Doctor', 'System Administrator'
        ],
        delete_medication: [
            'Doctor', 'System Administrator'
        ],
        delete_patient: [
            'Patient Administration', 'System Administrator'
        ],
        delete_procedure: [
            'Doctor', 'Nurse', 'Nurse Manager', 'Patient Administration', 'System Administrator'
        ],
        delete_vitals: [
            'Doctor', 'Nurse', 'Nurse Manager', 'System Administrator'
        ],
        delete_visit: [
            'Doctor', 'Nurse', 'Nurse Manager', 'Patient Administration', 'System Administrator'
        ],
        delete_user: [
            'System Administrator'
        ],
        fulfill_inventory: [
            'Inventory Manager', 'System Administrator'
        ],
        fulfill_medication: [
            'Pharmacist', 'System Administrator'
        ],
        imaging: [
            'Data Entry',
            'Imaging Technician', 'Doctor', 'System Administrator'
        ],
        labs: [
            'Data Entry',
            'Lab Technician', 'Doctor', 'System Administrator'
        ],
        medication: [
            'Data Entry',
            'Pharmacist', 'Doctor', 'System Administrator'
        ],
        inventory: [
            'Data Entry',
            'Inventory Manager', 'Nurse Manager', 
            'Pharmacist',
            'System Administrator'
        ],
        patients: [
            'Data Entry',
            'Doctor', 'Nurse', 'Nurse Manager', 'Patient Administration', 'Social Worker', 'System Administrator'
        ],
        visits: [
            'Data Entry',
            'Doctor', 'Nurse',  'Nurse Manager', 'Patient Administration', 'System Administrator'
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
    
    getUserName: function() {
        var returnName,
            sessionVars = this._getUserSessionVars();
        if (!Ember.isEmpty(sessionVars)) {
            if (!Ember.isEmpty(sessionVars.displayName)) {
                returnName = sessionVars.displayName;
            } else if (!Ember.isEmpty(sessionVars.name)) {
                returnName = sessionVars.name;
            }
        }
        return returnName;
    }
});
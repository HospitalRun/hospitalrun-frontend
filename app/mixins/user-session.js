export default Ember.Mixin.create({
    defaultCapabilities: {
        appointments: [
            'Patient Administration', 'Social Worker'
        ],
        add_appointment: [
            'Patient Administration',  'Social Worker'
        ],
        add_diagnosis: [
            'Doctor', 'Patient Administration'
        ],
        add_medication: [
            'Doctor', 'Pharmacist'
        ],
        add_patient: [
            'Patient Administration', 'Social Worker', 'Doctor'
        ],
        add_lab: [
            'Doctor', 'Lab Technician'
        ],
        add_imaging: [
            'Doctor', 'Imaging Technician'
        ],
        add_inventory_request: [
            'Inventory Manager', 'Nurse Manager'
        ],        
        add_inventory_item: [
            'Inventory Manager',
        ],
        add_inventory_purchase: [
            'Inventory Manager'
        ],
        add_invoice: [
            'Business Office' 
        ],
        add_procedure: [
            'Doctor', 'Nurse', 'Nurse Manager', 'Patient Administration'
        ],
        add_user: [
            'System Administrator'
        ],
        add_visit: [
            'Doctor', 'Nurse', 'Nurse Manager', 'Patient Administration'
        ],        
        add_vitals: [
            'Doctor', 'Nurse', 'Nurse Manager'
        ],        
        adjust_inventory_location: [
            'Inventory Manager'
        ],        
        complete_imaging: [
            'Imaging Technician'
        ],
        complete_lab: [
            'Lab Technician'
        ],
        delete_appointment: [
            'Patient Administration', 'Social Worker'
        ],
        delete_diagnosis: [
            'Doctor', 'Patient Administration'
        ],        
        delete_inventory_item: [
            'Inventory Manager'
        ],
        delete_inventory_purchase: [
            'Inventory Manager'
        ],
        delete_imaging: [
            'Doctor'
        ],
        delete_lab: [
            'Doctor'
        ],
        delete_medication: [
            'Doctor'
        ],
        delete_patient: [
            'Patient Administration'
        ],
        delete_procedure: [
            'Doctor', 'Nurse', 'Nurse Manager', 'Patient Administration'
        ],
        delete_vitals: [
            'Doctor', 'Nurse', 'Nurse Manager'
        ],
        delete_visit: [
            'Doctor', 'Nurse', 'Nurse Manager', 'Patient Administration'
        ],
        delete_user: [
            'System Administrator'
        ],
        fulfill_inventory: [
            'Inventory Manager'
        ],
        fulfill_medication: [
            'Pharmacist'
        ],
        imaging: [
            'Imaging Technician', 'Doctor'
        ],
        labs: [
            'Lab Technician', 'Doctor'
        ],
        medication: [
            'Pharmacist', 'Doctor'
        ],
        inventory: [
            'Inventory Manager', , 'Nurse Manager'
        ],
        patients: [
            'Doctor', 'Nurse', 'Nurse Manager', 'Patient Administration', 'Social Worker'
        ],
        visits: [
            'Doctor', 'Nurse',  'Nurse Manager', 'Patient Administration'
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
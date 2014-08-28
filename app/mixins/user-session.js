export default Ember.Mixin.create({
    defaultCapabilities: {
        appointments: [
            'Patient Administration', 'System Administrator'
        ],
        add_appointment: [
            'Patient Administration', 'System Administrator'
        ],
        add_diagnosis: [
            'Doctor', 'Patient Administration', 'System Administrator'
        ],
        add_medication: [
            'Doctor', 'System Administrator'
        ],
        add_patient: [
            'Patient Administration', 'System Administrator'
        ],
        add_lab: [
            'Doctor', 'System Administrator'
        ],
        add_imaging: [
            'Doctor', 'System Administrator'
        ],
        add_inventory_request: [
            'Inventory Manager', 'System Administrator'
        ],        
        add_inventory_item: [
            'Inventory Manager', 'System Administrator'
        ],
        add_inventory_purchase: [
            'Inventory Manager', 'System Administrator'
        ],
        add_invoice: [
            'Business Office', 'System Administrator'
        ],
        add_procedure: [
            'Doctor', 'Nurse', 'Patient Administration', 'System Administrator'
        ],
        add_user: [
            'System Administrator'
        ],
        add_visit: [
            'Doctor', 'Nurse', 'Patient Administration', 'System Administrator'
        ],        
        add_vitals: [
            'Doctor', 'Nurse', 'System Administrator'
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
            'Patient Administration', 'System Administrator'
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
            'Doctor', 'Nurse', 'Patient Administration', 'System Administrator'
        ],
        delete_vitals: [
            'Doctor', 'Nurse', 'System Administrator'
        ],
        delete_visit: [
            'Doctor', 'Nurse', 'Patient Administration', 'System Administrator'
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
            'Imaging Technician', 'System Administrator'
        ],
        labs: [
            'Lab Technician', 'System Administrator'
        ],
        medication: [
            'Pharmacist', 'System Administrator'
        ],
        inventory: [
            'Inventory Manager', 'System Administrator'
        ],
        patients: [
            'Doctor', 'Nurse', 'Patient Administration', 'System Administrator'
        ],
        visits: [
            'Doctor', 'Nurse', 'Patient Administration', 'System Administrator'
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
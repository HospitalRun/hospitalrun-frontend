var get = Ember.get;

export default Ember.Select.extend({
    content: [
        {name: 'Admin', roles: ['admin', 'user']},
        {name: 'Business Office', roles: ['business_office', 'user']},
        {name: 'Data Entry', roles: ['data_entry', 'user']},
        {name: 'Doctor', roles: ['doctor', 'user']},
        {name: 'Hospital Manager', roles: ['hospital_manager', 'user']},
        {name: 'Imaging Technician', roles: ['imaging_tech', 'user']},
        {name: 'Lab Technician', roles: ['lab_tech', 'user']},
        {name: 'Medical Records Officer', roles: ['medrec_officer', 'user']},
        {name: 'Nurse', roles: ['nurse', 'user']},
        {name: 'Patient Administration', roles: ['patient_admin', 'user']},
        {name: 'Pharmacist', roles: ['pharmacist', 'user']},
    ],
        
    optionValuePath: 'content.roles',
    optionLabelPath: 'content.name',
    
    valueDidChange: Ember.observer('value', function() {
        var content = get(this, 'content'),
        value = get(this, 'value'),
        valuePath = get(this, 'optionValuePath').replace(/^content\.?/, ''),
        selectedValue = (valuePath ? get(this, 'selection.' + valuePath) : get(this, 'selection')),
        selection;
        if (Ember.compare(value,selectedValue) !== 0)  {
            selection = content ? content.find(
                function(obj) {                    
                    return Ember.compare(value,(valuePath ? get(obj, valuePath) : obj)) === 0;
                }) : null;
            this.set('selection', selection);
        }
    }),
});

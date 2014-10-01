export default Ember.ArrayController.extend({
    lookupTypes: [{
        name: 'Clinic Locations',
        value: 'clinic_list'
    }, {
        name: 'Countries',
        value: 'country_list'
    }, {
        name: 'Delivery Locations',
        value: 'delivery_location_list'
    }, {
        name: 'Expense Accounts',
        value: 'expense_account_list'
    }, {
        name: 'Imaging Types',
        value: 'imaging_types'
    }, {
        name: 'Inventory Aisle Locations',
        value: 'aisle_location_list'
    }, {
        name: 'Inventory Locations',
        value: 'warehouse_list'
    }, {
        name: 'Lab Types',
        value: 'lab_types'
    }, {
        name: 'Medication Frequency',
        value: 'medication_frequency'
    }, {
        name: 'Physicians',
        value: 'physician_list'
    }, {
        name: 'Visit Locations',
        value: 'visit_location_list'
    }],
    
    lookupTypeValues: function() {
        var lookupType = this.get('lookupType');
        return this.get('model').findBy('id', lookupType);
    }.property('lookupType')
});
export default Ember.ArrayController.extend({
    lookupType: null,
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
    
    lookupTitle: function() {
        var lookupType = this.get('lookupType'),
            lookupTypes = this.get('lookupTypes'),
            lookupDesc = lookupTypes.findBy('value', lookupType);
        if (!Ember.isEmpty(lookupDesc)) {
            return lookupDesc.name;
        }            
    }.property('lookupType'),
    
    lookupTypeList: function() {
        var lookupType = this.get('lookupType'),
            lookupItem = this.get('model').findBy('id', lookupType);
        if (Ember.isEmpty(lookupItem)) {
            lookupItem = this.get('store').createRecord('lookup', {
                id: lookupType
            });          
        }
        if (Ember.isEmpty(lookupItem.get('userCanAdd'))) {
            lookupItem.set('userCanAdd', true);                
        }
        return lookupItem;        
    }.property('lookupType'),
    
    lookupTypeValues: Ember.computed.alias('lookupTypeList.value'),
    userCanAdd: Ember.computed.alias('lookupTypeList.userCanAdd'),
    
    actions: {
        addValue: function() {
        },
        deleteValue: function(value) {
            var lookupTypeList = this.get('lookupTypeList'),
                lookupTypeValues = this.get('lookupTypeValues');
            lookupTypeValues.removeObject(value.toString());        
            lookupTypeList.save().then(function(list) {
                console.log("list saved:",list);
            }, function(err) {
                console.log("ERROR SAVING LIST:",err);
            });
        },
        editValue: function(value) {
            if (!Ember.isEmpty(value)) {
            }
        },
        updateList: function() {
            var lookupTypeList = this.get('lookupTypeList');
            lookupTypeList.save().then(function(list) {
                console.log("list saved:",list);
            }, function(err) {
                console.log("ERROR SAVING LIST:",err);
            });
        }
    }
});
export default Ember.ArrayController.extend({
    lookupType: null,
    lookupTypes: [{
        name: 'Clinic Locations',
        value: 'clinic_list',
        models: { //Models that use this lookup -- use this later to update models on lookup changes
            patient: 'clinic',
            visit: 'clinic'
        }
    }, {
        name: 'Countries',
        value: 'country_list',
        models: {
            patient: 'country'
        }
    }, {
        name: 'Expense Accounts',
        value: 'expense_account_list',
        models: {
            'inv-request':  'expenseAccount'
        }
    }, {
        name: 'Imaging Types',
        value: 'imaging_types',
        models: {
            imaging: 'imagingType'
        }
    }, {
        name: 'Inventory Aisle Locations',
        value: 'aisle_location_list',
        models: {
            inventory: 'aisleLocation',
            'inv-location': 'aisleLocation',
            'inv-purchase': 'aisleLocation',
            'inv-request':  [
                'deliveryAisle',
                'locationsAffected' //Special use case that we need to handle
            ]
        }
    }, {
        name: 'Inventory Locations',
        value: 'warehouse_list',
        models: {
            inventory:  'location',
            'inv-location': 'location',
            'inv-purchase': 'location',
            'inv-request':  [
                'deliveryLocation',
                 'locationsAffected' //Special use case that we need to handle
            ]
        }
    }, {
        name: 'Lab Types',
        value: 'lab_types',
        models: {
            lab: 'labType'
        }
    }, {
        name: 'Medication Frequency',
        value: 'medication_frequency',
        models: {
            medication: 'frequency'
        }
    }, {
        name: 'Physicians',
        value: 'physician_list', 
        models: {
            appointment: 'provider',
            visit: 'examiner',
            procedure: [
                'assistant',
                'physician'
            ]
        }
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
                id: lookupType,
                value: []
            });          
        }
        if (Ember.isEmpty(lookupItem.get('userCanAdd'))) {
            lookupItem.set('userCanAdd', true);                
        } 
        return lookupItem;
    }.property('lookupType'),
    
    lookupTypeValues: function() {
        var values = this.get('lookupTypeList.value');
        values.sort(this._sortValues);
        return Ember.ArrayProxy.create({content: Ember.A(values)});
    }.property('lookupType'),
    
    userCanAdd: Ember.computed.alias('lookupTypeList.userCanAdd'),
    
    _sortValues: function(a, b) {
        return Ember.compare(a.toLowerCase(), b.toLowerCase());
    },
    
    actions: {
        addValue: function() {
            this.send('openModal', 'admin.lookup.edit', Ember.Object.create({
                isNew: true
            }));
        },
        deleteValue: function(value) {
            var lookupTypeList = this.get('lookupTypeList'),
                lookupTypeValues = lookupTypeList.get('value');
            lookupTypeValues.removeObject(value.toString());        
            lookupTypeList.save();
        },
        editValue: function(value) {
            if (!Ember.isEmpty(value)) {
                this.send('openModal', 'admin.lookup.edit', Ember.Object.create({
                    isNew: false,
                    originalValue: value.toString(),
                    value: value.toString()
                }));
            }
        },
        updateList: function() {
            var lookupTypeList = this.get('lookupTypeList');
            lookupTypeList.save();
        },        
        updateValue: function(valueObject) {
             var updateList = false,
                 lookupTypeList = this.get('lookupTypeList'),
                 lookupTypeValues = this.get('lookupTypeValues'),
                 values = lookupTypeList.get('value'),
                 value = valueObject.get('value');
            if (valueObject.get('isNew')) {
                updateList = true;
            } else {
                var originalValue = valueObject.get('originalValue');
                if (value !== originalValue) {
                    lookupTypeValues.removeObject(originalValue);
                    updateList = true;
                    //TODO UPDATE ALL EXISTING DATA LOOKUPS (NODEJS JOB)
                }
            }
            if (updateList) {
                values.addObject(value);
                values = values.sort(this._sortValues);
                lookupTypeList.set('value', values);                
                lookupTypeList.save().then(function(list) {
                    //Make sure that the list on screen gets updated with the sorted items.
                    var values = Ember.copy(list.get('value'));
                    lookupTypeValues.clear();
                    lookupTypeValues.addObjects(values);
                });
                
            }
        }
    }
});
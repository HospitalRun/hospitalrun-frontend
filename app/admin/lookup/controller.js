import Ember from "ember";
import BillingCategories from 'hospitalrun/mixins/billing-categories';
import LabPricingTypes from 'hospitalrun/mixins/lab-pricing-types';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import ImagingPricingTypes from 'hospitalrun/mixins/imaging-pricing-types';
import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';
export default Ember.ArrayController.extend(BillingCategories, LabPricingTypes, 
        ModalHelper, ImagingPricingTypes, InventoryTypeList, {
    lookupType: null,
    lookupTypes: [{
        name: 'Anesthesia Types',
        value: 'anesthesia_types',        
        model: {        
            procedure: 'anesthesiaType'
        }
    }, {
        name: 'Anesthesiologists',
        value: 'anesthesiologists',
        model: {
            procedure: 'anesthesiologist'
        }
    }, {
        defaultValues: 'defaultBillingCategories',
        name: 'Billing Categories',
        value: 'billing_categories',
        models: {
            'billing-line-item': 'category'
        }
    }, {
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
            'inv-request':  'expenseAccount',
            pricing: 'expenseAccount',
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
        defaultValues: 'defaultInventoryTypes',
        name: 'Inventory Types',
        value: 'inventory_types',
        models: {
            inventory:  'type'
        }
    }, {
        defaultValues: 'defaultImagingPricingTypes',
        name: 'Imaging Pricing Types',
        value: 'imaging_pricing_types',
        models: {
            pricing:  'type'
        }
    }, {
        defaultValues: 'defaultLabPricingTypes',
        name: 'Lab Pricing Types',
        value: 'lab_pricing_types',
        models: {
            pricing:  'type'
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
        name: 'Procedure Locations',
        value: 'procedure_locations',
        models: {
            procedure: 'location'         
        }
    }, {
        name: 'Procedure Pricing Types',
        value: 'procedure_pricing_types',
        models: {
            pricing:  'type'
        }
    }, {
        name: 'Visit Locations',
        value: 'visit_location_list',
        models: {
            appointment: 'location',
            visit: 'location',            
        }
    }, {
        name: 'Ward Pricing Types',
        value: 'ward_pricing_types',
        models: {
            pricing:  'type'
        }
    }],
    
    lookupTitle: function() {
        var lookupType = this.get('lookupType'),
            lookupTypes = this.get('lookupTypes'),
            lookupDesc;
        if (!Ember.isEmpty(lookupType)) {
            lookupDesc = lookupTypes.findBy('value', lookupType);
            if (!Ember.isEmpty(lookupDesc)) {
                return lookupDesc.name;
            }
        }            
    }.property('lookupType'),
        
    lookupTypeList: function() {
        var lookupType = this.get('lookupType'),
            lookupItem;        
        if (!Ember.isEmpty(lookupType)) {
            lookupItem = this.get('model').findBy('id', lookupType);
            if (Ember.isEmpty(lookupItem)) {
                var defaultValues = [],
                    lookupTypes = this.get('lookupTypes'),
                    lookupDesc = lookupTypes.findBy('value', lookupType);
                if (!Ember.isEmpty(lookupDesc) && !Ember.isEmpty(lookupDesc.defaultValues)) {
                    defaultValues = this.get(lookupDesc.defaultValues);
                }
                lookupItem = this.get('store').push('lookup', {
                    id: lookupType,
                    value: defaultValues
                });          
            }
            if (!Ember.isEmpty(lookupItem) && Ember.isEmpty(lookupItem.get('userCanAdd'))) {
                lookupItem.set('userCanAdd', true);                
            } 
            return lookupItem;
        }
    }.property('lookupType'),
    
    lookupTypeValues: function() {
        var values = this.get('lookupTypeList.value');
        if (!Ember.isEmpty(values)) {
            values.sort(this._sortValues);
        }
        return Ember.ArrayProxy.create({content: Ember.A(values)});
    }.property('lookupType'),
    
    organizeByType: Ember.computed.alias('lookupTypeList.organizeByType'),
    
    showOrganizeByType: function() {
        var lookupType = this.get('lookupType');
        return (!Ember.isEmpty(lookupType) && lookupType.indexOf('pricing_types') > 0);
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
            var lookupType = this.get('lookupType'),
                lookupTypeList = this.get('lookupTypeList'),
                lookupTypeValues = lookupTypeList.get('value');
            if (lookupType === 'inventory_types' && value === 'Medication') {
                this.displayAlert('Cannot Delete Medication', 'The Medication inventory type cannot be deleted because it is needed for the Medication module.');
            } else if (lookupType === 'lab_pricing_types' && value === 'Lab Procedure') {
                this.displayAlert('Cannot Delete Lab Pricing Type', 'The Lab Procedure pricing type cannot be deleted because it is needed for the Labs module.');
            } else if (lookupType === 'imaging_pricing_types' && value === 'Imaging Procedure') {
                this.displayAlert('Cannot Delete Imaging Pricing Type', 'The Imaging Procedure pricing type cannot be deleted because it is needed for the Imaging module.');
            } else {
                lookupTypeValues.removeObject(value.toString());        
                lookupTypeList.save();
            }
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
            lookupTypeList.save().then(function() {
                this.displayAlert('List Saved', 'The lookup list has been saved');
            }.bind(this));
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